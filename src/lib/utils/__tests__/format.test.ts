import { describe, it, expect } from 'vitest';
import { normalizeDecimal } from '../format';

describe('normalizeDecimal', () => {
	it('strips trailing .0 from whole numbers', () => {
		expect(normalizeDecimal('3.0')).toBe('3');
		expect(normalizeDecimal('1.0')).toBe('1');
		expect(normalizeDecimal('6.0')).toBe('6');
	});

	it('preserves fractional values', () => {
		expect(normalizeDecimal('3.5')).toBe('3.5');
		expect(normalizeDecimal('1.5')).toBe('1.5');
		expect(normalizeDecimal('4.5')).toBe('4.5');
		expect(normalizeDecimal('2.5')).toBe('2.5');
	});

	it('handles values that are already normalized', () => {
		expect(normalizeDecimal('3')).toBe('3');
		expect(normalizeDecimal('1')).toBe('1');
	});

	it('returns empty string unchanged', () => {
		expect(normalizeDecimal('')).toBe('');
	});

	it('returns non-numeric strings unchanged', () => {
		expect(normalizeDecimal('abc')).toBe('abc');
		expect(normalizeDecimal('N/A')).toBe('N/A');
	});

	it('handles PostgreSQL decimal format with extra trailing zeros', () => {
		expect(normalizeDecimal('3.00')).toBe('3');
		expect(normalizeDecimal('3.50')).toBe('3.5');
		expect(normalizeDecimal('72.00')).toBe('72');
	});

	it('handles all common room count values from DB', () => {
		// These are the values the room select options expect
		const expectedOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5'];
		// These are the values PostgreSQL decimal(3,1) returns
		const dbValues = ['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5'];

		dbValues.forEach((dbVal, i) => {
			expect(normalizeDecimal(dbVal)).toBe(expectedOptions[i]);
		});
	});
});
