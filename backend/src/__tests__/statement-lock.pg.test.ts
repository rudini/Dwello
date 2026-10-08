/**
 * A statement that left the draft stays as it was sent (scenario D1), against the real database
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { utilityStatements } from '../db/schema';
import { updateStatement } from '../services/statement.service';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection, idOf } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;
let statementId: string;

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2024-01-01', monthlyAdvancePayment: '100' });
	statementId = await idOf(
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31'
		})
	);
	await sendJson('PUT', `/api/v1/statements/${statementId}/status`, { status: 'sent' });
	const overdue = await sendJson('PUT', `/api/v1/statements/${statementId}/status`, { status: 'overdue' });
	expect(await overdue.json()).toMatchObject({ status: 'overdue' });
});

afterAll(async () => {
	// Locked statements cannot be deleted through the API
	await db.delete(utilityStatements).where(eq(utilityStatements.id, statementId));
	await rental.remove();
});

describe('Überfällige Abrechnung', () => {
	it('lässt sich nicht löschen', async () => {
		await expectRejection(
			await callApi(`/api/v1/statements/${statementId}`, { method: 'DELETE' }),
			400,
			'Cannot delete a statement that is no longer a draft'
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
	});
});
