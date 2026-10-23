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

// Gebäude mit seinen Wohnungen aus dem Gebäuderegister in einem Schritt (#479)
describe('POST /api/v1/buildings mit Wohnungen', () => {
	type Apartment = { id: string; number: string; floor: number; area: string; rooms: string; status: string };
	const read = async <T>(path: string) => (await (await sendJson('GET', path)).json()) as T;
	const buildingsNamed = async (name: string) =>
		(await read<{ buildings: { id: string }[] }>(`/api/v1/buildings?search=${encodeURIComponent(name)}`)).buildings;
	const apartmentsOf = async (id: string) =>
		(await read<{ apartments: Apartment[] }>(`/api/v1/apartments?buildingId=${id}`)).apartments;
	const names: string[] = [];
	afterAll(async () => {
		for (const name of names) {
			for (const building of await buildingsNamed(name)) {
				for (const apartment of await apartmentsOf(building.id)) await sendJson('DELETE', `/api/v1/apartments/${apartment.id}`);
				await deleteBuilding(building.id);
			}
		}
	});

	const building = (apartments: object[]) => {
		const name = `Registertest ${crypto.randomUUID()}`;
		names.push(name);
		return { name, address: 'Lindenweg 155', postalCode: '8400', city: 'Winterthur', canton: 'ZH', apartments };
	};

	it('legt das Gebäude mit seinen Wohnungen an', async () => {
		const body = building([
			{ number: '101', floor: 1, area: '75', rooms: '3' },
			{ number: '201', floor: 2, area: '98', rooms: '4.5' }
		]);

		const response = await sendJson('POST', '/api/v1/buildings', body);

		expect(response.status).toBe(201);
		const { id } = (await response.json()) as { id: string };
		const apartments = await apartmentsOf(id);
		expect(apartments.map((a) => [a.number, a.floor, Number(a.area), Number(a.rooms), a.status])).toEqual([
			['101', 1, 75, 3, 'vacant'],
			['201', 2, 98, 4.5, 'vacant']
		]);
	});

	it('legt nichts an, wenn eine Wohnungsnummer zweimal vorkommt', async () => {
		const body = building([
			{ number: '101', floor: 1, area: '75', rooms: '3' },
			{ number: '101', floor: 2, area: '98', rooms: '4' }
		]);

		const response = await sendJson('POST', '/api/v1/buildings', body);

		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'APARTMENT_NUMBER_TAKEN', params: { number: '101' } });
		expect(await buildingsNamed(body.name)).toEqual([]);
	});

	it('legt auch das Gebäude nicht an, wenn eine Wohnung nicht gespeichert werden kann', async () => {
		const body = building([{ number: '101', floor: 1.5, area: '75', rooms: '3' }]); // floor is an integer column

		const response = await sendJson('POST', '/api/v1/buildings', body);

		expect(response.status).toBe(400);
		expect(await buildingsNamed(body.name)).toEqual([]);
	});

	// H-28 (#717): the checks of the form are the backend's; every failed one with its field, nothing created
	it('nennt jedes ungültige Feld mit seinem Code und legt nichts an', async () => {
		const body = { ...building([{ number: '101', floor: '', area: '72,555', rooms: '3' }]), postalCode: '84', city: '' };

		const response = await sendJson('POST', '/api/v1/buildings', body);

		expect(response.status).toBe(400);
		const { causes } = (await response.json()) as { causes: { code: string; params: { field: string } }[] };
		expect(causes.map(({ code, params }) => [params.field, code])).toEqual([
			['postalCode', 'POSTAL_CODE_DIGITS'],
			['city', 'BUILDING_CITY_REQUIRED'],
			['apartments.0.floor', 'APARTMENT_FLOOR_REQUIRED'],
			['apartments.0.area', 'APARTMENT_AREA_INVALID']
		]);
		expect(await buildingsNamed(body.name)).toEqual([]);
	});

	// the form sends what was entered: the Stockwerk as text, Fläche and Zimmer with a comma
	it('nimmt Stockwerk als Text und Fläche und Zimmeranzahl mit Komma an', async () => {
		const response = await sendJson('POST', '/api/v1/buildings', building([{ number: '101', floor: '2', area: '72,5', rooms: '3,5' }]));

		expect(response.status).toBe(201);
		const { id } = (await response.json()) as { id: string };
		expect((await apartmentsOf(id)).map((a) => [a.floor, Number(a.area), Number(a.rooms)])).toEqual([[2, 72.5, 3.5]]);
	});
});

describe('PUT /api/v1/buildings/:id prüft das Formular', () => {
	it.each(['84', '84000000001'])('nennt die PLZ «%s» ohne 4 Ziffern und ändert nichts', async (entered) => {
		const { id, postalCode } = await createBuilding({ name: `PLZtest ${crypto.randomUUID()}`, address: 'Testweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' });
		try {
			const response = await sendJson('PUT', `/api/v1/buildings/${id}`, { postalCode: entered });

			expect(response.status).toBe(400);
			expect(await response.json()).toMatchObject({ code: 'POSTAL_CODE_DIGITS', causes: [{ code: 'POSTAL_CODE_DIGITS', params: { field: 'postalCode' } }] });
			expect(((await (await sendJson('GET', `/api/v1/buildings/${id}`)).json()) as { postalCode: string }).postalCode).toBe(postalCode);
		} finally {
			await deleteBuilding(id);
		}
	});
});
