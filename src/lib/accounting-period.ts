import { billsIn } from './contract-status';
import { formatDate } from './utils/format';

// First month (1-12) of each accounting period type
const FIRST_MONTH = { calendar: 1, 'july-june': 7, 'november-october': 11 } as const;

export type AccountingPeriodType = keyof typeof FIRST_MONTH;

const isoDate = (date: Date) => date.toISOString().split('T')[0];

/** The last accounting period that has ended, e.g. 2025-07-01 – 2026-06-30 for july-june in October 2026 */
export function lastCompletedPeriod(type: AccountingPeriodType, today = new Date()) {
	const firstMonth = FIRST_MONTH[type];
	const currentStartYear =
		today.getMonth() + 1 >= firstMonth ? today.getFullYear() : today.getFullYear() - 1;
	return {
		start: isoDate(new Date(Date.UTC(currentStartYear - 1, firstMonth - 1, 1))),
		// Day 0 of the current period's first month is the last day of the previous period
		end: isoDate(new Date(Date.UTC(currentStartYear, firstMonth - 1, 0)))
	};
}

/** Every ended period that has days on or after `since`, the newest first (#142) */
export function endedPeriodsSince(type: AccountingPeriodType, since: string, today = new Date()) {
	const periods = [];
	for (let back = 0; ; back++) {
		const year = new Date(today);
		year.setFullYear(today.getFullYear() - back);
		const period = lastCompletedPeriod(type, year);
		if (period.end < since) return periods;
		periods.push(period);
	}
}

const dayAfter = (date: string, days = 1) =>
	isoDate(new Date(Date.parse(date) + days * 86_400_000));

type Range = { start: string; end: string };

// The parts of the period no statement covers, the latest first
function uncovered(period: Range, statements: { periodStart: string; periodEnd: string }[]) {
	const gaps: Range[] = [];
	let from = period.start;
	for (const s of [...statements].sort((a, b) => a.periodStart.localeCompare(b.periodStart))) {
		const [start, end] = [s.periodStart.slice(0, 10), s.periodEnd.slice(0, 10)];
		if (start > period.end) break;
		if (start > from) gaps.push({ start: from, end: dayAfter(start, -1) });
		if (end >= from) from = dayAfter(end);
	}
	if (from <= period.end) gaps.push({ start: from, end: period.end });
	return gaps.reverse();
}

/**
 * Each part of an ended period since the Vertragsbeginn that no statement of the contract covers and in which Dwello
 * bills rent days (from the day after «Abgerechnet bis», #133), the latest first (#199, #211); a replaced statement no
 * longer covers its days (#120)
 */
export function missingPeriods(
	type: AccountingPeriodType,
	contract: Parameters<typeof billsIn>[0],
	statements: { periodStart: string; periodEnd: string; status?: unknown }[],
	today = new Date()
) {
	const billing = statements.filter((s) => s.status !== 'replaced');
	return endedPeriodsSince(type, contract.startDate.slice(0, 10), today)
		.flatMap((period) => uncovered(period, billing))
		.filter((gap) => billsIn(contract, gap));
}

/** A calendar year by its number, any other range by its two days */
export function periodName({ start, end }: Range) {
	const year = start.slice(0, 4);
	return start === `${year}-01-01` && end === `${year}-12-31`
		? year
		: `${formatDate(start)} – ${formatDate(end)}`;
}
