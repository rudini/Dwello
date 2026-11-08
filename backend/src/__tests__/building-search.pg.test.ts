/**
 * Building list search, word by word in name, street, postcode and place (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { callApi } from './helpers/auth';

const token = crypto.randomUUID();
const ids: string[] = [];

const search = async (term: string, city = '') => {
	const response = await callApi(
		`/api/v1/buildings?search=${encodeURIComponent(term)}&city=${encodeURIComponent(city)}`
	);
	expect(response.status).toBe(200);
	return ((await response.json()) as { buildings: { name: string }[] }).buildings.map(
		(b) => b.name
	);
};

beforeAll(async () => {
	for (const [name, city, postalCode] of [
		['Lindenhof', 'Winterthur', '8400'],
		['Birkenhof', 'Uster', '8610']
	]) {
		ids.push(
			(
				await createBuilding({
					name: `${name} ${token}`,
					address: 'Testweg 1',
					postalCode,
					city,
					canton: 'ZH'
				})
			).id
		);
	}
});

afterAll(async () => {
	for (const id of ids) await deleteBuilding(id);
});

describe('Gebäudesuche', () => {
	it('findet Gebäude, wenn jedes Wort zum Namen, zur Strasse oder zum Ort passt', async () => {
		expect(await search(`Lindenhof ${token} Winterthur Testweg`)).toEqual([`Lindenhof ${token}`]);
		expect(await search(`${token} Uster`)).toEqual([`Birkenhof ${token}`]);
		expect(await search(`Lindenhof ${token} Uster`)).toEqual([]);
	});

	// #1193 (Marco): the address pasted as the card shows it, «Strasse Nr, PLZ Ort», and the postcode alone
	it('findet ein Gebäude nach der Adresse, wie die Karte sie zeigt, und nach der Postleitzahl', async () => {
		expect(await search(`${token} Testweg 1, 8610 Uster`)).toEqual([`Birkenhof ${token}`]);
		expect(await search(`${token} 8610`)).toEqual([`Birkenhof ${token}`]);
	});

	it('filtert im Ort auch nach der Postleitzahl', async () => {
		expect(await search(token, '8610')).toEqual([`Birkenhof ${token}`]);
		expect(await search(token, '8610 Uster')).toEqual([`Birkenhof ${token}`]);
		expect(await search(token, '8400 Uster')).toEqual([]);
	});
});
