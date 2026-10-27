import { describe, expect, it } from 'vitest';
import { dayAfter, parseSwissDate } from '$lib/swiss-date';
import { formatDate, formatDateTime } from '$lib/utils/format';

describe('Datum als TT.MM.JJJJ eingeben', () => {
	it.each([
		['31.12.2024', '2024-12-31'],
		['1.1.2025', '2025-01-01'],
		['01012025', '2025-01-01'],
		[' 29.02.2024 ', '2024-02-29'],
		['31.12.24', '2024-12-31'],
		['01.04.99', '1999-04-01'], // ein alter Mietvertrag, nicht 2099
		['2024-12-31', '2024-12-31']
	])('liest %s als %s', (text, iso) => {
		expect(parseSwissDate(text)).toBe(iso);
	});

	it.each(['30.02.2025', '29.02.2025', '32.01.2025', '15.13.2025', '31/12/2024', 'morgen', '1.1.', '01.01.0024', '31.12.9999'])(
		'lehnt %s als Datum ab',
		(text) => {
			expect(parseSwissDate(text)).toBeNull();
		}
	);
});

describe('Datum anzeigen', () => {
	it('zeigt ein Datum immer als TT.MM.JJJJ mit führenden Nullen, wie im PDF', () => {
		expect(formatDate('2024-10-01')).toBe('01.10.2024');
	});

	it('zeigt einen Zeitpunkt mit dem Schweizer Datum', () => {
		expect(formatDate('2024-12-31T23:30:00Z')).toBe('01.01.2025');
	});
});

describe('Zeitpunkt anzeigen', () => {
	it('zeigt Datum und Uhrzeit in der Schweiz, ohne Sekunden', () => {
		expect(formatDateTime('2024-03-16T09:05:00Z')).toBe('16.03.2024, 10:05');
	});
});

// the day after a Vertragsende or a period (#711), also from a timestamp the backend sends
describe('Tag danach', () => {
	it.each([
		['2024-12-31', '2025-01-01'],
		['2024-02-28', '2024-02-29'],
		['2025-02-28', '2025-03-01'],
		['2025-03-30', '2025-03-31'], // Umstellung auf Sommerzeit: kein Tag fehlt
		['2025-06-30T00:00:00.000Z', '2025-07-01']
	])('%s → %s', (date, next) => {
		expect(dayAfter(date)).toBe(next);
	});
});
