/**
 * Real-database tests for distribution keys used in utility statements.
 * Requires PostgreSQL with all migrations in backend/migrations applied
 * (DATABASE_URL, default db `dwello`).
 */

import { afterAll, beforeAll, describe, it, expect } from 'bun:test';
import { inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { distributionKeys } from '../db/schema';
import { createApartment } from '../services/apartment.service';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { calculateBuildingDistribution } from '../services/distribution-key.service';

// Two apartments of different size and rooms, so every key distributes differently
const buildingApartments: { id: string; area: number; rooms: number }[] = [];
let buildingId: string;

beforeAll(async () => {
	const building = await createBuilding({
		name: `Verteilhaus ${crypto.randomUUID()}`,
		address: 'Testweg 1',
		postalCode: '8400',
		city: 'Winterthur',
		canton: 'ZH'
	});
	buildingId = building.id;
	for (const [number, area, rooms] of [['1.01', '75.5', '3.5'], ['1.02', '92', '4.5']]) {
		const apartment = await createApartment({ buildingId, number, area, rooms });
		buildingApartments.push({ id: apartment.id, area: Number(area), rooms: Number(rooms) });
	}
});

afterAll(async () => {
	await deleteBuilding(buildingId);
});

describe('Distribution keys in statement calculation (real DB)', () => {
	it('has no "Per Person" or "By Consumption" keys', async () => {
		const removed = await db
			.select({ name: distributionKeys.name })
			.from(distributionKeys)
			.where(inArray(distributionKeys.name, ['Per Person', 'By Consumption']));

		expect(removed).toEqual([]);
	});

	it('distributes the whole amount with every stored distribution key', async () => {
		const keys = await db.select({ id: distributionKeys.id, name: distributionKeys.name }).from(distributionKeys);
		expect(keys.length).toBeGreaterThan(0);

		for (const key of keys) {
			const result = await calculateBuildingDistribution(key.id, buildingApartments, 1000);
			expect({ key: key.name, error: result.error }).toEqual({ key: key.name, error: undefined });
			const total = result.distributions.reduce((sum, d) => sum + d.amount, 0);
			expect(total).toBeCloseTo(1000, 2);
		}
	});
});
