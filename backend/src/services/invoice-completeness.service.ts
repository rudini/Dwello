/**
 * Check for missing invoices per cost category: every category with costs in the same dates one year earlier
 * is expected again, in the same rhythm (one invoice per quarter, half-year, month, …). The result is a hint
 * for the property manager, not a rule: a supplier may bill differently from one year to the next.
 */

import { and, asc, eq, gte, isNull, lte, min, notInArray, or } from 'drizzle-orm';
import { db } from '../db/connection';
import { buildings, categories, fuelStocks, invoices } from '../db/schema';
import { getInvoicesForStatement } from './invoice.service';
import { fuelStockChange, periodReadings } from './fuel-stock.service';
import { swissToday } from './today';

export interface Period {
	start: string;
	end: string;
}

export interface CategoryInvoice {
	categoryId: string | null;
	categoryName: string;
	amount: number;
	invoiceDate: string;
	isFuelStock?: boolean; // the change of the Tankbestand: consumption, no part of the rhythm
	isHeatingCost?: boolean;
	partial?: boolean; // its Leistungszeitraum reaches beyond the period: only its days in the period count
}

type Sum = { count: number; total: number };

export interface CategoryFinding {
	categoryId: string | null;
	categoryName: string;
	// missing: no invoice although the year before had costs; gap: a part of the rhythm has none;
	// new: costs the year before did not have (agreed in the lease?); deviation: costs differ a lot;
	// stock: a Tankbestand reading is missing (missingParts: its days); consumption: a hint on the readings, the
	// consumption is negative or differs a lot from the year before (changePercent);
	// tank: heating costs without any Tankbestand (heated with oil or pellets? then the purchases are billed)
	kind: 'stock' | 'tank' | 'consumption' | 'missing' | 'gap' | 'new' | 'deviation';
	current: Sum;
	previous: Sum;
	missingParts: Period[]; // the slices of the rhythm without invoice (gap), the missing readings (stock), otherwise empty
	changePercent: number | null; // change of the costs against the year before (deviation), otherwise null
	partialCount: number; // the period's invoices whose Leistungszeitraum reaches beyond it: lower costs without a gap
}

// A change of more than 25 % and at least CHF 100 against the year before is worth a look: a UX choice (#65)
const DEVIATION_SHARE = 0.25;
const DEVIATION_MINIMUM = 100;
// The year before counts as recorded when the building's first invoice lies within 92 days of its start: a UX choice (#65)
const RECORDED_FROM_START_DAYS = 92;
// An invoice without Leistungszeitraum dated up to 90 days after the period end may belong to the period (#131)
const LATE_INVOICE_DAYS = 90;

const toDate = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);
const toIso = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (iso: string, days: number) => toIso(new Date(toDate(iso).getTime() + days * 86_400_000));
const yearAfter = (iso: string) => toIso(new Date(toDate(iso).setUTCFullYear(toDate(iso).getUTCFullYear() + 1)));

/** The same dates one year earlier; an end on the last day of February stays the last day of February */
export function yearBefore({ start, end }: Period): Period {
	const shift = (iso: string) => {
		const date = toDate(iso);
		const lastOfFebruary = date.getUTCMonth() === 1 && toDate(addDays(iso, 1)).getUTCMonth() === 2;
		const shifted = new Date(Date.UTC(date.getUTCFullYear() - 1, date.getUTCMonth(), lastOfFebruary ? 1 : date.getUTCDate()));
		return lastOfFebruary ? toIso(new Date(Date.UTC(shifted.getUTCFullYear(), 2, 0))) : toIso(shifted);
	};
	return { start: shift(start), end: shift(end) };
}

// Whole months of a period that starts on the 1st and ends on a month's last day; otherwise null
function wholeMonths({ start, end }: Period): number | null {
	const from = toDate(start);
	const after = toDate(addDays(end, 1));
	if (from.getUTCDate() !== 1 || after.getUTCDate() !== 1) return null;
	return (after.getUTCFullYear() - from.getUTCFullYear()) * 12 + after.getUTCMonth() - from.getUTCMonth();
}

/** The period split into `parts` equal slices (by months where they divide evenly, otherwise by days) */
function slices(period: Period, parts: number): Period[] {
	const months = wholeMonths(period);
	const from = toDate(period.start);
	if (months && months % parts === 0) {
		const size = months / parts;
		return Array.from({ length: parts }, (_, k) => ({
			start: toIso(new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + k * size, 1))),
			end: toIso(new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + (k + 1) * size, 0)))
		}));
	}
	const days = (toDate(period.end).getTime() - from.getTime()) / 86_400_000 + 1;
	return Array.from({ length: parts }, (_, k) => ({
		start: addDays(period.start, Math.floor((k * days) / parts)),
		end: addDays(period.start, Math.floor(((k + 1) * days) / parts) - 1)
	}));
}

const sliceOf = (date: string, parts: Period[]) => parts.findIndex((part) => part.start <= date && date <= part.end);

const sum = (list: CategoryInvoice[]): Sum => ({
	count: list.filter((invoice) => !invoice.isFuelStock).length, // the change of the Tankbestand is no invoice
	total: Math.round(list.reduce((total, invoice) => total + invoice.amount, 0) * 100) / 100
});

// Invoices per category; without a category it cannot be said which invoice is missing
function groupByCategory(list: CategoryInvoice[]) {
	const groups = new Map<string, CategoryInvoice[]>();
	for (const invoice of list) {
		if (invoice.categoryId) groups.set(invoice.categoryId, [...(groups.get(invoice.categoryId) ?? []), invoice]);
	}
	return groups;
}

// A regular, coarser rhythm than the year before (#409 point 1): 2 ≤ n < p, n divides p and each of n equal slices
// holds exactly one invoice (12 monthly to 4 quarterly); 4 to 3 or a single invoice stays a gap
function coarserRhythm(current: CategoryInvoice[], period: Period, parts: number) {
	const n = current.length;
	if (n < 2 || n >= parts || parts % n !== 0) return false;
	const coarse = slices(period, n);
	const hit = new Set(current.map((invoice) => sliceOf(invoice.invoiceDate, coarse)));
	return hit.size === n && !hit.has(-1);
}

// The rhythm of the year before (one slice per invoice, at most one per month) and the slices without invoice now;
// a credit note is no part of the rhythm, and as many invoices as the year before are complete however they are dated
function missingParts(current: CategoryInvoice[], previous: CategoryInvoice[], period: Period, before: Period) {
	// with a Tankbestand the consumption counts, not when the oil was bought
	if ([...current, ...previous].some((invoice) => invoice.isFuelStock)) return [];
	const bills = (list: CategoryInvoice[]) => list.filter((invoice) => invoice.amount >= 0);
	[current, previous] = [bills(current), bills(previous)];
	const parts = Math.min(previous.length, 12);
	if (parts < 2 || current.length >= previous.length) return [];
	if (coarserRhythm(current, period, parts)) return [];
	const now = slices(period, parts);
	const then = slices(before, parts);
	const billedThen = new Set(previous.map((invoice) => sliceOf(invoice.invoiceDate, then)));
	const billedNow = new Set(current.map((invoice) => sliceOf(invoice.invoiceDate, now)));
	return now.filter((_, k) => billedThen.has(k) && !billedNow.has(k));
}

function findingOf(current: CategoryInvoice[], previous: CategoryInvoice[], period: Period): CategoryFinding | null {
	const sample = previous[0] ?? current[0];
	const base = {
		categoryId: sample.categoryId,
		categoryName: sample.categoryName,
		current: sum(current),
		previous: sum(previous),
		missingParts: [] as Period[],
		changePercent: null,
		partialCount: current.filter((invoice) => invoice.partial).length
	};
	if (previous.length === 0) return base.current.total > 0 ? { ...base, kind: 'new' } : null;
	if (base.previous.total === 0) return null;
	if (current.length === 0) return { ...base, kind: 'missing' };
	const parts = missingParts(current, previous, period, yearBefore(period));
	if (parts.length > 0) return { ...base, kind: 'gap', missingParts: parts };
	const stock = (list: CategoryInvoice[]) => list.some((invoice) => invoice.isFuelStock);
	return changeFinding(base, stock(current), stock(previous));
}

// Costs far from the year before; with both years' readings their consumption (#73). No comparison with a year whose
// readings give a consumption of zero or below: in the period it has its own hint, the year before is no measure
function changeFinding(base: Omit<CategoryFinding, 'kind'>, stockNow: boolean, stockBefore: boolean): CategoryFinding | null {
	if ((stockNow && base.current.total <= 0) || (stockBefore && base.previous.total <= 0)) return null;
	const change = base.current.total - base.previous.total;
	if (Math.abs(change) < DEVIATION_MINIMUM || Math.abs(change) <= base.previous.total * DEVIATION_SHARE) return null;
	return { ...base, kind: stockNow && stockBefore ? 'consumption' : 'deviation', changePercent: Math.round((change / base.previous.total) * 100) };
}

const ORDER = { stock: 0, missing: 1, gap: 2, new: 3, consumption: 4, deviation: 5, tank: 6 };

/**
 * Findings per category of the period against the same dates one year earlier; most serious first.
 * firstInvoiceDate: the building's first invoice in Dwello; a year before recorded only in part is not compared.
 */
export function checkCategories(
	current: CategoryInvoice[],
	previous: CategoryInvoice[],
	period: Period,
	firstInvoiceDate?: string
) {
	const before = yearBefore(period);
	// A period over a year would overlap the same dates one year earlier
	const overAYear = period.end >= yearAfter(period.start);
	const partlyRecorded = !!firstInvoiceDate && firstInvoiceDate > addDays(before.start, RECORDED_FROM_START_DAYS);
	if (overAYear || partlyRecorded || previous.length === 0) return { hasComparison: false, findings: [] };
	const now = groupByCategory(current);
	const then = groupByCategory(previous);
	const findings = [...new Set([...then.keys(), ...now.keys()])]
		.map((key) => findingOf(now.get(key) ?? [], then.get(key) ?? [], period))
		.filter((finding): finding is CategoryFinding => finding !== null)
		.sort((a, b) => ORDER[a.kind] - ORDER[b.kind] || a.categoryName.localeCompare(b.categoryName, 'de'));
	return { hasComparison: true, findings };
}

// The building's allocable invoices of a period as the statement takes them (Leistungszeitraum, otherwise
// Rechnungsdatum): the amount of the period and the date that places the invoice in the rhythm
async function categoryInvoices(buildingId: string, { start, end }: Period): Promise<CategoryInvoice[]> {
	const nameOf = (category: { name: string; nameDE: string | null } | null) => category?.nameDE || category?.name || 'Nicht kategorisiert';
	const bills = (await getInvoicesForStatement(buildingId, start, end)).map((invoice) => ({
		categoryId: invoice.categoryId,
		categoryName: nameOf(invoice.category),
		amount: invoice.inPeriod.amount,
		invoiceDate: invoice.servicePeriodEnd ? invoice.inPeriod.end : invoice.invoiceDate,
		isHeatingCost: !!invoice.category?.isHeatingCost,
		partial: 'whole' in invoice.inPeriod
	}));
	const stock = (await fuelStockChange(buildingId, start, end)).map((change) => ({
		categoryId: change.categoryId,
		categoryName: nameOf(change.category),
		amount: change.inPeriod.amount,
		invoiceDate: end,
		isFuelStock: true
	}));
	return [...bills, ...stock];
}

// Heating costs and never a Tankbestand: if the building heats with oil or pellets, the purchases are billed
function tankQuestion(current: CategoryInvoice[]): CategoryFinding | null {
	const heating = current.filter((invoice) => invoice.isHeatingCost);
	if (heating.length === 0) return null;
	return {
		categoryId: heating[0].categoryId,
		categoryName: heating[0].categoryName,
		kind: 'tank',
		current: sum(heating),
		previous: { count: 0, total: 0 },
		missingParts: [],
		changePercent: null,
		partialCount: 0
	};
}

// Without both readings the statement bills the purchases, not the consumption; a negative consumption is a typo, a
// hint only (#73). A reading whose Stichtag lies after today cannot exist yet (#136). A building recorded without a
// tank needs none for a period no reading covers, and is not asked about one (#72).
async function stockFinding(buildingId: string, period: Period, current: CategoryInvoice[]): Promise<CategoryFinding | null> {
	const [readings, [building]] = await Promise.all([
		periodReadings(buildingId, period.start, period.end),
		db.select({ noTank: buildings.noTank }).from(buildings).where(eq(buildings.id, buildingId))
	]);
	if (building?.noTank && !readings?.covered) return null;
	if (!readings) return tankQuestion(current);
	const today = swissToday();
	const missing = readings.missing.filter((day) => day <= today);
	const costs = current.filter((invoice) => invoice.categoryId === readings.categoryId);
	const [category] = await db.select({ name: categories.name, nameDE: categories.nameDE }).from(categories).where(eq(categories.id, readings.categoryId));
	const finding = {
		categoryId: readings.categoryId,
		categoryName: category.nameDE || category.name,
		kind: 'stock' as const,
		current: sum(costs),
		previous: { count: 0, total: 0 },
		missingParts: missing.map((day) => ({ start: day, end: day })),
		changePercent: null,
		partialCount: 0
	};
	if (missing.length > 0) return finding;
	return finding.current.total < 0 ? { ...finding, kind: 'consumption' } : null;
}

// The building's allocable invoices without Leistungszeitraum dated in these days: they count where their date lies;
// deliveries in the category of the building's Tankbestand count by consumption, never by a Leistungszeitraum
const withoutServicePeriod = (buildingId: string, from: string, to: string) =>
	db
		.select({
			id: invoices.id,
			billingEntityName: invoices.billingEntityName,
			description: invoices.description,
			invoiceDate: invoices.invoiceDate,
			amount: invoices.amount
		})
		.from(invoices)
		.where(
			and(
				eq(invoices.buildingId, buildingId),
				eq(invoices.isValidUtilityCost, true),
				isNull(invoices.servicePeriodStart),
				or(
					isNull(invoices.categoryId),
					notInArray(invoices.categoryId, db.select({ id: fuelStocks.categoryId }).from(fuelStocks).where(eq(fuelStocks.buildingId, buildingId)))
				),
				gte(invoices.invoiceDate, from),
				lte(invoices.invoiceDate, to)
			)
		)
		.orderBy(asc(invoices.invoiceDate));

/**
 * The check for one building and period, with the period it was compared with; also the invoices without
 * Leistungszeitraum dated shortly after the period (they may belong to it) and, in a period under a year, those
 * that count in full (one for a whole year would be billed to the short period alone)
 */
export async function checkBuildingInvoices(buildingId: string, period: Period) {
	const comparedWith = yearBefore(period);
	const underAYear = addDays(period.end, 1) < yearAfter(period.start);
	const [current, previous, [{ first }], lateInvoices, invoicesWithoutServicePeriod] = await Promise.all([
		categoryInvoices(buildingId, period),
		categoryInvoices(buildingId, comparedWith),
		db.select({ first: min(invoices.invoiceDate) }).from(invoices).where(eq(invoices.buildingId, buildingId)),
		withoutServicePeriod(buildingId, addDays(period.end, 1), addDays(period.end, LATE_INVOICE_DAYS)),
		underAYear ? withoutServicePeriod(buildingId, period.start, period.end) : []
	]);
	const { hasComparison, findings } = checkCategories(current, previous, period, first ?? undefined);
	const stock = await stockFinding(buildingId, period, current);
	return {
		buildingId,
		comparedWith,
		hasComparison,
		findings: stock ? [stock, ...findings] : findings,
		lateInvoices,
		invoicesWithoutServicePeriod
	};
}
