/**
 * Real-database tests for distribution keys used in utility statements.
 * Requires PostgreSQL with all migrations in backend/migrations applied
 * (DATABASE_URL, default db `dwello`).
 */

import { describe, it, expect } from 'bun:test';
import { and, eq, inArray, isNotNull } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, distributionKeys, invoices } from '../db/schema';
import { calculateBuildingDistribution } from '../services/distribution-key.service';

const BUILDING_ID = '11111111-1111-1111-1111-111111111111';
// Test-data invoices that were seeded with "Per Person"
const FORMER_PER_PERSON_INVOICES = ['INV-2024-002', 'INV-2024-007'];

async function getBuildingApartments() {
	const rows = await db
		.select({ id: apartments.id, area: apartments.area, rooms: apartments.rooms })
		.from(apartments)
		.where(eq(apartments.buildingId, BUILDING_ID));
	return rows.map((a) => ({ id: a.id, area: parseFloat(a.area), rooms: parseFloat(a.rooms) }));
}

describe('Distribution keys in statement calculation (real DB)', () => {
	it('has no "Per Person" or "By Consumption" keys', async () => {
		const removed = await db
			.select({ name: distributionKeys.name })
			.from(distributionKeys)
			.where(inArray(distributionKeys.name, ['Per Person', 'By Consumption']));

		expect(removed).toEqual([]);
	});

	it('can evaluate every stored distribution key for the building apartments', async () => {
		const buildingApartments = await getBuildingApartments();
		expect(buildingApartments.length).toBeGreaterThan(1);

		const keys = await db.select({ id: distributionKeys.id, name: distributionKeys.name }).from(distributionKeys);
		expect(keys.length).toBeGreaterThan(0);

		for (const key of keys) {
			const result = await calculateBuildingDistribution(key.id, buildingApartments, 1000);
			expect({ key: key.name, error: result.error }).toEqual({ key: key.name, error: undefined });
		}
	});

	it('distributes every keyed invoice of the building, including former "Per Person" invoices', async () => {
		const buildingApartments = await getBuildingApartments();
		const buildingInvoices = await db
			.select({
				invoiceNumber: invoices.invoiceNumber,
				amount: invoices.amount,
				distributionKeyId: invoices.distributionKeyId,
				keyName: distributionKeys.name
			})
			.from(invoices)
			.leftJoin(distributionKeys, eq(invoices.distributionKeyId, distributionKeys.id))
			.where(and(eq(invoices.buildingId, BUILDING_ID), isNotNull(invoices.distributionKeyId)));

		for (const invoiceNumber of FORMER_PER_PERSON_INVOICES) {
			const invoice = buildingInvoices.find((i) => i.invoiceNumber === invoiceNumber);
			expect(invoice?.keyName).toBe('Per Unit');
		}

		for (const invoice of buildingInvoices) {
			const result = await calculateBuildingDistribution(
				invoice.distributionKeyId!,
				buildingApartments,
				parseFloat(invoice.amount)
			);
			expect(result.isValid).toBe(true);
			const total = result.distributions.reduce((sum, d) => sum + d.amount, 0);
			expect(total).toBeCloseTo(parseFloat(invoice.amount), 2);
		}
	});
});
