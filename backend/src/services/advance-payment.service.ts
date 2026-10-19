import { and, asc, eq, ne, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { contractAdvancePayments, rentalContracts, utilityStatements, type AdvanceLine } from '../db/schema';
import { formatSwissDate, roundToRappen } from './pdf-format';
import { CodedError } from './coded-error';
import { sqlToday } from './today';

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** The Akonto amounts of a contract per «Gültig ab» (#464), oldest first */
export const advancesOf = (contractId: string, tx: Tx | typeof db = db) =>
	tx
		.select({ validFrom: contractAdvancePayments.validFrom, amount: contractAdvancePayments.amount })
		.from(contractAdvancePayments)
		.where(eq(contractAdvancePayments.contractId, contractId))
		.orderBy(asc(contractAdvancePayments.validFrom));

/**
 * The Akonto that applies on the contract's reference day (domain review F-5): today, the Vertragsbeginn of a future
 * contract, the Vertragsende of an ended one; the first amount applies from the Vertragsbeginn whatever its day
 */
export const currentAdvance = sql<string>`coalesce((
	select a.amount from ${contractAdvancePayments} a
	where a.contract_id = ${rentalContracts.id}
		and a.valid_from <= least(greatest(${sqlToday}, ${rentalContracts.startDate}), coalesce(${rentalContracts.endDate}, 'infinity'::date))
	order by a.valid_from desc limit 1
), (
	select a.amount from ${contractAdvancePayments} a where a.contract_id = ${rentalContracts.id} order by a.valid_from limit 1
), ${rentalContracts.monthlyAdvancePayment})`;

type Amounts = { validFrom: string; amount: number }[];
const amountsOf = async (contractId: string, tx: Tx): Promise<Amounts> =>
	(await advancesOf(contractId, tx)).map(({ validFrom, amount }) => ({ validFrom, amount: parseFloat(amount) }));

/** A new Akonto from a day on (#464); without a day the first amount, from the Vertragsbeginn. The same day replaces */
export async function setAdvance(contractId: string, amount: string, from: string | undefined, tx: Tx) {
	const [first] = await advancesOf(contractId, tx);
	const [{ startDate, endDate }] = await tx
		.select({ startDate: rentalContracts.startDate, endDate: rentalContracts.endDate })
		.from(rentalContracts)
		.where(eq(rentalContracts.id, contractId));
	// a monthly amount changes on the first of a month, within the contract (product owner on F-10, 2026-10-19); the
	// first amount keeps its day, also when the Vertragsbeginn moves: it applies from the Vertragsbeginn anyway
	if (from === first?.validFrom) from = undefined;
	if (from && from !== startDate && !from.endsWith('-01')) {
		const [year, month] = from.split('-').map(Number);
		const next = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
		throw new CodedError('ADVANCE_FROM_NOT_MONTH_START', 'A new Akonto applies from the first of a month', {
			next: formatSwissDate(next)
		});
	}
	if (from && from < startDate)
		throw new CodedError('ADVANCE_FROM_BEFORE_START', 'An Akonto cannot apply before the contract start', {
			date: formatSwissDate(startDate)
		});
	if (from && endDate && from > endDate)
		throw new CodedError('ADVANCE_FROM_AFTER_END', 'An Akonto cannot apply after the contract end', {
			date: formatSwissDate(endDate)
		});
	const validFrom = from ?? first?.validFrom ?? startDate;
	const before = await amountsOf(contractId, tx);
	await tx
		.insert(contractAdvancePayments)
		.values({ contractId, validFrom, amount })
		.onConflictDoUpdate({ target: [contractAdvancePayments.contractId, contractAdvancePayments.validFrom], set: { amount } });
	await refuseChangedStatements(contractId, validFrom, before, tx);
}

/** Delete a later Akonto, never the first (product owner on F-13, 2026-10-19); the earlier amount applies again */
export async function deleteAdvance(contractId: string, validFrom: string) {
	await db.transaction(async (tx) => {
		const [first] = await advancesOf(contractId, tx);
		if (first?.validFrom === validFrom) throw new CodedError('ADVANCE_FIRST_NOT_DELETABLE', 'The first Akonto cannot be deleted');
		const before = await amountsOf(contractId, tx);
		await tx
			.delete(contractAdvancePayments)
			.where(and(eq(contractAdvancePayments.contractId, contractId), eq(contractAdvancePayments.validFrom, validFrom)));
		await refuseChangedStatements(contractId, validFrom, before, tx);
	});
}

/**
 * A changed Akonto may not alter a statement already created, not replaced (product owner on F-3, 2026-10-19): it
 * would change what the tenant was billed silently; a draft is deleted first, a sent statement corrected first
 */
async function refuseChangedStatements(contractId: string, validFrom: string, before: Amounts, tx: Tx) {
	const after = await amountsOf(contractId, tx);
	const statements = await tx
		.select({
			number: utilityStatements.statementNumber,
			status: utilityStatements.status,
			rentalStart: utilityStatements.rentalStart,
			rentalEnd: utilityStatements.rentalEnd
		})
		.from(utilityStatements)
		.where(and(eq(utilityStatements.contractId, contractId), ne(utilityStatements.status, 'replaced')));
	for (const statement of statements) {
		// only what this change alters: a statement that counted another Akonto already stays editable (F-4)
		const total = (amounts: Amounts) =>
			advanceLines(amounts, new Date(statement.rentalStart), new Date(statement.rentalEnd)).reduce((sum, line) => sum + line.total, 0);
		if (Math.abs(total(after) - total(before)) < 0.005) continue;
		const params = { from: formatSwissDate(validFrom), number: statement.number };
		if (statement.status === 'draft')
			throw new CodedError('ADVANCE_CHANGES_DRAFT', 'The new Akonto changes a draft statement', params);
		throw new CodedError('ADVANCE_CHANGES_STATEMENT', 'The new Akonto changes a statement already created', params);
	}
}

const isoDay = (date: Date) => date.toISOString().slice(0, 10);

/**
 * The Akonto of a rental span, each amount for the months it applied (#464): one line per amount over its whole months,
 * one per split month by its days; each line rounded, so the lines add up to the total (domain review F-2). The first
 * amount applies from the Vertragsbeginn whatever its day
 */
export function advanceLines(amounts: { validFrom: string; amount: number }[], rentalStart: Date, rentalEnd: Date) {
	const sorted = [...amounts].sort((a, b) => a.validFrom.localeCompare(b.validFrom));
	const amountOn = (day: string) => [...sorted].reverse().find((entry, i) => i === sorted.length - 1 || entry.validFrom <= day)!.amount;
	const lines: AdvanceLine[] = [];
	const cursor = new Date(Date.UTC(rentalStart.getUTCFullYear(), rentalStart.getUTCMonth(), 1));
	while (cursor <= rentalEnd) {
		const year = cursor.getUTCFullYear();
		const month = cursor.getUTCMonth();
		const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
		const first = rentalStart > cursor ? rentalStart : new Date(cursor);
		const monthEnd = new Date(Date.UTC(year, month, daysInMonth));
		const last = rentalEnd < monthEnd ? rentalEnd : monthEnd;
		const amount = amountOn(isoDay(first));
		const days = last.getUTCDate() - first.getUTCDate() + 1;
		const previous = lines.at(-1);
		if (days < daysInMonth) lines.push({ from: isoDay(first), to: isoDay(last), days, daysInMonth, amount, total: roundToRappen((days / daysInMonth) * amount) });
		else if (previous && 'months' in previous && previous.amount === amount) {
			previous.to = isoDay(last);
			previous.months += 1;
			previous.total = roundToRappen(previous.months * amount);
		} else lines.push({ from: isoDay(first), to: isoDay(last), months: 1, amount, total: roundToRappen(amount) });
		cursor.setUTCMonth(month + 1);
	}
	return lines;
}

/** The Akonto total of a span with one amount; advances are due per calendar month, a split month by its share of days */
export function calculateTotalAdvancePayments(monthlyAdvancePayment: number, rentalStart: Date, rentalEnd: Date): number {
	const lines = advanceLines([{ validFrom: isoDay(rentalStart), amount: monthlyAdvancePayment }], rentalStart, rentalEnd);
	return roundToRappen(lines.reduce((sum, line) => sum + line.total, 0));
}
