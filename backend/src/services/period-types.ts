/**
 * The types of the setting «Abrechnungsperiode» and their last ended period, without other services, so the settings
 * can store a change of it (#512)
 */
import { daysAfter, swissToday } from './today';

// First month (1-12) of each accounting period type
export const FIRST_MONTH = { calendar: 1, 'july-june': 7, 'november-october': 11 } as const;

export type AccountingPeriodType = keyof typeof FIRST_MONTH;
export type Range = { start: string; end: string };
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

/**
 * The change to store when the setting goes from `before` to another type today, as `YYYY-MM-DD:<type>`: a setting
 * that ended no period of its own since the stored change is none, so the stored type stays (code review 512-2 C-4)
 */
export function changeOnSave(before: AccountingPeriodType, stored: string | undefined, today: string) {
	const [on, from] = (stored ?? '').split(':');
	const brief = !!on && lastCompletedPeriod(before, on).end === lastCompletedPeriod(before, today).end;
	return `${today}:${brief ? from : before}`;
}
