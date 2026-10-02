import { describe, expect, it } from 'bun:test';
import { calculateTotalAdvancePayments } from '../services/calculation.service';

const total = (start: string, end: string) =>
	calculateTotalAdvancePayments(150, new Date(`${start}T00:00:00Z`), new Date(`${end}T00:00:00Z`));

describe('Akontobeiträge einer Abrechnungsperiode', () => {
	it('zählt ein volles Jahr als zwölf Monatsbeiträge', () => {
		expect(total('2023-01-01', '2023-12-31')).toBe(1800);
	});

	it('zählt auch ein Schaltjahr als zwölf Monatsbeiträge', () => {
		expect(total('2024-01-01', '2024-12-31')).toBe(1800);
	});

	it('zählt ein Halbjahr als sechs Monatsbeiträge', () => {
		expect(total('2024-01-01', '2024-06-30')).toBe(900);
	});

	it('rechnet einen angebrochenen Monat tagesgenau an', () => {
		expect(total('2024-01-16', '2024-01-31')).toBe(77.42);
	});

	it('rechnet Ein- und Auszug unter dem Jahr pro Kalendermonat ab', () => {
		expect(total('2024-03-16', '2024-09-15')).toBe(902.42);
	});
});
