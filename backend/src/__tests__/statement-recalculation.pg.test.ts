/**
 * A draft statement is calculated again from the invoices as they are now (#338), against the real database
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices, utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection, idOf, insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

type Statement = { id: string; status: string; statementNumber: string; totalCosts: string; balance: string; lineItems: unknown[] };

let rental: Awaited<ReturnType<typeof createRental>>;
const statement = async (id: string) => (await (await callApi(`/api/v1/statements/${id}`)).json()) as Statement;
const recalculate = (id: string) => sendJson('POST', `/api/v1/statements/${id}/recalculation`, {});
const generate = async (year: number) =>
	idOf(
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: `${year}-01-01`,
			periodEnd: `${year}-12-31`
		})
	);

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2025-01-01', monthlyAdvancePayment: '100' });
	await insertInvoice(rental.building, { amount: '1200.00', invoiceDate: '2025-03-31' });
});

afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('Entwurf neu berechnen', () => {
	it('rechnet einen Entwurf mit einer später erfassten Rechnung neu und behält seine Nummer', async () => {
		const id = await generate(2025);
		const before = await statement(id);
		await insertInvoice(rental.building, { amount: '600.00', invoiceDate: '2025-09-30' });

		const response = await recalculate(id);

		expect(response.status).toBe(200);
		const after = await statement(id);
		expect(after).toMatchObject({ id, status: 'draft', statementNumber: before.statementNumber });
		expect(Number(after.totalCosts)).toBeGreaterThan(Number(before.totalCosts));
		const changed = (await (await callApi(`/api/v1/statements/${id}/changed-invoices`)).json()) as unknown;
		expect(changed).toMatchObject({ invoiceIds: [] });
	});

	it('rechnet eine versendete oder bezahlte Abrechnung nicht neu', async () => {
		const id = await generate(2026);
		await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'sent' });

		await expectRejection(await recalculate(id), 409, 'Only a draft can be recalculated', 'STATEMENT_NOT_DRAFT');
	});
});
