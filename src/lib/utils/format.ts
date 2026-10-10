/**
 * Format Utilities
 * Helper functions for normalizing and formatting values
 */

/**
 * Normalize a decimal string by removing trailing ".0".
 * PostgreSQL decimal columns return values like "3.0" which
 * don't match select option values like "3".
 *
 * Examples:
 *   "3.0" → "3"
 *   "3.5" → "3.5"
 *   "1.0" → "1"
 *   ""    → ""
 */
export function normalizeDecimal(val: string): string {
	const num = parseFloat(val);
	return isNaN(num) ? val : String(num);
}

/** Swiss franc amount, e.g. "CHF 1’800.00" */
export function formatCurrency(amount: number): string {
	// ICU versions differ in the de-CH thousands separator (' or ’); always show the typographic one
	return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' })
		.format(amount)
		.replace(/'/g, '’');
}

/** Date in words, so a wrong pick shows, e.g. "Mittwoch, 1. Januar 2025" */
export function formatDateLong(isoDate: string): string {
	return new Date(isoDate).toLocaleDateString('de-CH', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC' // a YYYY-MM-DD date is midnight UTC
	});
}

/** Swiss date, e.g. "31.12.2024" */
export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('de-CH');
}
