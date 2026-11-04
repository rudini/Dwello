/**
 * The types of a building's Abrechnungsperiode (#1088) and their last ended period, without other services
 */
import { daysAfter, swissToday } from './today';

// First month (1-12) of each accounting period type
export const FIRST_MONTH = { calendar: 1, 'july-june': 7, 'november-october': 11 } as const;

export type AccountingPeriodType = keyof typeof FIRST_MONTH;
export type Range = { start: string; end: string };

export const month = (n: number) => String(n).padStart(2, '0');

/** The last accounting period that has ended, e.g. 2025-07-01 – 2026-06-30 for july-june in October 2026 */
export function lastCompletedPeriod(type: AccountingPeriodType, today = swissToday()): Range {
	const [year, now] = today.split('-').map(Number);
	const first = FIRST_MONTH[type];
	const runningSince = now >= first ? year : year - 1;
	return { start: `${runningSince - 1}-${month(first)}-01`, end: daysAfter(`${runningSince}-${month(first)}-01`, -1) };
}

/**
 * #1103 (Fachreview 1103-1): the Tankbestand's Stichtag is the end of the last ended period, today included; its value
 * ends that period and starts the next one. The help and the Stichtag field's example name them
 */
export function stockPeriods(type: AccountingPeriodType, today = swissToday()) {
	const ended = lastCompletedPeriod(type, daysAfter(today, 1));
	return { ended, next: { start: daysAfter(ended.end, 1), end: `${Number(ended.end.slice(0, 4)) + 1}${ended.end.slice(4)}` } };
}

/** #1088: whether a run's period is a whole period of the type; there are no short periods (product owner 03.11.2026) */
export function fitsType(type: AccountingPeriodType, period: Range) {
	const whole = lastCompletedPeriod(type, daysAfter(period.end, 1));
	return whole.start === period.start && whole.end === period.end;
}

/**
 * #1088: the type most buildings have, for the wizard's proposal and a new building's; a tie goes to the type whose
 * last period ended last (Fachreview 1088-1 V-5), none to the calendar year
 */
export function commonType(types: AccountingPeriodType[], today = swissToday()): AccountingPeriodType {
	const count = (type: AccountingPeriodType) => types.filter((t) => t === type).length;
	const ended = (type: AccountingPeriodType) => lastCompletedPeriod(type, today).end;
	const [first] = (Object.keys(FIRST_MONTH) as AccountingPeriodType[]).sort((a, b) => count(b) - count(a) || ended(b).localeCompare(ended(a)));
	return types.length ? first : 'calendar';
}
