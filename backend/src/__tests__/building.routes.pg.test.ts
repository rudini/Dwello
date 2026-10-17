import { afterAll, describe, expect, it } from 'bun:test';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { sendJson } from './helpers/auth';

describe('PUT /api/v1/buildings/:id', () => {
	const created: string[] = [];
	afterAll(async () => {
		for (const id of created) await deleteBuilding(id);
	});

	const typedBuilding = async () => {
		const building = await createBuilding({
			name: `Typtest ${crypto.randomUUID()}`,
			address: 'Testweg 1',
			postalCode: '8400',
			city: 'Winterthur',
			canton: 'ZH',
			buildingType: 'Mehrfamilienhaus'
		});
		created.push(building.id);
		return building.id;
	};

	it('löscht den Gebäudetyp, wenn null gesendet wird', async () => {
		const id = await typedBuilding();

		const response = await sendJson('PUT', `/api/v1/buildings/${id}`, { buildingType: null });

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ buildingType: null });
	});

	it('lehnt einen Gebäudetyp ab, der kein Text ist', async () => {
		const id = await typedBuilding();

		const response = await sendJson('PUT', `/api/v1/buildings/${id}`, { buildingType: 5 });

		expect(response.status).toBe(422);
	});

	// kein Tank oder Tank stillgelegt (#72)
	it('hält fest, dass das Gebäude keinen Tank hat, und liest es wieder', async () => {
		const id = await typedBuilding();

		const response = await sendJson('PUT', `/api/v1/buildings/${id}`, { noTank: true });

		expect(response.status).toBe(200);
		expect(await (await sendJson('GET', `/api/v1/buildings/${id}`)).json()).toMatchObject({ noTank: true });
	});
});
