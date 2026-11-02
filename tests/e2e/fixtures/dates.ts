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

/**
 * #1036: a change of the Abrechnungsperiode today whose short period still runs, on any day of the year: from the type
 * whose period began last (Kalenderjahr in January to June, Juli – Juni in July to October, November – Oktober in
 * November and December) to another (Juli – Juni from Kalenderjahr, else Kalenderjahr). The short period runs from the
 * first day of the earlier type's running period to the end of the new type's running period
 */
export const runningPeriodChange = () => {
	const [year, month] = inDays(0).split('-').map(Number);
	const from = month >= 11 ? 'november-october' : month >= 7 ? 'july-june' : 'calendar';
	const to = from === 'calendar' ? 'july-june' : 'calendar';
	const short = { start: `${year}-${{ calendar: '01', 'july-june': '07', 'november-october': '11' }[from]}-01`, end: `${year}-${to === 'calendar' ? '12-31' : '06-30'}` };
	return { from, to, short };
};
