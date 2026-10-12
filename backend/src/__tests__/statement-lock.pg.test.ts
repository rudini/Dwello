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
			expect(sent).toMatchObject({ status: 'paid', paidDate: today, statementDate: today });
		} finally {
			await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
		}
	});
});

