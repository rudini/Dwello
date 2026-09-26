/**
 * Contract list route against the real PostgreSQL database (docker compose postgres on 5432)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { contractRoutes } from '../routes/contracts';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { createContract, deleteContract } from '../services/contract.service';

const token = crypto.randomUUID();
const ids = { building: '', apartment: '', tenant: '', contract: '' };

const list = async (query: string): Promise<{ contracts: { id: string }[]; total: number }> =>
	(await contractRoutes.handle(new Request(`http://localhost/api/v1/contracts?${query}`))).json();

beforeAll(async () => {
	ids.building = (
		await createBuilding({ name: `Ahornhof ${token}`, address: 'Testweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' })
	).id;
	ids.apartment = (
		await createApartment({ buildingId: ids.building, number: '2.01', floor: 2, area: '70', rooms: '3.5' })
	).id;
	ids.tenant = (await createTenant({ firstName: 'Anna', lastName: `Keller ${token}` })).id;
	ids.contract = (
		await createContract({
			apartmentId: ids.apartment,
			tenantId: ids.tenant,
			startDate: '2024-04-01',
			baseRent: '950',
			monthlyAdvancePayment: '0'
		})
	).id;
});

afterAll(async () => {
	await deleteContract(ids.contract);
	await deleteTenant(ids.tenant);
	await deleteApartment(ids.apartment);
	await deleteBuilding(ids.building);
});

describe('GET /api/v1/contracts?search', () => {
	it('findet Mietverträge über den Namen des Mieters', async () => {
		const result = await list(`search=${encodeURIComponent(`Anna Keller ${token}`)}`);

		expect(result.contracts.map((c) => c.id)).toEqual([ids.contract]);
		expect(result.total).toBe(1);
	});

	it('findet Mietverträge über den Gebäudenamen', async () => {
		const result = await list(`search=${token}`);

		expect(result.contracts.map((c) => c.id)).toEqual([ids.contract]);
	});
});

describe('GET /api/v1/contracts/:id', () => {
	it('liefert Mieter, Wohnung und Gebäude des Mietvertrags', async () => {
		const response = await contractRoutes.handle(new Request(`http://localhost/api/v1/contracts/${ids.contract}`));

		expect(await response.json()).toMatchObject({
			tenant: { id: ids.tenant, firstName: 'Anna', lastName: `Keller ${token}` },
			apartment: { id: ids.apartment, number: '2.01', floor: 2 },
			building: { id: ids.building, name: `Ahornhof ${token}`, postalCode: '8400', city: 'Winterthur' }
		});
	});
});
