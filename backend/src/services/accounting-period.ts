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
/** #512: the day the setting changed and the type it had before, as stored when it was saved */
export type PeriodChange = { on: string; from: AccountingPeriodType } | null;

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
export function missingPeriods(
	type: AccountingPeriodType,
	contract: Rental,
	statements: Dated[],
	today = swissToday(),
	building = statements,
	change: PeriodChange = null
) {
	const billing = counting(statements);
	return cutPeriods(type, contract.startDate, building, today, change)
		.flatMap(({ period }) => uncovered(period, billing))
		.filter((gap) => billsIn(contract, gap));
}

const typeOf = (period: Range) =>
	(Object.keys(FIRST_MONTH) as AccountingPeriodType[]).find((type) => same(lastCompletedPeriod(type, daysAfter(period.end, 1)), period));

/**
 * #512: the stored change of the setting: the earlier type until the end of its last period ended before that day.
 * Without one, before the building's first whole statement under the setting, its last whole statement of another
 * type tells the type the landlord billed by until its end; null when there is none
 */
function earlierType(type: AccountingPeriodType, building: Omit<Dated, 'status'>[], change: PeriodChange) {
	// a change back to the type before that day is none
	if (change && change.from !== type) return { type: change.from, switched: daysAfter(lastCompletedPeriod(change.from, change.on).end, 1) };
	const whole = periodsOf(building).filter((p) => typeOf(p));
	const first = whole.find((p) => typeOf(p) === type);
	const last = whole.filter((p) => typeOf(p) !== type && (!first || p.start < first.start)).at(-1);
	// the setting's first statement ends the earlier type, also when an earlier statement overlaps it
	return last ? { type: typeOf(last)!, switched: [daysAfter(last.end, 1), first?.start ?? '9999-12-31'].sort()[0] } : null;
}

/**
 * The ended periods since a day, the newest first, each with the whole period of its type: until the end of the
 * building's earlier type (#512) cut by that type, after it by the setting, the first of these from the day after
 */
function cutPeriods(type: AccountingPeriodType, since: string, building: Omit<Dated, 'status'>[], today: string, change: PeriodChange) {
	const earlier = earlierType(type, building, change);
	const switched = earlier?.switched ?? '';
	const current = endedPeriodsSince(type, since, today)
		.filter((full) => full.end >= switched)
		.map((full) => ({ period: { start: [full.start, switched].sort()[1], end: full.end }, full, earlier: false }));
	const before = earlier
		? endedPeriodsSince(earlier.type, since, today)
				.filter((full) => full.start < switched)
				.map((full) => ({ period: { start: full.start, end: [full.end, daysAfter(switched, -1)].sort()[0] }, full, earlier: true }))
		: [];
	return [...current, ...before];
}

/**
 * The contract page's way for each part of its missing periods (#408 point 2): days inside the period of a statement
 * of the building go to exactly that period; the days of an ended period no statement of the building covers to a
 * period of their own, the whole one or a short one for all its contracts. `open` is false when a statement of the
 * contract overlaps that period: the run would not bill it there (periods made before this rule, Fachreview 199-1 V-1)
 */
export function missingWays(
	type: AccountingPeriodType,
	contract: Rental,
	statements: Dated[],
	building: Dated[],
	today = swissToday(),
	change: PeriodChange = null
) {
	const periods = periodsOf(building);
	// a replaced statement of the contract: the run of its period bills it again (#120)
	const own = periodsOf(counting(statements));
	const ways = (period: Range) => [
		...periods.filter((p) => overlaps(p, period)).map((p) => ({ ...p, kind: 'existing' })),
		...uncovered(period, building).map((u) => ({ ...u, kind: 'short' }))
	];
	const cut = cutPeriods(type, contract.startDate, building, today, change);
	return (
		missingPeriods(type, contract, statements, today, building, change)
			.flatMap((gap) => {
				const { period, full, earlier } = cut.find((p) => p.period.start <= gap.start)!;
				// days in a period equal to the building's go there only, not again to an overlapping older one (code
				// review 199-1 C-2)
				const found = ways(period).filter((way) => overlaps(way, gap));
				const whole = found.filter((way) => same(way, full));
				return (whole.length ? whole.slice(0, 1) : found).map(({ kind, ...way }) => {
					// a period of the earlier type that a statement of the building has is chosen, as before #512
					const isWhole = same(way, full) && !(earlier && kind === 'existing');
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
