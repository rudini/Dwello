/**
 * #1409: the Jahresbericht of a building and a calendar year (PO 09.11.2026, V-12 B, V-13 option 2): the Mietertrag
 * the contracts agree (Nettomiete, Zusatzmiete, Nebenkostenpauschale; a broken month by its days as in `advanceLines`),
 * not checked against payments; and the costs the landlord bears: the non-allocable invoices by Rechnungsdatum without
 * Hypothekarzinsen, «Wertvermehrende Investitionen» apart, and «davon tragen Sie» of the Kostenabstimmung of the
 * building's Abrechnungsperiode that ends in the year
 */

import { and, asc, eq, gte, isNull, lte, min, ne, or } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, buildings, categories, invoices, rentalContracts } from '../db/schema';
import { incomeOf } from './annual-income';
import { reportReconciliation, validStatements } from './cost-reconciliation.service';
import { roundToRappen } from './pdf-format';
import { lastCompletedPeriod } from './period-types';
import type { AnnualReportBody } from '../api/report';

type Row = { categoryId: string | null; amount: number };
const sum = (values: number[]) => roundToRappen(values.reduce((total, value) => total + value, 0));
const group = (rows: Row[]) => ({ categories: rows, total: sum(rows.map(({ amount }) => amount)) });

/** The amounts of the rows of one category added up, in the order of their first row */
function byCategory(rows: Row[]) {
	const sums = new Map<string | null, number[]>();
	for (const { categoryId, amount } of rows)
		sums.set(categoryId, [...(sums.get(categoryId) ?? []), amount]);
	return [...sums].map(([categoryId, amounts]) => ({ categoryId, amount: sum(amounts) }));
}

export async function annualReport(buildingId: string, year: number): Promise<AnnualReportBody> {
	const [start, end] = [`${year}-01-01`, `${year}-12-31`];
	const [income, costs, first] = await Promise.all([
		incomeOf(buildingId, start, end),
		costsOf(buildingId, start, end),
		firstYear(buildingId, year)
	]);
	return { year, firstYear: first, income, costs };
}

async function costsOf(buildingId: string, start: string, end: string) {
	const [own, utility] = await Promise.all([
		db
			.select({ categoryId: invoices.categoryId, name: categories.name, amount: invoices.amount })
			.from(invoices)
			.leftJoin(categories, eq(categories.id, invoices.categoryId))
			.where(
				and(
					eq(invoices.buildingId, buildingId),
					eq(invoices.isValidUtilityCost, false),
					gte(invoices.invoiceDate, start),
					lte(invoices.invoiceDate, end),
					or(isNull(categories.name), ne(categories.name, 'Mortgage Interest'))
				)
			)
			.orderBy(asc(categories.sortOrder), asc(categories.name), asc(invoices.invoiceDate)),
		utilityOf(buildingId, end)
	]);
	const rows = (capital: boolean) =>
		byCategory(
			own
				.filter(({ name }) => (name === 'Capital Improvements') === capital)
				.map(({ categoryId, amount }) => ({ categoryId, amount: parseFloat(amount) }))
		);
	const maintenance = group(rows(false));
	return {
		utility,
		maintenance,
		totalWithoutCapital: sum([utility.total, maintenance.total]),
		capital: group(rows(true))
	};
}

/**
 * «davon tragen Sie» of the Kostenabstimmung of the building's Abrechnungsperiode that ends in the year, per category
 * without rows of 0.00; none without valid statements of that period (Fachreview 1409-2 V-14)
 */
async function utilityOf(buildingId: string, yearEnd: string) {
	const period = await periodEndingIn(buildingId, yearEnd);
	const [statements, outside] = await Promise.all([
		validStatements(buildingId, period),
		billedOutside(buildingId, period)
	]);
	const base = { period, billed: statements.length > 0, notes: false, outside };
	if (!base.billed) return { ...base, outside: false, ...group([]) };
	const reconciliation = await reportReconciliation(buildingId, period);
	const { drafts, notUpToDate, keyNotCalculable, withoutStatement } = reconciliation;
	const notes =
		[drafts, notUpToDate, keyNotCalculable].some((list) => list?.length) || !!withoutStatement;
	const rank = await categoryRank();
	const rows = byCategory(
		reconciliation.positions.map(({ categoryId, landlord }) => ({ categoryId, amount: landlord }))
	)
		.filter(({ amount }) => amount !== 0)
		.sort((a, b) => rank(a) - rank(b));
	return { ...base, notes, ...group(rows) };
}

/** The building's Abrechnungsperiode that ends in the year of `yearEnd` */
async function periodEndingIn(buildingId: string, yearEnd: string) {
	const [{ type }] = await db
		.select({ type: buildings.accountingPeriod })
		.from(buildings)
		.where(eq(buildings.id, buildingId));
	return lastCompletedPeriod(type, `${Number(yearEnd.slice(0, 4)) + 1}-01-01`);
}

/** Whether a contract of the building is billed outside Dwello up to a day of the period («Abgerechnet bis») */
async function billedOutside(buildingId: string, period: { start: string; end: string }) {
	const found = await db
		.select({ id: rentalContracts.id })
		.from(rentalContracts)
		.innerJoin(apartments, eq(apartments.id, rentalContracts.apartmentId))
		.where(
			and(
				eq(apartments.buildingId, buildingId),
				gte(rentalContracts.billedUntil, period.start),
				lte(rentalContracts.billedUntil, period.end)
			)
		)
		.limit(1);
	return found.length > 0;
}

/** The place of a row in the order of the categories, as the other groups; a row without a Kategorie last */
async function categoryRank() {
	const ordered = await db
		.select({ id: categories.id })
		.from(categories)
		.orderBy(asc(categories.sortOrder), asc(categories.name));
	const order = new Map(ordered.map(({ id }, i) => [id, i]));
	return ({ categoryId }: Row) =>
		categoryId === null ? Infinity : (order.get(categoryId) ?? Infinity);
}

/** The year of the building's first contract or invoice, also one after the year asked; without any, the year asked */
async function firstYear(buildingId: string, year: number) {
	const [[contract], [invoice]] = await Promise.all([
		db
			.select({ first: min(rentalContracts.startDate) })
			.from(rentalContracts)
			.innerJoin(apartments, eq(apartments.id, rentalContracts.apartmentId))
			.where(eq(apartments.buildingId, buildingId)),
		db
			.select({ first: min(invoices.invoiceDate) })
			.from(invoices)
			.where(eq(invoices.buildingId, buildingId))
	]);
	const years = [contract?.first, invoice?.first]
		.filter(Boolean)
		.map((day) => Number(day!.slice(0, 4)));
	return years.length ? Math.min(...years) : year;
}
