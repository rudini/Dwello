import { describe, expect, it } from 'vitest';
import { formatCurrency } from '$lib/utils/format';

// #1126 (Fachreview 1126-2 V-11): «davon tragen Sie» can be negative; ICU de-CH writes «CHF-177.05»
describe('formatCurrency', () => {
	it('setzt bei einem negativen Betrag ein geschütztes Leerzeichen zwischen CHF und das Minus', () => {
		expect(formatCurrency(-177.05)).toBe('CHF\u00a0-177.05');
		expect(formatCurrency(-0.01)).toBe('CHF\u00a0-0.01');
	});

	it('schreibt Tausender mit typografischem Apostroph', () => {
		expect(formatCurrency(1200)).toBe('CHF\u00a01’200.00');
	});
});
