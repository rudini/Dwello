/** A day relative to today as YYYY-MM-DD, the Swiss day as the app counts it */
export const inDays = (days: number) =>
	new Date(Date.now() + days * 86_400_000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
