/**
 * #1410: until when an invoice must be kept, 10 years from the end of the year its Abrechnungsperiode ends (product
 * owner 09.11.2026; legal basis in the delete confirmation, Fachreview 1410-1 M-1), and the periods whose invoices
 * may be deleted since, unless the landlord keeps them («Behalten»)
 */
import { eq, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { buildings, categories, invoices } from '../db/schema';
import { swissToday } from './today';
import { lastCompletedPeriod, type AccountingPeriodType } from './period-types';
import type { ExpiredInvoicePeriod } from '../api/invoice';

type Dated = { invoiceDate: string; servicePeriodEnd: string | null };

/**
 * The Abrechnungsperiode an invoice is kept with: the one with the later of its Rechnungsdatum and its Leistungszeitraum's
 * end; kept until the 31.12. of the year that period ends, plus 10 years, as the Steuerperiode is the calendar year
 * (Fachreview 1410-1 V-1, product owner). The building's type from a left join: every invoice has a building, calendar
 * is a building's default
 */
function retentionPeriod(type: AccountingPeriodType | null, invoice: Dated) {
	const day =
		invoice.servicePeriodEnd && invoice.servicePeriodEnd > invoice.invoiceDate
			? invoice.servicePeriodEnd
			: invoice.invoiceDate;
	// the period that has ended a year after the day is the one the day lies in (no period ends in February)
	const period = lastCompletedPeriod(
		type ?? 'calendar',
		`${Number(day.slice(0, 4)) + 1}${day.slice(4)}`
	);
	return { ...period, keepUntil: `${Number(period.end.slice(0, 4)) + 10}-12-31` };
}

export const keepUntil = (type: AccountingPeriodType | null, invoice: Dated) =>
	retentionPeriod(type, invoice).keepUntil;

// Fachreview 1410-1 V-2 (product owner): they prove the investment costs for the Grundstückgewinnsteuer until the sale
const INVESTMENTS = 'Capital Improvements';

/**
 * The end of the invoice's Aufbewahrungsfrist while it runs, the last day included; 'sale' for a wertvermehrende
 * Investition; null once it has passed
 */
export function retention(
	type: AccountingPeriodType | null,
	invoice: Dated,
	category: string | undefined
) {
	if (category === INVESTMENTS) return 'sale';
	const until = keepUntil(type, invoice);
	return until >= swissToday() ? until : null;
}

/** Per building and Abrechnungsperiode the invoices whose Aufbewahrungsfrist has passed, not kept; by building, oldest first */
export async function expiredInvoicePeriods() {
	const today = swissToday();
	// a day within the last 10 years is still kept: its period ends on it or after
	const rows = await db
		.select({
			buildingId: invoices.buildingId,
			building: buildings.name,
			type: buildings.accountingPeriod,
			kept: buildings.keptInvoicePeriods,
			invoiceDate: invoices.invoiceDate,
			servicePeriodEnd: invoices.servicePeriodEnd
		})
		.from(invoices)
		.innerJoin(buildings, eq(invoices.buildingId, buildings.id))
		.leftJoin(categories, eq(invoices.categoryId, categories.id))
		.where(
			sql`coalesce(${invoices.servicePeriodEnd}, ${invoices.invoiceDate}) < ${`${Number(today.slice(0, 4)) - 10}${today.slice(4)}`}
				and ${categories.name} is distinct from ${INVESTMENTS}`
		);
	const periods = new Map<string, ExpiredInvoicePeriod>();
	for (const row of rows) {
		const { start, end, keepUntil } = retentionPeriod(row.type, row);
		if (keepUntil >= today || row.kept.includes(start)) continue;
		const key = `${row.buildingId}/${start}`;
		const period = periods.get(key) ?? {
			buildingId: row.buildingId,
			building: row.building,
			start,
			end,
			keepUntil,
			count: 0
		};
		period.count++;
		periods.set(key, period);
	}
	return [...periods.values()].sort(
		(a, b) => a.building.localeCompare(b.building, 'de-CH') || a.start.localeCompare(b.start)
	);
}

/** «Behalten»: the overview no longer names the building's invoices of the period; Dwello deletes nothing */
export async function keepInvoicePeriod(buildingId: string, periodStart: string) {
	const period = sql`jsonb_build_array(${periodStart}::text)`;
	await db
		.update(buildings)
		.set({ keptInvoicePeriods: sql`${buildings.keptInvoicePeriods} || ${period}` })
		.where(
			sql`${buildings.id} = ${buildingId} and not ${buildings.keptInvoicePeriods} @> ${period}`
		);
}

/**
 * Fachreview 1410-1 V-3 (product owner): of the invoices a statement billed and that are deleted since, those whose
 * Aufbewahrungsfrist still runs; one deleted after it no longer makes the statement «nicht aktuell». The statement
 * kept each one's Rechnungsdatum and its days in the period, not a Leistungszeitraum beyond it
 */
export async function deletedWithinRetention<T extends { invoiceDate?: string; end: string }>(
	buildingId: string,
	deleted: T[]
) {
	if (!deleted.length) return deleted;
	const [building] = await db
		.select({ type: buildings.accountingPeriod })
		.from(buildings)
		.where(eq(buildings.id, buildingId));
	const today = swissToday();
	return deleted.filter(
		(billed) =>
			keepUntil(building?.type ?? null, {
				invoiceDate: billed.invoiceDate ?? billed.end,
				servicePeriodEnd: billed.end
			}) >= today
	);
}
