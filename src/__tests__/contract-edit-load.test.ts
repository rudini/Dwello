import { describe, it, expect } from 'vitest';
import { load } from '../routes/contracts/[id]/edit/+page.server';

const backend: Record<string, unknown> = {
	'/api/v1/contracts/c1': { id: 'c1', tenantId: 't1', apartmentId: 'a1', startDate: '2024-04-01', baseRent: '950.00' },
	'/api/v1/tenants?limit=100': { tenants: [{ id: 't1', firstName: 'Anna', lastName: 'Keller' }], total: 1 },
	'/api/v1/apartments?limit=100': {
		apartments: [{ id: 'a1', number: '2.01', buildingName: 'Ahornhof', status: 'occupied' }],
		total: 1
	}
};

const fetch = async (url: string) => Response.json(backend[new URL(url).pathname + new URL(url).search]);

describe('Mietvertrag bearbeiten laden', () => {
	it('bietet die Mieter und Wohnungen aus dem Backend zur Auswahl an', async () => {
		const data = await load({ params: { id: 'c1' }, fetch } as never);

		expect(data).toMatchObject({
			tenants: [{ id: 't1', name: 'Anna Keller' }],
			apartments: [{ id: 'a1', unit: '2.01', building: 'Ahornhof' }]
		});
	});
});
