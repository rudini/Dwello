/**
 * H-28: the rules of Abrechnungsperioden, decided here and not in the BFF: the last ended period of a building's
 * Abrechnungsperiode (#1088), the ended periods since a day, and the ended periods a contract has no statement for.
 * Days are YYYY-MM-DD; today is the Swiss day
 */
import { billingStart, billsIn } from './contract.service';
import { swissToday } from './today';
import { counting } from './counting-statements';
import { fitsType, lastCompletedPeriod, month, type AccountingPeriodType, type Range } from './period-types';

export { lastCompletedPeriod, type AccountingPeriodType, type Range };
type Dated = { periodStart: string; periodEnd: string; status: string };
type Rental = { startDate: string; endDate: string | null; billedUntil: string | null };

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

/**
 * Each ended whole period of the building's type since the Vertragsbeginn in which Dwello bills rent days (from the day
 * after «Abgerechnet bis», #133) and no statement of the contract overlaps it, the latest first (#142, #211); a
 * replaced statement no longer counts (#120). An older statement of another period that overlaps it counts: there are
 * no short periods for the rest of its days (#1088, product owner 03.11.2026)
 */
export function missingPeriods(type: AccountingPeriodType, contract: Rental, statements: Dated[], today = swissToday()) {
	const billing = counting(statements);
	return endedPeriodsSince(type, contract.startDate, today).filter(
		(period) => billsIn(contract, period) && !billing.some((s) => overlaps({ start: s.periodStart, end: s.periodEnd }, period))
	);
}

/**
 * The contract page's way for each missing period: the whole period, or, where older statements of the building in
 * another period overlap it, those periods (#408 point 2, #1088 Fachreview 1088-1 V-1), each with the contract's own
 * days there. `open` is false when a statement of the contract overlaps that period: the run would not bill it there
 * (periods made before this rule, Fachreview 199-1 V-1)
 */
export function missingWays(type: AccountingPeriodType, contract: Rental, statements: Dated[], building: Dated[], today = swissToday()) {
	const periods = periodsOf(building);
	// a replaced statement of the contract: the run of its period bills it again (#120)
	const own = periodsOf(counting(statements));
	return (
		missingPeriods(type, contract, statements, today)
			.flatMap((period) => {
				const older = periods.filter((p) => overlaps(p, period));
				if (!older.length || older.some((p) => same(p, period))) return [{ ...period, way: { kind: 'whole', ...period }, open: true }];
				return older.map((way) => ({
					start: [way.start, billingStart(contract)].sort()[1],
					end: [way.end, contract.endDate ?? way.end].sort()[0],
					way: { kind: 'existing', ...way },
					open: !own.some((p) => overlaps(p, way))
				}));
			})
			.filter((part) => part.start <= part.end && billsIn(contract, part))
			// the latest first, each way once
			.sort((a, b) => b.start.localeCompare(a.start) || b.end.localeCompare(a.end))
			.filter((part, i, all) => all.findIndex((other) => same(other.way, part.way)) === i)
	);
}

/**
 * #1088: the building's own type when a run's period is neither a whole period of it nor the period of one of the
 * building's statements (older ones of another period stay billable, Fachreview 1088-1 V-1); else null
 */
export function otherPeriod(type: AccountingPeriodType, run: Range, building: Omit<Dated, 'status'>[]) {
	return fitsType(type, run) || periodsOf(building).some((p) => same(p, run)) ? null : type;
}
