/** A day relative to today as YYYY-MM-DD, the Swiss day as the app counts it; calendar days, so a DST switch in between does not shift it */
export const inDays = (days: number) => {
	const day = new Date(new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' }));
	day.setUTCDate(day.getUTCDate() + days);
	return day.toISOString().slice(0, 10);
};

/** A YYYY-MM-DD date as the app shows it: DD.MM.YYYY */
export const swissDate = (iso: string) => iso.split('-').reverse().join('.');

/** The year of the invoices and statements «des laufenden Jahres» (dated today) */
export const thisYear = () => Number(inDays(0).slice(0, 4));

const FIRST_MONTH = { calendar: 1, 'july-june': 7, 'november-october': 11 } as const;
type PeriodType = keyof typeof FIRST_MONTH;
// the types by the first day of their running period, the latest first: Kalenderjahr in January to June, Juli – Juni in
// July to October, November – Oktober in November and December
const byLatestStart = () => {
	const [year, month] = inDays(0).split('-').map(Number);
	const startOf = (type: PeriodType) => {
		const first = FIRST_MONTH[type];
		return `${first <= month ? year : year - 1}-${String(first).padStart(2, '0')}-01`;
	};
	return (Object.keys(FIRST_MONTH) as PeriodType[]).map((type) => ({ type, start: startOf(type) })).sort((a, b) => b.start.localeCompare(a.start));
};
const dayAfter = (iso: string, days = 1) => new Date(Date.parse(iso) + days * 86_400_000).toISOString().slice(0, 10);
const endOfPeriod = (type: PeriodType, start: string) => {
	const year = Number(start.slice(0, 4)) + (FIRST_MONTH[type] > Number(start.slice(5, 7)) ? 0 : 1);
	return dayAfter(`${year}-${String(FIRST_MONTH[type]).padStart(2, '0')}-01`, -1);
};

/**
 * #1036: a change of the Abrechnungsperiode today, on any day of the year. The short period runs from the first day of
 * the earlier type's running period (the switch day) to the day before the new type's next period begins.
 * Running: from the type whose period began last to another (the new type's running period holds the switch day, so
 * the short period still runs). Started (Fachreview 1036-1 V-1): to the type whose period began last from another
 * (its running period began after the switch day, so the short period has ended and the new one has begun)
 */
export const runningPeriodChange = () => {
	const [latest, other] = byLatestStart();
	const short = { start: latest.start, end: endOfPeriod(other.type, latest.start) };
	return { from: latest.type, to: other.type, short, start: dayAfter(short.end) };
};
export const startedPeriodChange = () => {
	const [latest, other] = byLatestStart();
	return { from: other.type, to: latest.type, short: { start: other.start, end: dayAfter(latest.start, -1) }, start: latest.start };
};
