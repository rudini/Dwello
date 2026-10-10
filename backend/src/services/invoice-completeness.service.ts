/**
 * Check for missing invoices per cost category: every category with costs in the same dates one year earlier
 * is expected again, in the same rhythm (one invoice per quarter, half-year, month, …). The result is a hint
 * for the property manager, not a rule: a supplier may bill differently from one year to the next.
 */

import { and, eq, gte, lte, min } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, invoices } from '../db/schema';

export interface Period {
	start: string;
	end: string;
}

export interface CategoryInvoice {
	categoryId: string | null;
	categoryName: string;
	amount: number;
	invoiceDate: string;
}

type Sum = { count: number; total: number };

export interface CategoryFinding {
	categoryId: string | null;
	categoryName: string;
	// missing: no invoice although the year before had costs; gap: a part of the rhythm has none;
	// new: costs the year before did not have (agreed in the lease?); deviation: costs differ a lot
	kind: 'missing' | 'gap' | 'new' | 'deviation';
	current: Sum;
	previous: Sum;
	missingParts: Period[]; // the slices of the rhythm without invoice (gap), otherwise empty
	changePercent: number | null; // change of the costs against the year before (deviation), otherwise null
}

// TODO(fachlich prüfen): a change of more than 25 % and at least CHF 100 against the year before is worth a look
const DEVIATION_SHARE = 0.25;
const DEVIATION_MINIMUM = 100;
// TODO(fachlich prüfen): the year before counts as recorded when the building's first invoice lies in its first three months
const RECORDED_FROM_START_DAYS = 92;

const toDate = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);
const toIso = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (iso: string, days: number) => toIso(new Date(toDate(iso).getTime() + days * 86_400_000));

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
	count: list.length,
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

// The rhythm of the year before (one slice per invoice, at most one per month) and the slices without invoice now;
// a credit note is no part of the rhythm, and as many invoices as the year before are complete however they are dated
function missingParts(current: CategoryInvoice[], previous: CategoryInvoice[], period: Period, before: Period) {
	const bills = (list: CategoryInvoice[]) => list.filter((invoice) => invoice.amount >= 0);
	[current, previous] = [bills(current), bills(previous)];
	const parts = Math.min(previous.length, 12);
	if (parts < 2 || current.length >= previous.length) return [];
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
		changePercent: null
	};
	if (previous.length === 0) return base.current.total === 0 ? null : { ...base, kind: 'new' };
	if (base.previous.total === 0) return null;
	if (current.length === 0) return { ...base, kind: 'missing' };
	const parts = missingParts(current, previous, period, yearBefore(period));
	if (parts.length > 0) return { ...base, kind: 'gap', missingParts: parts };
	const change = base.current.total - base.previous.total;
	if (Math.abs(change) >= DEVIATION_MINIMUM && Math.abs(change) > base.previous.total * DEVIATION_SHARE) {
		return { ...base, kind: 'deviation', changePercent: Math.round((change / base.previous.total) * 100) };
	}
	return null;
}

const ORDER = { missing: 0, gap: 1, new: 2, deviation: 3 };

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
	const overAYear = period.end >= toIso(new Date(toDate(period.start).setUTCFullYear(toDate(period.start).getUTCFullYear() + 1)));
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

// The building's allocable invoices of a period, with the category's German name
async function categoryInvoices(buildingId: string, { start, end }: Period): Promise<CategoryInvoice[]> {
	const rows = await db
		.select({
			categoryId: invoices.categoryId,
			name: categories.name,
			nameDE: categories.nameDE,
			amount: invoices.amount,
			invoiceDate: invoices.invoiceDate
		})
		.from(invoices)
		.leftJoin(categories, eq(invoices.categoryId, categories.id))
		.where(
			and(
				eq(invoices.buildingId, buildingId),
				eq(invoices.isValidUtilityCost, true),
				gte(invoices.invoiceDate, start),
				lte(invoices.invoiceDate, end)
			)
		);
	return rows.map((row) => ({
		categoryId: row.categoryId,
		categoryName: row.nameDE || row.name || 'Nicht kategorisiert',
		amount: parseFloat(row.amount),
		invoiceDate: row.invoiceDate
	}));
}

/** The check for one building and period, with the period it was compared with */
export async function checkBuildingInvoices(buildingId: string, period: Period) {
	const comparedWith = yearBefore(period);
	const [current, previous, [{ first }]] = await Promise.all([
		categoryInvoices(buildingId, period),
		categoryInvoices(buildingId, comparedWith),
		db.select({ first: min(invoices.invoiceDate) }).from(invoices).where(eq(invoices.buildingId, buildingId))
	]);
	return { buildingId, comparedWith, ...checkCategories(current, previous, period, first ?? undefined) };
}
