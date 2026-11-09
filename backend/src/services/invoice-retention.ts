/**
 * #1410: until when an invoice must be kept, 10 years from the end of the year its Abrechnungsperiode ends (product
 * owner 09.11.2026; legal basis in the delete confirmation, Fachreview 1410-1 M-1), and the periods whose invoices
 * may be deleted since, unless the landlord keeps them («Behalten»)
 */
import { eq, inArray, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { buildings, categories, invoices } from '../db/schema';
import { swissToday } from './today';
import { lastCompletedPeriod, type AccountingPeriodType } from './period-types';
import type { ExpiredInvoicePeriod } from '../api/invoice';

type Dated = { invoiceDate: string; servicePeriodEnd: string | null };

// the period that has ended a year after the day is the one the day lies in (no period ends in February); the
// building's type from a left join: every invoice has a building, calendar is a building's default
const periodWith = (type: AccountingPeriodType | null, day: string) =>
	lastCompletedPeriod(type ?? 'calendar', `${Number(day.slice(0, 4)) + 1}${day.slice(4)}`);

/**
 * The end of an invoice's Aufbewahrungsfrist: the 31.12. of the year the Abrechnungsperiode ends that holds the later of
 * its Rechnungsdatum and its Leistungszeitraum's end, plus 10 years, as the Steuerperiode is the calendar year
 * (Fachreview 1410-1 V-1, product owner)
 */
export function keepUntil(type: AccountingPeriodType | null, invoice: Dated) {
	const day =
		invoice.servicePeriodEnd && invoice.servicePeriodEnd > invoice.invoiceDate
			? invoice.servicePeriodEnd
			: invoice.invoiceDate;
	return `${Number(periodWith(type, day).end.slice(0, 4)) + 10}-12-31`;
}

/**
 * The last Abrechnungsperiode the invoice list shows the invoice in (rule 1, inPeriodOf): the one with its
 * Leistungszeitraum's end, else its Rechnungsdatum; the overview names it there (Fachreview 1410-2 V-6)
 */
const listedIn = (type: AccountingPeriodType | null, invoice: Dated) =>
	periodWith(type, invoice.servicePeriodEnd ?? invoice.invoiceDate);

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
	// a day of the last 9 calendar years is still kept: the year its period ends plus 10 is still to come (also on 29.02.)
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
			sql`coalesce(${invoices.servicePeriodEnd}, ${invoices.invoiceDate}) < ${`${Number(today.slice(0, 4)) - 9}-01-01`}
				and ${categories.name} is distinct from ${INVESTMENTS}`
		);
	const periods = new Map<string, ExpiredInvoicePeriod>();
	for (const row of rows) {
		const until = keepUntil(row.type, row);
		const { start, end } = listedIn(row.type, row);
		if (until >= today || row.kept.includes(start)) continue;
		const key = `${row.buildingId}/${start}`;
		const period = periods.get(key) ?? {
			buildingId: row.buildingId,
			building: row.building,
			start,
			end,
			keepUntil: until,
			count: 0
		};
		period.count++;
		if (until > period.keepUntil) period.keepUntil = until; // the last of its invoices' ends
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
export async function deletedWithinRetention<
	T extends { id: string; invoiceDate?: string; end: string }
>(buildingId: string, deleted: T[]) {
	if (!deleted.length) return deleted;
	// one still recorded but no longer billed as it was stays a change (code review 1410-3 C-2)
	const ids = deleted.map((billed) => billed.id);
	const recorded = new Set(
		(await db.select({ id: invoices.id }).from(invoices).where(inArray(invoices.id, ids))).map(
			(i) => i.id
		)
	);
	const [building] = await db
		.select({ type: buildings.accountingPeriod })
		.from(buildings)
		.where(eq(buildings.id, buildingId));
	const today = swissToday();
	return deleted.filter(
		(billed) =>
			recorded.has(billed.id) ||
			keepUntil(building?.type ?? null, {
				invoiceDate: billed.invoiceDate ?? billed.end,
				servicePeriodEnd: billed.end
			}) >= today
	);
}
