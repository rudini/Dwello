/**
 * A statement that left the draft stays as it was sent (scenario D1), against the real database
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { utilityStatements } from '../db/schema';
import { updateStatement } from '../services/statement.service';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection, idOf } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;
let statementId: string;
let sentId: string;

const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });

// A statement of the rental for one year, sent to the tenant
async function sentStatement(year: number) {
	const id = await idOf(
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: `${year}-01-01`,
			periodEnd: `${year}-12-31`
		})
	);
	await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'sent' });
	return id;
}

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2023-01-01', monthlyAdvancePayment: '100' });
	sentId = await sentStatement(2023);
	// Overdue is not set by hand: the payment deadline has passed
	statementId = await sentStatement(2024);
	const overdue = await sendJson('PUT', `/api/v1/statements/${statementId}`, { paymentDeadline: '2025-01-31' });
	expect(await overdue.json()).toMatchObject({ status: 'overdue' });
});

afterAll(async () => {
	// Locked statements cannot be deleted through the API
	await db.delete(utilityStatements).where(inArray(utilityStatements.id, [statementId, sentId]));
	await rental.remove();
});

describe('Versendete Abrechnung', () => {
	// Überfällig ist sie erst, wenn die Zahlungsfrist abgelaufen ist; sonst fehlte sie in den Filtern und Zahlen
	it('lässt sich nicht von Hand auf überfällig setzen', async () => {
		const response = await sendJson('PUT', `/api/v1/statements/${sentId}/status`, { status: 'overdue' });

		await expectRejection(response, 400, 'Invalid status transition from sent to overdue');
	});
});

describe('Überfällige Abrechnung', () => {
	it('lässt sich nicht löschen', async () => {
		await expectRejection(
			await callApi(`/api/v1/statements/${statementId}`, { method: 'DELETE' }),
			400,
			'Cannot delete a statement that is no longer a draft',
			'STATEMENT_NOT_DRAFT'
		);
		expect((await callApi(`/api/v1/statements/${statementId}`)).status).toBe(200);
	});

	it('bekommt keine weiteren Abrechnungspositionen', async () => {
		await expectRejection(
			await sendJson('POST', `/api/v1/statements/${statementId}/line-items`, {
				items: [{ description: 'Nachtrag', totalAmount: '50.00', tenantShare: '50.00' }]
			}),
			400,
			'Cannot add line items to a statement that is no longer a draft'
		);
	});

	it('behält ihre Beträge', async () => {
		await expect(updateStatement(statementId, { balance: '0.00' })).rejects.toThrow(
			'Cannot modify balance for a statement that is no longer a draft'
		);
		await expect(updateStatement(statementId, { managementFeePercent: '5.00' })).rejects.toThrow(
			'Cannot modify managementFeePercent for a statement that is no longer a draft'
		);
	});
});

// Ein Saldo von 0 (oft nach der Rundung auf 5 Rappen) ist mit dem Versenden erledigt: nichts zu zahlen, nichts
// zurückzuerstatten; sonst würde die Abrechnung nach der Zahlungsfrist überfällig und verlangte eine Prüfung
describe('Abrechnung mit Saldo 0', () => {
	it('ist mit dem Versenden bezahlt', async () => {
		const id = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2025-01-01',
				periodEnd: '2025-12-31'
			})
		);
		await db.update(utilityStatements).set({ balance: '0.00' }).where(eq(utilityStatements.id, id));
		try {
			const sent = await (await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'sent' })).json();
			const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
			// the Saldo stored as the amount paid (#93)
			expect(sent).toMatchObject({ status: 'paid', paidDate: today, statementDate: today, paidAmount: '0.00' });
		} finally {
			await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
		}
	});
});

const markPaid = (id: string, paidDate: string) => sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate });

// #138: das Zahlungsdatum liegt zwischen dem Abrechnungsdatum (beim Versenden der Tag des Versands) und heute
describe('Zahlungsdatum', () => {
	it('ist ein Tag, den es gibt', async () => {
		for (const day of ['2025-02-30', '2025-13-01', ''])
			await expectRejection(await markPaid(statementId, day), 400, 'Invalid payment date', 'PAID_DATE_INVALID', { date: day });
	});

	it('liegt nicht vor dem Abrechnungsdatum', async () => {
		await expectRejection(await markPaid(statementId, '2020-01-01'), 400, 'Payment date before the statement date', 'PAID_DATE_BEFORE_STATEMENT', { date: today() });
	});

	it('liegt nicht in der Zukunft', async () => {
		await expectRejection(await markPaid(statementId, '2099-01-01'), 400, 'Payment date in the future', 'PAID_DATE_IN_FUTURE', { date: today() });
		expect(await (await callApi(`/api/v1/statements/${statementId}`)).json()).toMatchObject({ status: 'overdue', paidDate: null });
	});
});

// #92: eine erfasste Zahlung lässt sich zurücksetzen; der Verlauf behält das Zurücksetzen
describe('Zahlung zurücksetzen', () => {
	const reset = (id: string) => callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' });

	it('macht eine bezahlte Abrechnung wieder versendet, ohne Zahlungsdatum und Betrag', async () => {
		await markPaid(sentId, today());
		const response = await reset(sentId);

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ status: 'sent', paidDate: null, paidAmount: null, statementDate: today() });
		const stored = (await (await callApi(`/api/v1/statements/${sentId}`)).json()) as { balance: string; paymentResets: unknown[] };
		expect(stored.paymentResets).toEqual([{ resetOn: today(), paidDate: today(), paidAmount: stored.balance }]);
	});

	// das PDF beim Versand nennt keine Zahlung: es bleibt, und mit ihm der Eintrag im Verlauf (Persona Dr. Weber P-1)
	it('behält das PDF, das vor der Zahlung erstellt wurde', async () => {
		const yesterday = new Date(Date.now() - 86_400_000);
		await markPaid(sentId, today());
		await db.update(utilityStatements).set({ pdfBlob: 'JVBERi0=', pdfGeneratedAt: yesterday }).where(eq(utilityStatements.id, sentId));
		await reset(sentId);

		const [row] = await db.select({ pdfBlob: utilityStatements.pdfBlob }).from(utilityStatements).where(eq(utilityStatements.id, sentId));
		expect(row.pdfBlob).toBe('JVBERi0=');
	});

	// das PDF einer bezahlten Abrechnung sagt «Bezahlt am …»: nach dem Zurücksetzen gilt es nicht mehr (Fachprüfung V-1)
	it('verwirft das PDF, das die Zahlung bestätigt', async () => {
		await markPaid(sentId, today());
		await db.update(utilityStatements).set({ pdfBlob: 'JVBERi0=', pdfGeneratedAt: new Date() }).where(eq(utilityStatements.id, sentId));
		await reset(sentId);

		const [row] = await db.select({ pdfBlob: utilityStatements.pdfBlob, pdfGeneratedAt: utilityStatements.pdfGeneratedAt }).from(utilityStatements).where(eq(utilityStatements.id, sentId));
		expect(row).toEqual({ pdfBlob: null, pdfGeneratedAt: null });
	});

	it('macht eine Abrechnung mit abgelaufener Zahlungsfrist wieder überfällig', async () => {
		await markPaid(statementId, today());
		expect(await (await reset(statementId)).json()).toMatchObject({ status: 'overdue', paidDate: null });
	});

	it('gibt es nur für eine bezahlte Abrechnung', async () => {
		await expectRejection(await reset(statementId), 400, 'Statement is not paid', 'STATEMENT_NOT_PAID');
		await expectRejection(await reset(crypto.randomUUID()), 404, 'Statement not found', 'STATEMENT_NOT_FOUND');
	});
});
