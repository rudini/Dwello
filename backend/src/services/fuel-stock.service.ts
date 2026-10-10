/**
 * Heating oil in the tank (Tankbestand): heating costs are the consumption, stock at the start + purchases − stock at
 * the end, not the purchases of the period
 */

import { and, asc, desc, eq, lte } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, fuelStocks, invoices } from '../db/schema';
import { selectWithDetails } from './invoice.service';

export const listFuelStocks = (buildingId: string) =>
	db.select().from(fuelStocks).where(eq(fuelStocks.buildingId, buildingId)).orderBy(asc(fuelStocks.readingDate));

/** The new reading; none if the building already has one on that day */
export async function createFuelStock(buildingId: string, stock: { readingDate: string; amount: string }) {
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

async function stockOn(buildingId: string, readingDate: string) {
	const [stock] = await db
		.select()
		.from(fuelStocks)
		.where(and(eq(fuelStocks.buildingId, buildingId), eq(fuelStocks.readingDate, readingDate)));
	return stock ? parseFloat(stock.amount) : undefined;
}

/**
 * The change of the stock in the period as one more heating invoice over the whole period, with the category and
 * distribution key of the building's last heating invoice; none while the reading at the start (the day before) or at
 * the end is missing
 */
export async function fuelStockChange(buildingId: string, periodStart: string, periodEnd: string) {
	const opening = await stockOn(buildingId, dayBefore(periodStart));
	const closing = await stockOn(buildingId, periodEnd);
	if (opening === undefined || closing === undefined) return [];
	const [heating] = await selectWithDetails()
		.where(and(eq(invoices.buildingId, buildingId), eq(categories.name, 'Heating'), lte(invoices.invoiceDate, periodEnd)))
		.orderBy(desc(invoices.invoiceDate))
		.limit(1);
	if (!heating) return [];
	return [
		{
			...heating.invoice,
			id: `fuel-stock-${periodEnd}`,
			description: 'Veränderung Tankbestand',
			building: heating.building,
			category: heating.category,
			distributionKey: heating.distributionKey,
			llmCategory: null,
			inPeriod: { start: periodStart, end: periodEnd, amount: opening - closing }
		}
	];
}
