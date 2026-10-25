/**
 * The hint on the Verjährung when a statement to correct is older than five years (PO 2026-10-20, Fachreview 454-1 E-5)
 */

import { describe, expect, it } from 'bun:test';
import { olderThanFiveYears } from '../services/today';

describe('Abrechnungsperiode vor mehr als fünf Jahren', () => {
	it('nennt eine Periode, die vor mehr als fünf Jahren endete', () => {
		expect(olderThanFiveYears('2021-10-09', '2026-10-10')).toBe(true);
		expect(olderThanFiveYears('2021-10-10', '2026-10-10')).toBe(false);
	});

	// Fachreview 454-2 V-27: five calendar years back from the Swiss day, the 29th of February to the 28th
	it('rechnet die fünf Jahre nach dem Kalender', () => {
		expect(olderThanFiveYears('2023-02-27', '2028-02-29')).toBe(true);
		expect(olderThanFiveYears('2023-02-28', '2028-02-29')).toBe(false);
	});
});
