import { billingStart, billsIn } from './contract-status';
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
type Dated = { periodStart: string; periodEnd: string; status?: unknown };

// The parts of the period no statement covers, the latest first
export function uncovered(period: Range, statements: { periodStart: string; periodEnd: string }[]) {
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

const overlaps = (a: Range, b: Range) => a.start <= b.end && a.end >= b.start;
const same = (a: Range, b: Range) => a.start === b.start && a.end === b.end;

/**
 * The Abrechnungsperioden of the statements, each once, the earliest first; a replaced one's too: its period stays the
 * building's for its berichtigte Abrechnung (#120, code review 199-2 C-8)
 */
export function periodsOf(statements: Dated[]): Range[] {
	const periods = new Map<string, Range>();
	for (const s of statements) {
		const period = { start: s.periodStart.slice(0, 10), end: s.periodEnd.slice(0, 10) };
		periods.set(`${period.start}/${period.end}`, period);
	}
	return [...periods.values()].sort((a, b) => a.start.localeCompare(b.start));
}

/**
 * #199, #408 point 2: one Abrechnungsperiode per day and building. The building's periods that `run` overlaps without
 * being equal, none when it equals one of them: statements made before this rule may overlap, a run equal to one of
 * their periods is allowed (product owner, Fachreview 199-1 V-1); a run with any of them is refused
 */
export const overlappedBy = (run: Range, periods: Range[]) =>
	periods.some((p) => same(p, run)) ? [] : periods.filter((p) => overlaps(p, run));

/**
 * The contract page's way for each part of its missing periods (#408 point 2): days inside the period of a statement
 * of the building go to exactly that period; the days of an ended period no statement of the building covers to a
 * period of their own, the whole one or a short one for all its contracts. `open` is false when a statement of the
 * contract overlaps that period: the run would not bill it there (periods made before this rule, Fachreview 199-1 V-1)
 */
export function missingWays(
	type: AccountingPeriodType,
	contract: Parameters<typeof billsIn>[0],
	statements: Dated[],
	building: Dated[],
	today = new Date()
) {
	const periods = periodsOf(building);
	// a replaced statement of the contract: the run of its period bills it again (#120)
	const own = periodsOf(statements.filter((s) => s.status !== 'replaced'));
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
					const whole = same(way, period);
					// a whole period by its name, a part by the contract's own days in it
					const [from, to] = whole
						? [gap.start, gap.end]
						: [billingStart(contract), contract.endDate];
					return {
						start: [gap.start, way.start, from].sort()[2],
						end: [gap.end, way.end, to?.slice(0, 10) ?? gap.end].sort()[0],
						way: { kind: whole ? 'whole' : kind, ...way },
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

/** A calendar year by its number, any other range by its two days */
export function periodName({ start, end }: Range) {
	const year = start.slice(0, 4);
	return start === `${year}-01-01` && end === `${year}-12-31`
		? year
		: `${formatDate(start)} – ${formatDate(end)}`;
}
