/**
 * H-28: the rules of Abrechnungsperioden, decided here and not in the BFF: the last ended period of the setting, the
 * ended periods since a day, which days the statements cover, and the parts of ended periods a contract has no
 * statement for. Days are YYYY-MM-DD; today is the Swiss day
 */
import { billingStart, billsIn } from './contract.service';
import { daysAfter, swissToday } from './today';
import { counting } from './counting-statements';

// First month (1-12) of each accounting period type
const FIRST_MONTH = { calendar: 1, 'july-june': 7, 'november-october': 11 } as const;

export type AccountingPeriodType = keyof typeof FIRST_MONTH;
export type Range = { start: string; end: string };
type Dated = { periodStart: string; periodEnd: string; status: string };
type Rental = { startDate: string; endDate: string | null; billedUntil: string | null };

const month = (n: number) => String(n).padStart(2, '0');

/** The last accounting period that has ended, e.g. 2025-07-01 – 2026-06-30 for july-june in October 2026 */
export function lastCompletedPeriod(type: AccountingPeriodType, today = swissToday()): Range {
	const [year, now] = today.split('-').map(Number);
	const first = FIRST_MONTH[type];
	const runningSince = now >= first ? year : year - 1;
	return { start: `${runningSince - 1}-${month(first)}-01`, end: daysAfter(`${runningSince}-${month(first)}-01`, -1) };
}

/** Every ended period that has days on or after `since`, the newest first (#142) */
export function endedPeriodsSince(type: AccountingPeriodType, since: string, today = swissToday()): Range[] {
	const [year, now] = today.split('-').map(Number);
	const periods: Range[] = [];
	for (let back = 0; ; back++) {
		const period = lastCompletedPeriod(type, `${year - back}-${month(now)}-01`);
		if (period.end < since) return periods;
		periods.push(period);
	}
}

export const overlaps = (a: Range, b: Range) => a.start <= b.end && a.end >= b.start;
export const same = (a: Range, b: Range) => a.start === b.start && a.end === b.end;

/**
 * The Abrechnungsperioden of the statements, each once, the earliest first; a replaced one's too: its period stays the
 * building's for its berichtigte Abrechnung (#120, code review 199-2 C-8)
 */
export function periodsOf(statements: Omit<Dated, 'status'>[]): Range[] {
	const periods = new Map(statements.map((s) => [`${s.periodStart}/${s.periodEnd}`, { start: s.periodStart, end: s.periodEnd }]));
	return [...periods.values()].sort((a, b) => a.start.localeCompare(b.start));
}

/** The parts of the period no statement covers, the latest first */
export function uncovered(period: Range, statements: Omit<Dated, 'status'>[]) {
	const gaps: Range[] = [];
	let from = period.start;
	for (const s of [...statements].sort((a, b) => a.periodStart.localeCompare(b.periodStart))) {
		if (s.periodStart > period.end) break;
		if (s.periodStart > from) gaps.push({ start: from, end: daysAfter(s.periodStart, -1) });
		if (s.periodEnd >= from) from = daysAfter(s.periodEnd, 1);
	}
	if (from <= period.end) gaps.push({ start: from, end: period.end });
	return gaps.reverse();
}

/**
 * Each part of an ended period since the Vertragsbeginn that no statement of the contract covers and in which Dwello
 * bills rent days (from the day after «Abgerechnet bis», #133), the latest first (#199, #211); a replaced statement no
 * longer covers its days (#120)
 */
export function missingPeriods(type: AccountingPeriodType, contract: Rental, statements: Dated[], today = swissToday()) {
	const billing = counting(statements);
	return endedPeriodsSince(type, contract.startDate, today)
		.flatMap((period) => uncovered(period, billing))
		.filter((gap) => billsIn(contract, gap));
}

/**
 * The contract page's way for each part of its missing periods (#408 point 2): days inside the period of a statement
 * of the building go to exactly that period; the days of an ended period no statement of the building covers to a
 * period of their own, the whole one or a short one for all its contracts. `open` is false when a statement of the
 * contract overlaps that period: the run would not bill it there (periods made before this rule, Fachreview 199-1 V-1)
 */
export function missingWays(type: AccountingPeriodType, contract: Rental, statements: Dated[], building: Dated[], today = swissToday()) {
	const periods = periodsOf(building);
	// a replaced statement of the contract: the run of its period bills it again (#120)
	const own = periodsOf(counting(statements));
	const ways = (period: Range) => [
		...periods.filter((p) => overlaps(p, period)).map((p) => ({ ...p, kind: 'existing' })),
		...uncovered(period, building).map((u) => ({ ...u, kind: 'short' }))
	];
	return (
		missingPeriods(type, contract, statements, today)
			.flatMap((gap) => {
				const period = endedPeriodsSince(type, gap.start, today).find((p) => p.start <= gap.start)!;
				// days in a period equal to the building's go there only, not again to an overlapping older one (code
				// review 199-1 C-2)
				const found = ways(period).filter((way) => overlaps(way, gap));
				const whole = found.filter((way) => same(way, period));
				return (whole.length ? whole.slice(0, 1) : found).map(({ kind, ...way }) => {
					const isWhole = same(way, period);
					// a whole period by its name, a part by the contract's own days in it
					const [from, to] = isWhole ? [gap.start, gap.end] : [billingStart(contract), contract.endDate];
					return {
						start: [gap.start, way.start, from].sort()[2],
						end: [gap.end, way.end, to ?? gap.end].sort()[0],
						way: { kind: isWhole ? 'whole' : kind, ...way },
						open: !own.some((p) => overlaps(p, way))
					};
				});
			})
			.filter((part) => part.start <= part.end && billsIn(contract, part))
			// the latest first; of two older periods with one first day the longer one, so no day is lost (code review
			// 199-2 C-9)
			.sort((a, b) => b.start.localeCompare(a.start) || b.end.localeCompare(a.end))
			.filter((part, i, all) => all.findIndex((other) => other.start === part.start) === i)
	);
}
