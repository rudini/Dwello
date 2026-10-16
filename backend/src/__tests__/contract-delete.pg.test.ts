/**
 * Deleting a Mietvertrag (A-7, #116): one that has started only when the landlord confirms it was entered by
 * mistake, one that a statement bills never
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { createRental } from './helpers/rental';

const rentals: Awaited<ReturnType<typeof createRental>>[] = [];
async function rental(startDate: string) {
	const created = await createRental(crypto.randomUUID(), { startDate, monthlyAdvancePayment: '100' });
	rentals.push(created);
	return created;
}
const remove = (contract: string, query = '') => callApi(`/api/v1/contracts/${contract}${query}`, { method: 'DELETE' });
const exists = async (contract: string) => (await callApi(`/api/v1/contracts/${contract}`)).status === 200;

afterAll(async () => {
	for (const created of rentals) {
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, created.contract));
		await created.remove();
	}
});

describe('DELETE /api/v1/contracts/:id', () => {
	it('löscht einen Mietvertrag, der noch nicht begonnen hat', async () => {
		const { contract } = await rental('2099-11-01');

		expect((await remove(contract)).status).toBe(204);
		expect(await exists(contract)).toBe(false);
	});

	it('lehnt einen begonnenen Mietvertrag ohne Bestätigung des Irrtums ab', async () => {
		const { contract } = await rental('2024-04-01');

		const response = await remove(contract);

		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'CONTRACT_STARTED' });
		expect(await exists(contract)).toBe(true);
	});

	it('löscht einen begonnenen Mietvertrag, wenn der Irrtum bestätigt ist', async () => {
		const { contract } = await rental('2024-04-01');

		expect((await remove(contract, '?confirmMistake=true')).status).toBe(204);
		expect(await exists(contract)).toBe(false);
	});

	it('lehnt einen Mietvertrag mit Nebenkostenabrechnung auch mit Bestätigung ab', async () => {
		const { contract, building } = await rental('2024-04-01');
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: contract,
			buildingId: building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31'
		});

		const response = await remove(contract, '?confirmMistake=true');

		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'CONTRACT_HAS_STATEMENTS' });
		expect(await exists(contract)).toBe(true);
	});
});
