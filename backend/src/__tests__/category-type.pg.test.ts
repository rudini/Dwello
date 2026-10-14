/**
 * Whether a category is one of Dwello's own (seeded) or recorded by the property manager is stored,
 * not guessed from its names (real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { db } from '../db/connection';
import { categories } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';

const created: string[] = [];

afterAll(async () => {
	for (const id of created) await callApi(`/api/v1/categories/${id}`, { method: 'DELETE' });
});

describe('Herkunft einer Kategorie', () => {
	it('ist «custom» für eine erfasste Kategorie, auch wenn ihr englischer Name gleich lautet', async () => {
		const name = `Internet ${crypto.randomUUID()}`;
		const response = await sendJson('POST', '/api/v1/categories', { name, nameDE: name, nameEN: name, isAllowedUtilityCost: true });
		const category = (await response.json()) as { id: string; type: string };
		created.push(category.id);

		expect(category.type).toBe('custom');
		const stored = (await (await callApi(`/api/v1/categories/${category.id}`)).json()) as { type: string };
		expect(stored.type).toBe('custom');
	});

	it('ist «predefined» für eine mitgelieferte Kategorie', async () => {
		const { categories } = (await (await callApi('/api/v1/categories?search=Caretaker')).json()) as { categories: { type: string }[] };

		expect(categories[0].type).toBe('predefined');
	});

	it('lässt nur «predefined» und «custom» zu', async () => {
		const name = `Ungültig ${crypto.randomUUID()}`;
		await expect(db.insert(categories).values({ name, type: 'other' }).execute()).rejects.toThrow();
	});
});
