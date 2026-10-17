/**
 * A sent or paid statement is corrected by a berichtigte Abrechnung (#120, #358), against the real database
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices, utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection, idOf, insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

type Statement = {
	id: string;
	status: string;
	statementNumber: string;
	statementDate: string;
	balance: string;
	totalCosts: string;
	totalAdvancePayments: string;
	paidDate: string | null;
	paidAmount: string | null;
	priorPayments: string;
	replaces: { id: string; statementNumber: string; statementDate: string } | null;
	replacedBy: { id: string; statementNumber: string } | null;
};

let rental: Awaited<ReturnType<typeof createRental>>;
const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
const statement = async (id: string) => (await (await callApi(`/api/v1/statements/${id}`)).json()) as Statement;

// The rental's statement 2025, sent to the tenant
async function sentStatement() {
	const id = await idOf(
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2025-01-01',
			periodEnd: '2025-12-31'
		})
	);
	await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'sent' });
	return id;
}
const replace = (id: string) => sendJson('POST', `/api/v1/statements/${id}/replace`, {});
const correct = (id: string) => sendJson('POST', `/api/v1/statements/${id}/correction`, {});
const removeStatements = () => db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2025-01-01', monthlyAdvancePayment: '100' });
	await insertInvoice(rental.building, { amount: '1200.00', invoiceDate: '2025-03-31' });
});

afterAll(async () => {
	await removeStatements();
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('Abrechnung ersetzen', () => {
	it('ersetzt eine versendete Abrechnung und behält ihren Saldo', async () => {
		const id = await sentStatement();
		const before = await statement(id);

		const response = await replace(id);

		expect(response.status).toBe(200);
		expect(await statement(id)).toMatchObject({ status: 'replaced', balance: before.balance, statementNumber: before.statementNumber });
	});

	it('behält bei einer bezahlten Abrechnung Zahlungsdatum und Betrag', async () => {
		const id = await sentStatement();
		await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate: today() });

		await replace(id);

		expect(await statement(id)).toMatchObject({ status: 'replaced', paidDate: today() });
	});

	it('ersetzt keinen Entwurf', async () => {
		const id = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2026-01-01',
				periodEnd: '2026-12-31'
			})
		);

		await expectRejection(await replace(id), 409, 'Only a sent or paid statement can be replaced', 'STATEMENT_NOT_REPLACEABLE');
	});

	it('lässt die ersetzte Abrechnung nicht mehr als bezahlt markieren', async () => {
		const id = await sentStatement();
		await replace(id);

		const response = await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate: today() });

		expect(response.status).toBe(400);
		expect((await statement(id)).status).toBe('replaced');
	});

	it('mahnt eine überfällige Abrechnung nach dem Ersetzen nicht mehr', async () => {
		const id = await sentStatement();
		await sendJson('PUT', `/api/v1/statements/${id}`, { paymentDeadline: '2026-01-31' });
		await replace(id);

		const response = await sendJson('POST', `/api/v1/statements/${id}/reminders`, {});

		expect(response.status).toBe(400);
		expect(((await response.json()) as { code: string }).code).toBe('REMINDER_NOT_SENT');
	});
});

describe('Berichtigte Abrechnung', () => {
	it('erhält eine neue Nummer und nennt die ersetzte Abrechnung', async () => {
		const id = await sentStatement();
		const old = await statement(id);
		await replace(id);

		const response = await correct(id);

		expect(response.status).toBe(201);
		const corrected = (await response.json()) as Statement;
		expect(corrected.status).toBe('draft');
		expect(corrected.statementNumber).not.toBe(old.statementNumber);
		expect(corrected.replaces).toEqual({ id, statementNumber: old.statementNumber, statementDate: old.statementDate });
		expect((await statement(id)).replacedBy).toEqual({ id: corrected.id, statementNumber: corrected.statementNumber });
	});

	it('rechnet an, was auf die ersetzte Abrechnung bezahlt wurde, und rundet den Saldo auf 5 Rappen', async () => {
		const id = await sentStatement();
		await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate: today(), paidAmount: '100.03' });
		await replace(id);

		const corrected = (await (await correct(id)).json()) as Statement;

		expect(corrected.priorPayments).toBe('100.03');
		const unrounded = Number(corrected.totalCosts) - Number(corrected.totalAdvancePayments) - 100.03;
		expect(Number(corrected.balance)).toBe(Math.floor(Math.round(unrounded * 100) / 5) / 20);
	});

	it('rechnet bei einer nur versendeten Abrechnung nichts an', async () => {
		const id = await sentStatement();
		await replace(id);

		expect(((await (await correct(id)).json()) as Statement).priorPayments).toBe('0.00');
	});

	it('rechnet auch an, was die ersetzte Abrechnung selbst schon angerechnet hat', async () => {
		const first = await sentStatement();
		await sendJson('PUT', `/api/v1/statements/${first}/status`, { status: 'paid', paidDate: today(), paidAmount: '200.00' });
		await replace(first);
		const second = ((await (await correct(first)).json()) as Statement).id;
		await sendJson('PUT', `/api/v1/statements/${second}/status`, { status: 'sent' });
		await sendJson('PUT', `/api/v1/statements/${second}/status`, { status: 'paid', paidDate: today(), paidAmount: '50.00' });
		await replace(second);

		expect(((await (await correct(second)).json()) as Statement).priorPayments).toBe('250.00');
	});

	it('wird nur für eine ersetzte Abrechnung erstellt', async () => {
		const id = await sentStatement();

		await expectRejection(await correct(id), 409, 'Statement is not replaced', 'STATEMENT_NOT_REPLACED');
	});

	it('gibt es nur einmal', async () => {
		const id = await sentStatement();
		await replace(id);
		const corrected = (await (await correct(id)).json()) as Statement;

		await expectRejection(await correct(id), 409, 'Statement already has a berichtigte Abrechnung', 'STATEMENT_ALREADY_CORRECTED', {
			number: corrected.statementNumber
		});
	});

	it('lässt sich nach dem Löschen ihres Entwurfs neu erstellen', async () => {
		const id = await sentStatement();
		await replace(id);
		const corrected = (await (await correct(id)).json()) as Statement;
		await callApi(`/api/v1/statements/${corrected.id}`, { method: 'DELETE' });

		expect((await statement(id)).replacedBy).toBeNull();
		expect((await correct(id)).status).toBe(201);
	});

	it('rechnet eine schon bezahlte Rückerstattung dazu', async () => {
		const id = await sentStatement();
		await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate: today(), paidAmount: '-20.00' });
		await replace(id);

		const corrected = (await (await correct(id)).json()) as Statement;

		expect(corrected.priorPayments).toBe('-20.00');
		const unrounded = Number(corrected.totalCosts) - Number(corrected.totalAdvancePayments) + 20;
		expect(Number(corrected.balance)).toBe(Math.floor(Math.round(unrounded * 100) / 5) / 20);
	});

	// Fachreview W2e V-4: der Betrag enthält die Zahlungen der ganzen Kette, die Abrechnung nennt jede davon
	it('nennt jede ersetzte Abrechnung, auf die schon bezahlt wurde', async () => {
		const first = await sentStatement();
		await sendJson('PUT', `/api/v1/statements/${first}/status`, { status: 'paid', paidDate: today(), paidAmount: '200.00' });
		await replace(first);
		const second = ((await (await correct(first)).json()) as Statement).id;
		await sendJson('PUT', `/api/v1/statements/${second}/status`, { status: 'sent' });
		await replace(second);

		const third = (await (await correct(second)).json()) as Statement & { priorPaidOn: string[] };

		expect(third.priorPayments).toBe('200.00');
		expect(third.priorPaidOn).toEqual([(await statement(first)).statementNumber]);
	});

	it('entsteht auch im Abrechnungslauf der Periode', async () => {
		const id = await sentStatement();
		await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate: today(), paidAmount: '80.00' });
		await replace(id);

		const generated = (await (
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2025-01-01',
				periodEnd: '2025-12-31'
			})
		).json()) as Statement;

		expect(generated).toMatchObject({ priorPayments: '80.00', replaces: { id } });
	});
});

// Fachreview W2e V-3: eine Abrechnung einer anderen, nur überlappenden Periode rechnet keine Zahlung an
it('verknüpft im Abrechnungslauf keine Abrechnung einer anderen Periode', async () => {
	const id = await sentStatement();
	await replace(id);

	const generated = (await (
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2025-07-01',
			periodEnd: '2026-06-30'
		})
	).json()) as Statement;

	expect(generated).toMatchObject({ priorPayments: '0.00', replaces: null });
	await callApi(`/api/v1/statements/${generated.id}`, { method: 'DELETE' });
});

describe('Vertragsdaten nach dem Ersetzen', () => {
	it('lassen sich ändern, auch wenn sie die Mietstage der ersetzten Abrechnung ändern', async () => {
		await removeStatements();
		const id = await sentStatement();
		expect((await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { startDate: '2025-05-01' })).status).toBe(409);

		await replace(id);

		expect((await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { startDate: '2025-05-01' })).status).toBe(200);
	});
});

// Persona Anna I4, Fachreview W2e V-5: ohne Mietstage in der Periode gibt es keine berichtigte Abrechnung
describe('Ohne Mietstage in der Periode', () => {
	it('sagt je nach Zahlung, was zu tun ist', async () => {
		await removeStatements();
		await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { startDate: '2025-01-01' });
		const paid = await sentStatement();
		await sendJson('PUT', `/api/v1/statements/${paid}/status`, { status: 'paid', paidDate: today(), paidAmount: '36.00' });
		const refunded = await sentStatement();
		await sendJson('PUT', `/api/v1/statements/${refunded}/status`, { status: 'paid', paidDate: today(), paidAmount: '-20.00' });
		const sent = await sentStatement();
		for (const id of [paid, refunded, sent]) await replace(id);
		await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { startDate: '2026-02-01' });
		const number = async (id: string) => (await statement(id)).statementNumber;

		await expectRejection(await correct(paid), 409, 'The contract has no rent days in the period', 'STATEMENT_NO_RENTAL_DAYS_PAID', {
			number: await number(paid),
			amount: '36.00'
		});
		await expectRejection(await correct(refunded), 409, 'The contract has no rent days in the period', 'STATEMENT_NO_RENTAL_DAYS_REFUNDED', {
			number: await number(refunded),
			amount: '20.00'
		});
		await expectRejection(await correct(sent), 409, 'The contract has no rent days in the period', 'STATEMENT_NO_RENTAL_DAYS_SENT', {
			number: await number(sent),
			amount: '0.00'
		});
	});
});
