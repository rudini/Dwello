import { sql } from 'drizzle-orm';

/** Today's date in Switzerland as YYYY-MM-DD; server and database run in UTC, a day behind until 01:00 or 02:00 */
export const swissToday = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });

/** The YYYY-MM-DD date the given number of days after a YYYY-MM-DD date */
export const daysAfter = (isoDate: string, days: number) =>
	new Date(Date.parse(isoDate) + days * 86_400_000).toISOString().slice(0, 10);

/** Today's Swiss date in SQL instead of current_date, read each time a query is built */
export const sqlToday = { getSQL: () => sql`${swissToday()}::date` };

/** Whether a period ended more than five calendar years before the given day; the 29th of February counts as the 28th */
export function olderThanFiveYears(periodEnd: string, today: string) {
	const [year, month, day] = today.split('-').map(Number);
	const back = new Date(Date.UTC(year - 5, month - 1, day));
	if (back.getUTCMonth() !== month - 1) back.setUTCDate(0); // Fachreview 454-2 V-27
	return periodEnd < back.toISOString().slice(0, 10);
}
