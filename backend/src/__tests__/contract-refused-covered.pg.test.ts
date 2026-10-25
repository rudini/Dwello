/**
 * When new contract dates change the rent days a statement bills, the refusal names each statement and whether
 * «Abgerechnet bis» now covers its whole period (#815): the form then explains deleting the draft as no longer needed
 * (fach review V-10, V-15) instead of computing it from the dates
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { utilityStatements } from '../db/schema';
import { sendJson } from './helpers/auth';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2024-01-01', monthlyAdvancePayment: '100' });
	await db.insert(utilityStatements).values({
		tenantId: rental.tenant,
		apartmentId: rental.apartment,
		contractId: rental.contract,
		statementNumber: `NK-cov-${Date.now()}`,
		periodStart: '2024-01-01',
		periodEnd: '2024-12-31',
		statementDate: '2025-03-01',
		rentalDays: 366,
		rentalStart: '2024-01-01',
		rentalEnd: '2024-12-31',
		totalCosts: '1200.00',
		totalAdvancePayments: '1200.00',
		balance: '0.00'
	});
});

afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await rental.remove();
});

const refused = async (body: Record<string, unknown>) => {
	const response = await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, body);
	expect(response.status).toBe(409);
	return ((await response.json()) as { statements: { status: string; covered: boolean }[] }).statements;
};

describe('Abrechnungen, die neue Vertragsdaten ändern würden', () => {
	it('nennt einen Entwurf, dessen ganze Periode «Abgerechnet bis» nun abdeckt', async () => {
		expect(await refused({ billedUntil: '2024-12-31' })).toEqual([expect.objectContaining({ status: 'draft', covered: true })]);
	});

	it('nennt ihn nicht abgedeckt, wenn ihm Mietstage bleiben', async () => {
		expect(await refused({ billedUntil: '2024-06-30' })).toEqual([expect.objectContaining({ covered: false })]);
		expect(await refused({ startDate: '2024-03-01' })).toEqual([expect.objectContaining({ covered: false })]);
	});
});
