import { describe, expect, it } from 'vitest';
import { missingPeriods } from '../lib/accounting-period';

// #199, #211: one rule for dashboard, contract list, contract page and step 2 of the wizard: a statement that overlaps
// an ended Abrechnungsperiode counts, only the days no statement covers are missing, and only where the contract has
// rent days
describe('Fehlende Abrechnungen eines Mietvertrags', () => {
	const today = new Date('2026-10-15T12:00:00');
	const statement = (periodStart: string, periodEnd: string) => ({ periodStart, periodEnd });

	it('nennt jede abgelaufene Periode mit Mietstagen ohne Abrechnung, die neueste zuerst', () => {
		const contract = { startDate: '2024-04-01', endDate: null };
		expect(missingPeriods('calendar', contract, [], today)).toEqual([
			{ start: '2025-01-01', end: '2025-12-31' },
			{ start: '2024-01-01', end: '2024-12-31' }
		]);
	});

	it('zählt eine Abrechnung, die die Periode überlappt, und nennt nur die Tage ohne Abrechnung', () => {
		// a statement made under July–June before the switch to the calendar year
		const contract = { startDate: '2023-07-01', endDate: '2024-12-31' };
		expect(
			missingPeriods('calendar', contract, [statement('2023-07-01', '2024-06-30')], today)
		).toEqual([{ start: '2024-07-01', end: '2024-12-31' }]);
	});

	it('nennt Tage ohne Abrechnung nicht, an denen der Mietvertrag nicht läuft', () => {
		const contract = { startDate: '2024-04-01', endDate: '2024-12-31' };
		expect(
			missingPeriods('calendar', contract, [statement('2024-04-01', '2024-09-30')], today)
		).toEqual([{ start: '2024-10-01', end: '2024-12-31' }]);
	});

	it('nennt eine Lücke zwischen zwei Abrechnungen und die Tage danach, die späteren zuerst', () => {
		const contract = { startDate: '2025-01-01', endDate: '2025-12-31' };
		const statements = [
			statement('2025-01-01', '2025-03-31'),
			statement('2025-07-01', '2025-09-30')
		];
		expect(missingPeriods('calendar', contract, statements, today)).toEqual([
			{ start: '2025-10-01', end: '2025-12-31' },
			{ start: '2025-04-01', end: '2025-06-30' }
		]);
	});

	it('schweigt, wenn Abrechnungen zusammen jeden Tag der Periode abdecken', () => {
		const contract = { startDate: '2025-01-01', endDate: '2025-12-31' };
		const statements = [
			statement('2024-07-01', '2025-06-30'),
			statement('2025-06-01', '2026-06-30')
		];
		expect(missingPeriods('calendar', contract, statements, today)).toEqual([]);
	});
});
