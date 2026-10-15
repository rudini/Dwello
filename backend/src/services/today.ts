import { sql } from 'drizzle-orm';

/** Today's date in Switzerland as YYYY-MM-DD; server and database run in UTC, a day behind until 01:00 or 02:00 */
export const swissToday = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });

/** The YYYY-MM-DD date the given number of days after a YYYY-MM-DD date */
export const daysAfter = (isoDate: string, days: number) =>
	new Date(Date.parse(isoDate) + days * 86_400_000).toISOString().slice(0, 10);

/** Today's Swiss date in SQL instead of current_date, read each time a query is built */
export const sqlToday = { getSQL: () => sql`${swissToday()}::date` };
