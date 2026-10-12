import { afterEach, describe, it, expect } from 'vitest';
import { baseLocale, overwriteGetLocale, type Locale } from '$lib/paraglide/runtime';
import { formatCurrency, formatDate, formatDateLong } from '../format';

const inLanguage = (locale: Locale) => overwriteGetLocale(() => locale);
afterEach(() => inLanguage(baseLocale));

describe('Daten in der gewählten Sprache', () => {
	it.each([
		['de', 'Mittwoch, 1. Januar 2025'],
		['fr', 'mercredi, 1 janvier 2025'],
		['it', 'mercoledì, 1 gennaio 2025'],
		['en', 'Wednesday, 1 January 2025']
	] as const)('nennt Wochentag und Monat auf %s', (locale, words) => {
		inLanguage(locale);
		expect(formatDateLong('2025-01-01')).toBe(words);
	});

	it.each(['fr', 'it', 'en'] as const)('schreibt Zahlen und Beträge auf %s schweizerisch', (locale) => {
		inLanguage(locale);
		expect(formatDate('2025-01-01')).toBe('01.01.2025');
		expect(formatCurrency(1800).replace(/\s/g, ' ')).toBe('CHF 1’800.00');
	});
});
