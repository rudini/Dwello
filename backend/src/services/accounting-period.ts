/**
 * H-28: the rules of Abrechnungsperioden, decided here and not in the BFF: the last ended period of a building's
 * Abrechnungsperiode (#1088), the ended periods since a day, and the ended periods a contract has no statement for.
 * Days are YYYY-MM-DD; today is the Swiss day
 */
import { billsIn } from './contract.service';
import { swissToday } from './today';
import { counting } from './counting-statements';
import { commonType, fitsType, lastCompletedPeriod, month, type AccountingPeriodType, type Range } from './period-types';

export { commonType, lastCompletedPeriod, type AccountingPeriodType, type Range };
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
 * replaced statement no longer counts (#120); every statement is a whole period of its building (#1088, Fachreview
 * 1088-2 V-10)
 */
export function missingPeriods(type: AccountingPeriodType, contract: Rental, statements: Dated[], today = swissToday(), building: Dated[] = []) {
	const billing = counting(statements);
	return endedPeriodsSince(type, contract.startDate, today).filter(
		(period) =>
			billsIn(contract, period) &&
			!billing.some((s) => overlaps({ start: s.periodStart, end: s.periodEnd }, period)) &&
			// an older statement of the building in another period holds days of it: no run can bill it (code review
			// 1088-2 C-7; such statements must not occur, product owner, Fachreview 1088-2 V-10)
			!overlapped(period, building).length
	);
}

/** #1088: the building's own type when a run's period is no whole period of it (Fachreview 1088-2 V-10); else null */
export const otherPeriod = (type: AccountingPeriodType, run: Range) => (fitsType(type, run) ? null : type);

/**
 * The periods of older statements of the building that a run's period overlaps without being equal: the migration
 * (#1088) leaves statements of another period, whose days a run must not bill a second time (#199, code review 1088-1
 * C-1); a replaced one's period stays the building's (#120)
 */
export const overlapped = (run: Range, building: Omit<Dated, 'status'>[]) => periodsOf(building).filter((p) => overlaps(p, run) && !same(p, run));
