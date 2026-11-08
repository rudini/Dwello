/**
 * #1257: an apartment is deleted only without rental contracts, ended ones included (real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, rentalContracts } from '../db/schema';
import { createApartment } from '../services/apartment.service';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
const removals: (() => Promise<void>)[] = [];

afterAll(async () => {
	for (const remove of removals) await remove();
});

const remove = (id: string) => callApi(`/api/v1/apartments/${id}`, { method: 'DELETE' });

describe('Wohnung löschen', () => {
	it('löscht eine Wohnung ohne Mietverträge', async () => {
		const rental = await createRental(`${token}-a`, { startDate: '2020-01-01', monthlyAdvancePayment: '150' });
		removals.push(rental.remove);
		const free = await createApartment({ buildingId: rental.building, number: '2.02', floor: 2, area: '60', rooms: '2.5' });

		const response = await remove(free.id);

		expect(response.status).toBe(204);
		expect(await db.select().from(apartments).where(eq(apartments.id, free.id))).toEqual([]);
	});

	it('lehnt eine Wohnung mit beendetem Mietvertrag mit Code ab und behält den Mietvertrag', async () => {
		const rental = await createRental(`${token}-b`, {
			startDate: '2019-01-01',
			endDate: '2024-03-31',
			monthlyAdvancePayment: '150'
		});
		removals.push(rental.remove);

		const response = await remove(rental.apartment);

		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'APARTMENT_HAS_CONTRACTS' });
		const kept = await db.select().from(rentalContracts).where(eq(rentalContracts.id, rental.contract));
		expect(kept).toHaveLength(1);
	});

	it('lehnt eine Wohnung mit laufendem Mietvertrag mit Code ab', async () => {
		const rental = await createRental(`${token}-c`, { startDate: '2020-01-01', monthlyAdvancePayment: '150' });
		removals.push(rental.remove);

		const response = await remove(rental.apartment);

		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'APARTMENT_HAS_CONTRACTS' });
	});
});
