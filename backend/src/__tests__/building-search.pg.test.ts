/**
 * Building list search, word by word in name, street and place (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { callApi } from './helpers/auth';

const token = crypto.randomUUID();
const ids: string[] = [];

const search = async (term: string) => {
	const response = await callApi(`/api/v1/buildings?search=${encodeURIComponent(term)}`);
	expect(response.status).toBe(200);
	return ((await response.json()) as { buildings: { name: string }[] }).buildings.map(
		(b) => b.name
	);
};

beforeAll(async () => {
	for (const [name, city] of [
		['Lindenhof', 'Winterthur'],
		['Birkenhof', 'Uster']
	]) {
		ids.push(
			(
				await createBuilding({
					name: `${name} ${token}`,
					address: 'Testweg 1',
					postalCode: '8400',
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
});
