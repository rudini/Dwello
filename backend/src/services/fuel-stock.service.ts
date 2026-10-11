/**
 * Heating oil in the tank (Tankbestand): heating costs are the consumption, stock at the start + purchases − stock at
 * the end, not the purchases of the period
 */

import { and, asc, desc, eq, lte } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, distributionKeys, fuelStocks, invoices } from '../db/schema';
import { getTypedConfig } from './config.service';

export const listFuelStocks = (buildingId: string) =>
	db.select().from(fuelStocks).where(eq(fuelStocks.buildingId, buildingId)).orderBy(asc(fuelStocks.readingDate));

/** The new reading; none if the building already has one on that day */
export async function createFuelStock(buildingId: string, stock: { readingDate: string; amount: string; categoryId: string }) {
	const [created] = await db.insert(fuelStocks).values({ buildingId, ...stock }).onConflictDoNothing().returning();
	return created;
}

export async function deleteFuelStock(buildingId: string, id: string) {
	const deleted = await db
		.delete(fuelStocks)
		.where(and(eq(fuelStocks.buildingId, buildingId), eq(fuelStocks.id, id)))
		.returning();
	return deleted.length > 0;
}

const dayBefore = (isoDate: string) => new Date(Date.parse(isoDate) - 86_400_000).toISOString().slice(0, 10);

/**
 * The readings a period needs, at the end of the day before it and of its last day, with the category of the latest
 * reading; null for a building without a tank in the period (no reading from the day before it on)
 */
export async function periodReadings(buildingId: string, periodStart: string, periodEnd: string) {
	const readings = await listFuelStocks(buildingId);
	if (!readings.some((stock) => stock.readingDate >= dayBefore(periodStart))) return null;
	const on = (date: string) => readings.find((stock) => stock.readingDate === date);
	const [opening, closing] = [on(dayBefore(periodStart)), on(periodEnd)];
	const categoryId = (closing ?? readings.at(-1)!).categoryId;
	const missing = [!opening && dayBefore(periodStart), !closing && periodEnd].filter((date): date is string => !!date);
	return { opening, closing, categoryId, missing };
}

// The distribution key of the category's latest allocable invoice up to the period end (else any later one), else
// the configured default
async function keyFor(buildingId: string, categoryId: string, periodEnd: string) {
	const latest = (upTo?: string) =>
		db
			.select({ id: invoices.distributionKeyId })
			.from(invoices)
			.where(
				and(
					eq(invoices.buildingId, buildingId),
					eq(invoices.categoryId, categoryId),
					eq(invoices.isValidUtilityCost, true),
					upTo ? lte(invoices.invoiceDate, upTo) : undefined
				)
			)
			.orderBy(desc(invoices.invoiceDate))
			.limit(1);
	const [bill] = [...(await latest(periodEnd)), ...(await latest())];
	const id = bill?.id ?? (await getTypedConfig('default_distribution_key_id'));
	if (!id) return null;
	const [key] = await db.select({ id: distributionKeys.id, name: distributionKeys.name, nameDE: distributionKeys.nameDE }).from(distributionKeys).where(eq(distributionKeys.id, id));
	return key ?? null;
}

/**
 * The change of the stock in the period as one more invoice of its category over the whole period; none while the
 * reading at the start (the day before) or at the end is missing (the check for missing invoices reports that)
 */
export async function fuelStockChange(buildingId: string, periodStart: string, periodEnd: string) {
	const readings = await periodReadings(buildingId, periodStart, periodEnd);
	if (!readings?.opening || !readings.closing) return [];
	const [category] = await db
		.select({ id: categories.id, name: categories.name, nameDE: categories.nameDE, isAllowedUtilityCost: categories.isAllowedUtilityCost, isHeatingCost: categories.isHeatingCost })
		.from(categories)
		.where(eq(categories.id, readings.categoryId));
	// a category made non-allocable later: the tenants bear none of it (OR 257a), like its invoices
	if (!category.isAllowedUtilityCost) return [];
	const distributionKey = await keyFor(buildingId, readings.categoryId, periodEnd);
	return [
		{
			id: `fuel-stock-${periodEnd}`,
			description: 'Veränderung Tankbestand',
			categoryId: category.id,
			distributionKeyId: distributionKey?.id ?? null,
			category,
			distributionKey,
			isFuelStock: true,
			stock: {
				categoryId: category.id,
				openingDate: readings.opening.readingDate,
				opening: readings.opening.amount,
				closingDate: readings.closing.readingDate,
				closing: readings.closing.amount
			},
			inPeriod: { start: periodStart, end: periodEnd, amount: parseFloat(readings.opening.amount) - parseFloat(readings.closing.amount) }
		}
	];
}

/** An allocable heating cost category may hold a Tankbestand; the chimney sweep is shared like heating but is no fuel */
export async function isHeatingCategory(categoryId: string) {
	const [category] = await db
		.select({ name: categories.name, heating: categories.isHeatingCost, allowed: categories.isAllowedUtilityCost })
		.from(categories)
		.where(eq(categories.id, categoryId));
	return !!category?.heating && category.allowed && category.name !== 'Chimney Sweep';
}

/** One tank per building: a reading in another category than the building's other readings would bill it elsewhere */
export async function otherTankCategory(buildingId: string, categoryId: string) {
	const readings = await listFuelStocks(buildingId);
	return readings.some((stock) => stock.categoryId !== categoryId);
}

export const hasFuelStocks = async (buildingId: string) => (await listFuelStocks(buildingId)).length > 0;

/** Whether a category still has Tankbestand readings (it cannot be deleted then) */
export async function categoryHasFuelStocks(categoryId: string) {
	const [stock] = await db.select({ id: fuelStocks.id }).from(fuelStocks).where(eq(fuelStocks.categoryId, categoryId)).limit(1);
	return !!stock;
}

