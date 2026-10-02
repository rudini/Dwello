/**
 * Contract list route against the real PostgreSQL database (docker compose postgres on 5432)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;

const get = async (path: string) => (await callApi(`/api/v1/contracts${path}`)).json();

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-04-01', monthlyAdvancePayment: '0' });
});

afterAll(async () => {
	await rental.remove();
});

describe('GET /api/v1/contracts?search', () => {
	it('findet Mietverträge über den Namen des Mieters', async () => {
		const result = (await get(`?search=${encodeURIComponent(`Anna Keller ${token}`)}`)) as {
			contracts: { id: string }[];
			total: number;
		};

		expect(result.contracts.map((c) => c.id)).toEqual([rental.contract]);
		expect(result.total).toBe(1);
	});

	it('findet Mietverträge über den Gebäudenamen', async () => {
		const result = (await get(`?search=${token}`)) as { contracts: { id: string }[] };

		expect(result.contracts.map((c) => c.id)).toEqual([rental.contract]);
	});
});

describe('GET /api/v1/contracts/:id', () => {
	it('liefert Mieter, Wohnung und Gebäude des Mietvertrags', async () => {
		expect(await get(`/${rental.contract}`)).toMatchObject({
			tenant: { id: rental.tenant, firstName: 'Anna', lastName: `Keller ${token}` },
			apartment: { id: rental.apartment, number: '2.01', floor: 2 },
			building: { id: rental.building, name: `Ahornhof ${token}`, postalCode: '8400', city: 'Winterthur' }
		});
	});
});
