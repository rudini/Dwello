/**
 * Whether a new contract can be recorded for an apartment, as the contract wizard offers it (#815): an open-ended
 * contract blocks it; otherwise it is free from the day after its last Vertragsende, or now once that day has passed.
 * Decided in the backend by the Swiss day
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { rentalContracts } from '../db/schema';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createContract } from '../services/contract.service';
import { daysAfter, swissToday } from '../services/today';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const rentals: Awaited<ReturnType<typeof createRental>>[] = [];
const extra: string[] = [];

async function rental(endDate?: string) {
	const created = await createRental(crypto.randomUUID(), { startDate: '2020-04-01', endDate, monthlyAdvancePayment: '100' });
	rentals.push(created);
	return created;
}
const availability = async (apartment: string) => {
	const { blocked, availableFrom } = (await (await callApi(`/api/v1/apartments/${apartment}`)).json()) as Record<string, unknown>;
	return { blocked, availableFrom };
};

afterAll(async () => {
	for (const id of extra) await deleteApartment(id);
	for (const created of rentals) {
		await db.delete(rentalContracts).where(eq(rentalContracts.apartmentId, created.apartment));
		await created.remove();
	}
});

describe('Verfügbarkeit einer Wohnung für einen neuen Mietvertrag', () => {
	it('ist ohne Mietvertrag und nach dem letzten Vertragsende frei', async () => {
		const { building } = await rental('2021-03-31');
		const empty = await createApartment({ buildingId: building, number: 'L1', floor: 0, area: '40', rooms: '1.5' });
		extra.push(empty.id);
		const ended = rentals.at(-1)!;

		expect(await availability(empty.id)).toEqual({ blocked: false, availableFrom: null });
		expect(await availability(ended.apartment)).toEqual({ blocked: false, availableFrom: null });
	});

	// review i815b2 C-3: the day after a Vertragsende of yesterday is today: free now, not «ab heute»
	it('ist nach einem Vertragsende gestern ab sofort frei', async () => {
		const yesterday = await rental(daysAfter(swissToday(), -1));

		expect(await availability(yesterday.apartment)).toEqual({ blocked: false, availableFrom: null });
	});

	it('ist ab dem Tag nach dem letzten Vertragsende frei, solange dieser Tag noch kommt', async () => {
		const later = await rental('2099-03-31');
		const endsToday = await rental(swissToday());

		expect(await availability(later.apartment)).toEqual({ blocked: false, availableFrom: '2099-04-01' });
		expect(await availability(endsToday.apartment)).toEqual({ blocked: false, availableFrom: daysAfter(swissToday(), 1) });
	});

	it('nimmt das späteste Vertragsende', async () => {
		const first = await rental('2021-03-31');
		await createContract({ apartmentId: first.apartment, tenantId: first.tenant, baseRent: '950', monthlyAdvancePayment: '100', startDate: '2099-01-01', endDate: '2099-06-30' });

		expect(await availability(first.apartment)).toEqual({ blocked: false, availableFrom: '2099-07-01' });
	});

	it('ist mit einem unbefristeten Mietvertrag belegt', async () => {
		const open = await rental();

		expect(await availability(open.apartment)).toEqual({ blocked: true, availableFrom: null });
	});
});
