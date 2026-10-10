/**
 * Check for missing invoices per cost category: every category with costs in the same dates one year earlier
 * is expected again, in the same rhythm (one invoice per quarter, half-year, month, …). The result is a hint
 * for the property manager, not a rule: a supplier may bill differently from one year to the next.
 */

import { and, eq, gte, lte } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, invoices } from '../db/schema';
import { formatSwissDate } from './pdf-format';

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
	// missing: no invoice although the year before had costs; gap: a part of the rhythm has none; deviation: costs differ a lot
	kind: 'missing' | 'gap' | 'deviation';
	current: Sum;
	previous: Sum;
	missingParts: string[]; // the slices of the rhythm without invoice (gap), otherwise empty
	changePercent: number | null; // change of the costs against the year before (deviation), otherwise null
}

// TODO(fachlich prüfen): a change of more than 25 % and at least CHF 100 against the year before is worth a look
const DEVIATION_SHARE = 0.25;
const DEVIATION_MINIMUM = 100;

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

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

// "den März", "das 3. Quartal", "das 2. Halbjahr" for calendar slices, otherwise the dates
function label({ start, end }: Period): string {
	const months = wholeMonths({ start, end });
	const month = toDate(start).getUTCMonth();
	if (months === 1) return `den ${MONTHS[month]}`;
	if (months === 3 && month % 3 === 0) return `das ${month / 3 + 1}. Quartal`;
	if (months === 6 && month % 6 === 0) return `das ${month / 6 + 1}. Halbjahr`;
	return `die Zeit vom ${formatSwissDate(start)} bis ${formatSwissDate(end)}`;
}

const sum = (list: CategoryInvoice[]): Sum => ({
	count: list.length,
	total: Math.round(list.reduce((total, invoice) => total + invoice.amount, 0) * 100) / 100
});

function groupByCategory(list: CategoryInvoice[]) {
	const groups = new Map<string, CategoryInvoice[]>();
	for (const invoice of list) {
		const key = invoice.categoryId ?? 'none';
		groups.set(key, [...(groups.get(key) ?? []), invoice]);
	}
	return groups;
}

// The rhythm of the year before (one slice per invoice, at most one per month) and the slices without invoice now
function missingParts(current: CategoryInvoice[], previous: CategoryInvoice[], period: Period, before: Period) {
	const parts = Math.min(previous.length, 12);
	if (parts < 2) return [];
	const now = slices(period, parts);
	const then = slices(before, parts);
	const billedThen = new Set(previous.map((invoice) => sliceOf(invoice.invoiceDate, then)));
	const billedNow = new Set(current.map((invoice) => sliceOf(invoice.invoiceDate, now)));
	return now.filter((_, k) => billedThen.has(k) && !billedNow.has(k)).map(label);
}

function findingOf(current: CategoryInvoice[], previous: CategoryInvoice[], period: Period): CategoryFinding | null {
	const sample = previous[0];
	const base = {
		categoryId: sample.categoryId,
		categoryName: sample.categoryName,
		current: sum(current),
		previous: sum(previous),
		missingParts: [] as string[],
		changePercent: null
	};
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

const ORDER = { missing: 0, gap: 1, deviation: 2 };

/** Findings per category of the period against the same dates one year earlier; most serious first */
export function checkCategories(current: CategoryInvoice[], previous: CategoryInvoice[], period: Period) {
	const now = groupByCategory(current);
	const findings = [...groupByCategory(previous)]
		.map(([key, before]) => findingOf(now.get(key) ?? [], before, period))
		.filter((finding): finding is CategoryFinding => finding !== null)
		.sort((a, b) => ORDER[a.kind] - ORDER[b.kind] || a.categoryName.localeCompare(b.categoryName, 'de'));
	return { hasComparison: previous.length > 0, findings };
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
	const [current, previous] = await Promise.all([
		categoryInvoices(buildingId, period),
		categoryInvoices(buildingId, comparedWith)
	]);
	return { buildingId, comparedWith, ...checkCategories(current, previous, period) };
}
