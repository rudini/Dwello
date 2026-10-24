/**
 * The days a contract may end on (#788): never before its start, and an end before today only once the landlord
 * confirmed it (a notice recorded late, A-1); decided in the backend on every save, by the Swiss day
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { sendJson } from './helpers/auth';
import { createRental } from './helpers/rental';

const rentals: Awaited<ReturnType<typeof createRental>>[] = [];

async function rental(endDate?: string) {
	const created = await createRental(crypto.randomUUID(), { startDate: '2024-04-01', endDate, monthlyAdvancePayment: '100' });
	rentals.push(created);
	return created.contract;
}
const save = async (contract: string, body: Record<string, unknown>) => {
	const response = await sendJson('PUT', `/api/v1/contracts/${contract}`, body);
	return { status: response.status, body: (await response.json()) as Record<string, unknown> };
};

afterAll(async () => {
	for (const created of rentals) await created.remove();
});

describe('Vertragsende', () => {
	it('lehnt ein Vertragsende vor dem Vertragsbeginn ab', async () => {
		const contract = await rental();

		expect(await save(contract, { endDate: '2024-03-31', confirmPastEnd: true })).toMatchObject({
			status: 400,
			body: { code: 'CONTRACT_END_BEFORE_START', params: { date: '2024-04-01' } }
		});
	});

	// review p5b C-2: a later start behind the stored end is refused as well
	it('lehnt einen Vertragsbeginn nach dem gespeicherten Vertragsende ab', async () => {
		const contract = await rental('2025-03-31');

		expect(await save(contract, { startDate: '2025-04-01' })).toMatchObject({
			status: 400,
			body: { code: 'CONTRACT_END_BEFORE_START', params: { date: '2025-04-01' } }
		});
	});

	// a notice recorded late: the landlord confirms the consequence, the contract has ended (A-1)
	it('speichert ein Vertragsende vor heute nur, wenn es bestätigt ist', async () => {
		const contract = await rental();

		expect(await save(contract, { endDate: '2025-03-31', terminated: true })).toMatchObject({
			status: 400,
			body: { code: 'CONTRACT_END_PAST', params: { date: '2025-03-31' } }
		});
		expect(await save(contract, { endDate: '2025-03-31', terminated: true, confirmPastEnd: true })).toMatchObject({
			status: 200,
			body: { endDate: '2025-03-31' }
		});
	});

	// Fachreview #459 V-3: «Bearbeiten» sends the stored end again; it was confirmed when it was set
	it('speichert ein schon gespeichertes Vertragsende ohne neue Bestätigung', async () => {
		const contract = await rental('2025-03-31');

		expect(await save(contract, { endDate: '2025-03-31', notes: 'Schlüssel zurück' })).toMatchObject({ status: 200 });
	});
});
