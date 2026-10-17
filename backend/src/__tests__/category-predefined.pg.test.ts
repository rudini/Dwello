/**
 * Dwello's own categories stay: they cannot be deleted and keep their key, only their names and allocability
 * change (#166; real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection } from './helpers/records';

const key = `Stairwell ${crypto.randomUUID()}`;
const [predefined] = await db
	.insert(categories)
	.values({ name: key, nameDE: key, type: 'predefined', isAllowedUtilityCost: true })
	.returning();

afterAll(async () => {
	await db.delete(categories).where(eq(categories.id, predefined.id));
});

describe('Vordefinierte Kategorie', () => {
	it('lässt sich nicht löschen', async () => {
		const response = await callApi(`/api/v1/categories/${predefined.id}`, { method: 'DELETE' });

		await expectRejection(response, 409, 'Vordefinierte Kategorien können nicht gelöscht werden.', 'CATEGORY_PREDEFINED');
	});

	it('behält ihren Schlüssel, wenn Namen und Umlagefähigkeit ändern', async () => {
		const response = await sendJson('PUT', `/api/v1/categories/${predefined.id}`, {
			name: `Renamed ${key}`,
			nameDE: `Treppenhaus ${key}`,
			isAllowedUtilityCost: false
		});

		expect(response.status).toBe(200);
		const stored = (await (await callApi(`/api/v1/categories/${predefined.id}`)).json()) as Record<string, unknown>;
		expect(stored).toMatchObject({ name: key, nameDE: `Treppenhaus ${key}`, isAllowedUtilityCost: false });
	});
});
