/**
 * Apartment numbers are unique within a building (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createApartment, deleteApartment, listApartments } from '../services/apartment.service';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { callApi } from './helpers/auth';

let buildingId: string;
let otherId: string;

const send = (method: string, path: string, body: object) =>
	callApi(path, {
		method,
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body)
	});

beforeAll(async () => {
	buildingId = (
		await createBuilding({
			name: `Ahornhof ${crypto.randomUUID()}`,
			address: 'Testweg 1',
			postalCode: '8400',
			city: 'Winterthur',
			canton: 'ZH'
		})
	).id;
	await createApartment({ buildingId, number: '2.01', floor: 2, area: '70', rooms: '3.5' });
	otherId = (
		await createApartment({ buildingId, number: '2.02', floor: 2, area: '70', rooms: '3.5' })
	).id;
});

afterAll(async () => {
	for (const apartment of (await listApartments({ buildingId })).apartments) {
		await deleteApartment(apartment.id);
	}
	await deleteBuilding(buildingId);
});

describe('Wohnungsnummer pro Gebäude', () => {
	it('lehnt eine neue Wohnung mit vergebener Nummer verständlich ab', async () => {
		const response = await send('POST', '/api/v1/apartments', {
			buildingId,
			number: '2.01',
			floor: 2,
			area: '70',
			rooms: '3.5'
		});

		expect(response.status).toBe(409);
		expect(await response.json()).toEqual({
			error: 'Die Wohnungsnummer 2.01 existiert bereits in diesem Gebäude.'
		});
	});

	it('lehnt das Umbenennen auf eine vergebene Nummer verständlich ab', async () => {
		const response = await send('PUT', `/api/v1/apartments/${otherId}`, { number: '2.01' });

		expect(response.status).toBe(409);
		expect(await response.json()).toEqual({
			error: 'Die Wohnungsnummer 2.01 existiert bereits in diesem Gebäude.'
		});
	});
});
