/**
 * Apartment list search, word by word in number, building name, street and place (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createApartment, deleteApartment, listApartments } from '../services/apartment.service';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { callApi } from './helpers/auth';

const name = `Ahornhof ${crypto.randomUUID()}`;
const street = `Seestrasse-${crypto.randomUUID()} 5`;
const place = `Uster-${crypto.randomUUID()}`;
let buildingId: string;
let otherId: string;

const search = async (query: string) => {
	const response = await callApi(`/api/v1/apartments?${query}`);
	expect(response.status).toBe(200);
	return (await response.json()) as { apartments: { number: string }[]; total: number };
};

beforeAll(async () => {
	buildingId = (
		await createBuilding({
			name,
			address: street,
			postalCode: '8610',
			city: place,
			canton: 'ZH'
		})
	).id;
	for (const number of ['2.01', '2.02']) {
		await createApartment({ buildingId, number, floor: 2, area: '70', rooms: '3.5' });
	}
	await createApartment({ buildingId, number: '3.01', floor: 3, area: '70', rooms: '3.5', status: 'reserved' });
	otherId = (
		await createBuilding({
			name: `Birkenweg ${crypto.randomUUID()}`,
			address: 'Testweg 2',
			postalCode: '8400',
			city: 'Winterthur',
			canton: 'ZH'
		})
	).id;
	await createApartment({
		buildingId: otherId,
		number: '2.01',
		floor: 2,
		area: '70',
		rooms: '3.5'
	});
});

afterAll(async () => {
	for (const id of [buildingId, otherId]) {
		for (const apartment of (await listApartments({ buildingId: id })).apartments) {
			await deleteApartment(apartment.id);
		}
		await deleteBuilding(id);
	}
});

describe('Wohnungssuche', () => {
	it('findet Wohnungen nach Wohnungsnummer', async () => {
		const result = await search(`buildingId=${buildingId}&search=2.0`);
		expect(result.apartments.map((a) => a.number)).toEqual(['2.01', '2.02']);
		expect(result.total).toBe(2);
	});

	it('findet Wohnungen nach Gebäudename, ohne Gross- und Kleinschreibung', async () => {
		const result = await search(`search=${encodeURIComponent(name.toUpperCase())}`);
		expect(result.apartments.map((a) => a.number)).toEqual(['2.01', '2.02', '3.01']);
	});

	it('findet Wohnungen, wenn jedes Wort zur Wohnungsnummer oder zum Gebäudenamen passt', async () => {
		const result = await search(`search=${encodeURIComponent(`${name} 2.01`)}`);
		expect(result.apartments.map((a) => a.number)).toEqual(['2.01']);
	});

	it('findet Wohnungen nach Strasse und Ort des Gebäudes', async () => {
		const byStreet = await search(`search=${encodeURIComponent(`${street} 2.01`)}`);
		expect(byStreet.apartments.map((a) => a.number)).toEqual(['2.01']);
		const byPlace = await search(`search=${encodeURIComponent(`${place} 2.0`)}`);
		expect(byPlace.apartments.map((a) => a.number)).toEqual(['2.01', '2.02']);
	});

	it('übergeht das Wort «Wohnung», wie es auf der Karte steht', async () => {
		const result = await search(`search=${encodeURIComponent(`${name} Wohnung 2.01`)}`);
		expect(result.apartments.map((a) => a.number)).toEqual(['2.01']);
		const onlyTheWord = await search(`buildingId=${buildingId}&search=wohnung`);
		expect(onlyTheWord.total).toBe(3);
	});

	it('lässt sich mit dem Statusfilter kombinieren', async () => {
		const result = await search(`search=${encodeURIComponent(name)}&status=reserved`);
		expect(result.apartments.map((a) => a.number)).toEqual(['3.01']);
		expect(result.total).toBe(1);
	});

	it('zählt nur die Treffer, auch über mehrere Seiten', async () => {
		const result = await search(`search=${encodeURIComponent(name)}&limit=1`);
		expect(result.apartments).toHaveLength(1);
		expect(result.total).toBe(3);
	});
});
