import { getLocale } from '$lib/paraglide/runtime';

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

/** Date in words, so a wrong pick shows, e.g. "Mittwoch, 1. Januar 2025"; the words follow the UI language */
export function formatDateLong(isoDate: string, { weekday = true } = {}): string {
	return new Date(isoDate).toLocaleDateString(`${getLocale()}-CH`, {
		weekday: weekday ? 'long' : undefined,
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC' // a YYYY-MM-DD date is midnight UTC
	});
}

/** Swiss date, e.g. "01.10.2024", whatever the browser's locale and time zone */
export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('de-CH', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		// a YYYY-MM-DD date is midnight UTC; a point in time shows its day in Switzerland
		timeZone: dateString.length === 10 ? 'UTC' : 'Europe/Zurich'
	});
}

/** Point in time in Switzerland, e.g. "16.03.2024, 10:05" */
export function formatDateTime(isoTimestamp: string): string {
	return new Date(isoTimestamp).toLocaleString('de-CH', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Europe/Zurich'
	});
}

/** Time of day in Switzerland, e.g. "10:05" */
export const formatTime = (at: Date) =>
	at.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich' });

/** A percentage as typed: «2,5» or «2.5», at most two decimals as stored and printed; anything else is NaN */
export const parsePercent = (text: string) => {
	const rate = text.trim().replace(/\s*%$/, ''); // «4 %» as written in the contract
	return /^\d+([.,]\d{1,2})?$/.test(rate) ? Number(rate.replace(',', '.')) : NaN;
};

// 3 % is the usual guideline of the Verwaltungspauschale (glossary), not a limit; source (#60): Mieterverband leaflet
// 2026 «2026_merkblatt_unzulaessige_nebenkosten.pdf», at most 3 % usual (cantonal decisions, BWO 32 Nr. 12)
export const USUAL_MAXIMUM = 3;

/** A rate of the Verwaltungspauschale from 0 to 10 % (#124: the cap also catches a typo such as 30 for 3) */
export const isFeeRate = (rate: number) => Number.isFinite(rate) && rate >= 0 && rate <= 10;
