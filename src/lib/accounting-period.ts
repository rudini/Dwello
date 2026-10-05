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
