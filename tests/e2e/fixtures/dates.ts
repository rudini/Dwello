/** A day relative to today as YYYY-MM-DD, the Swiss day as the app counts it; calendar days, so a DST switch in between does not shift it */
export const inDays = (days: number) => {
	const day = new Date(new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' }));
	day.setUTCDate(day.getUTCDate() + days);
	return day.toISOString().slice(0, 10);
};
