/** Dates typed as TT.MM.JJJJ, whatever the browser's locale; stored as YYYY-MM-DD */

/** "31.12.2024", "1.1.2025", "31.12.24", "31122024" or pasted "2024-12-31" → "2024-12-31"; null if it is no real date */
export function parseSwissDate(text: string): string | null {
	const trimmed = text.trim();
	const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	const parts = iso
		? [iso[3], iso[2], iso[1]]
		: (
				trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4}|\d{2})$/) ??
				trimmed.match(/^(\d{2})(\d{2})(\d{4})$/)
			)?.slice(1);
	if (!parts) return null;
	const [day, month] = parts.map(Number);
	const year = Number(parts[2].length === 2 ? `20${parts[2]}` : parts[2]); // 31.12.24 is 2024
	if (year < 1900) return null; // Date.UTC would read 0024 as 1924
	const date = new Date(Date.UTC(year, month - 1, day));
	// Date.UTC rolls 30.02. over into March: only a date that stays the same is real
	if (date.getUTCDate() !== day || date.getUTCMonth() !== month - 1) return null;
	return date.toISOString().slice(0, 10);
}
