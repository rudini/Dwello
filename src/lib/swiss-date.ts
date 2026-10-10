/** Dates typed as TT.MM.JJJJ, whatever the browser's locale; stored as YYYY-MM-DD */

/** "31.12.2024", "1.1.2025" or "31122024" → "2024-12-31"; null if it is no real date */
export function parseSwissDate(text: string): string | null {
	const parts = text.trim().match(/^(\d{1,2})[.,/](\d{1,2})[.,/](\d{4})$/) ?? text.trim().match(/^(\d{2})(\d{2})(\d{4})$/);
	if (!parts) return null;
	const [day, month, year] = parts.slice(1).map(Number);
	if (year < 1900) return null; // Date.UTC would read 0024 as 1924
	const date = new Date(Date.UTC(year, month - 1, day));
	// Date.UTC rolls 30.02. over into March: only a date that stays the same is real
	if (date.getUTCDate() !== day || date.getUTCMonth() !== month - 1) return null;
	return date.toISOString().slice(0, 10);
}
