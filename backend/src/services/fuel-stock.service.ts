/**
 * Heating oil in the tank (Tankbestand): heating costs are the consumption, stock at the start + purchases − stock at
 * the end, not the purchases of the period
 */

import { and, asc, desc, eq, isNotNull, lte } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, distributionKeys, fuelStocks, invoices } from '../db/schema';
import { getTypedConfig } from './config.service';
import type { ErrorCode } from './coded-error';
import { isRealDate } from './real-date';

export const listFuelStocks = (buildingId: string) =>
	db.select().from(fuelStocks).where(eq(fuelStocks.buildingId, buildingId)).orderBy(asc(fuelStocks.readingDate));

// The value as typed: «2'650.50», «2650,5» or whole francs «1'450.-» (H-28, #717)
const typedAmount = (value: string) => value.replace(/['’\s]/g, '').replace(',', '.').replace(/\.[-–—]+$/, '');

/** The Tankbestand form's errors, each with its field (H-28, #717); with none, the value as stored */
export function fuelStockFields({ readingDate, amount }: { readingDate: string; amount: string }) {
	const value = typedAmount(amount);
	const errors: ErrorCode[] = [
		...(isRealDate(readingDate) ? [] : [{ code: 'FUEL_STOCK_DATE_REQUIRED', params: { field: 'readingDate' } }]),
		...(/^\d+(\.\d{1,2})?$/.test(value) ? [] : [{ code: 'FUEL_STOCK_AMOUNT_INVALID', params: { field: 'amount' } }])
	];
	return { errors, amount: value };
}

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
 * reading; covered: the period has fuel to bill, a reading after the day before it or an opening stock above zero (the
 * closing stock 0 of the year a tank is decommissioned opens the next year); null for a building that never had one
 */
export async function periodReadings(buildingId: string, periodStart: string, periodEnd: string) {
	const readings = await listFuelStocks(buildingId);
	if (readings.length === 0) return null;
	const on = (date: string) => readings.find((stock) => stock.readingDate === date);
	const [opening, closing] = [on(dayBefore(periodStart)), on(periodEnd)];
	const categoryId = (closing ?? readings.at(-1)!).categoryId;
	const missing = [!opening && dayBefore(periodStart), !closing && periodEnd].filter((date): date is string => !!date);
	const covered = readings.some((stock) => stock.readingDate > dayBefore(periodStart)) || Number(opening?.amount) > 0;
	return { opening, closing, categoryId, missing, covered };
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
					isNotNull(invoices.distributionKeyId), // one recorded before the key was required (#379) has none
					upTo ? lte(invoices.invoiceDate, upTo) : undefined
				)
			)
			.orderBy(desc(invoices.invoiceDate), desc(invoices.createdAt), desc(invoices.id)) // of one day the last entered (#770)
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
			inPeriod: { start: periodStart, end: periodEnd, amount: parseFloat(readings.opening.amount) - parseFloat(readings.closing.amount), fuelStock: true as const }
		}
	];
}

/** An allocable category marked Brennstoff may hold a Tankbestand (#100); the chimney sweep is shared like heating but is no fuel */
export async function isFuelCategory(categoryId: string) {
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId)) return false; // none chosen (h28h C-1)
	const [category] = await db
		.select({ fuel: categories.isFuel, allowed: categories.isAllowedUtilityCost })
		.from(categories)
		.where(eq(categories.id, categoryId));
	return !!category?.fuel && category.allowed;
}

/** One tank per building: a reading in another category than the building's other readings would bill it elsewhere */
export async function otherTankCategory(buildingId: string, categoryId: string) {
	const readings = await listFuelStocks(buildingId);
	return readings.some((stock) => stock.categoryId !== categoryId);
}

/** Whether a category still has Tankbestand readings (it cannot be deleted then) */
export async function categoryHasFuelStocks(categoryId: string) {
	const [stock] = await db.select({ id: fuelStocks.id }).from(fuelStocks).where(eq(fuelStocks.categoryId, categoryId)).limit(1);
	return !!stock;
}

