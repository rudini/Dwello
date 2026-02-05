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
