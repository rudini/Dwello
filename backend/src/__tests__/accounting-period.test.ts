/**
 * H-28: the rules of Abrechnungsperioden, decided by the backend (moved from src/lib/accounting-period.ts): the last
 * ended period, the ended periods since a day, and the parts of them a contract has no statement for
 */
import { describe, expect, it } from 'bun:test';
import { endedPeriodsSince, otherPeriod, overlapped, lastCompletedPeriod, missingPeriods } from '../services/accounting-period';

// #211, #1088: one rule for dashboard, contract list, contract page and step 2 of the wizard: each ended whole period
// of the building's Abrechnungsperiode in which the contract has rent days and no statement of its own; a statement
// that overlaps it counts (older statements of another period), there are no short periods (product owner 03.11.2026)
describe('Fehlende Abrechnungen eines Mietvertrags', () => {
	const today = '2026-10-15';
	const statement = (periodStart: string, periodEnd: string, status = 'sent') => ({ periodStart, periodEnd, status });
	const contract = (startDate: string, endDate: string | null, billedUntil: string | null = null) => ({ startDate, endDate, billedUntil });

	it('nennt jede abgelaufene Periode mit Mietstagen ohne Abrechnung, die neueste zuerst', () => {
		expect(missingPeriods('calendar', contract('2024-04-01', null), [], today)).toEqual([
			{ start: '2025-01-01', end: '2025-12-31' },
			{ start: '2024-01-01', end: '2024-12-31' }
		]);
	});

	it('folgt der Abrechnungsperiode des Gebäudes', () => {
		expect(missingPeriods('july-june', contract('2024-04-01', null), [], today)).toEqual([
			{ start: '2025-07-01', end: '2026-06-30' },
			{ start: '2024-07-01', end: '2025-06-30' },
			{ start: '2023-07-01', end: '2024-06-30' }
		]);
	});

	// A-9: the tenant who moved out still gets a statement for his days of the period
	it('nennt die Periode, in der ein Mieter ausgezogen ist', () => {
		expect(missingPeriods('july-june', contract('2023-01-01', '2025-09-30'), [statement('2019-07-01', '2025-06-30')], today)).toEqual([
			{ start: '2025-07-01', end: '2026-06-30' }
		]);
	});

	// #133: the days up to «Abgerechnet bis» were billed outside Dwello
	it('übergeht die Perioden bis «Abgerechnet bis»', () => {
		expect(missingPeriods('calendar', contract('2023-01-01', null, '2024-12-31'), [], today)).toEqual([{ start: '2025-01-01', end: '2025-12-31' }]);
	});

	// #120: a replaced statement no longer bills its days
	it('zählt eine ersetzte Abrechnung nicht', () => {
		expect(missingPeriods('calendar', contract('2025-01-01', '2025-12-31'), [statement('2025-01-01', '2025-12-31', 'replaced')], today)).toEqual([
			{ start: '2025-01-01', end: '2025-12-31' }
		]);
	});
});

describe('Abrechnungsperioden der Einstellung', () => {
	it.each([
		['calendar', '2026-10-02', { start: '2025-01-01', end: '2025-12-31' }],
		['july-june', '2026-10-02', { start: '2025-07-01', end: '2026-06-30' }],
		['july-june', '2026-03-15', { start: '2024-07-01', end: '2025-06-30' }],
		['november-october', '2026-11-05', { start: '2025-11-01', end: '2026-10-31' }],
		['november-october', '2026-10-02', { start: '2024-11-01', end: '2025-10-31' }],
		['calendar', '2028-02-29', { start: '2027-01-01', end: '2027-12-31' }]
	] as const)('nennt bei %s am %s die letzte abgeschlossene Periode', (type, today, period) => {
		expect(lastCompletedPeriod(type, today)).toEqual(period);
	});

	// #142: every ended period with days on or after the day, the newest first
	it('nennt die abgeschlossenen Perioden seit einem Tag, die neueste zuerst', () => {
		const today = '2026-10-15';
		expect(endedPeriodsSince('calendar', '2024-04-01', today)).toEqual([
			{ start: '2025-01-01', end: '2025-12-31' },
			{ start: '2024-01-01', end: '2024-12-31' }
		]);
		expect(endedPeriodsSince('july-june', '2025-06-30', today)).toEqual([
			{ start: '2025-07-01', end: '2026-06-30' },
			{ start: '2024-07-01', end: '2025-06-30' }
		]);
		// from a day in the running period on: none has ended
		expect(endedPeriodsSince('calendar', '2026-02-01', today)).toEqual([]);
	});
});

// A-10, #142, #408 point 2: the contract page's way for each missing part: the period of a statement of the building
// that holds its days, else the whole ended period or a short one; `open` is false where the contract's own statement
// overlaps that period (the run would not bill it there)
// #1088 (Fachreview 1088-2 V-10, code review 1088-1 C-2): a building takes a run only for a whole period of its own
// Abrechnungsperiode, also not for the period of an older statement of another period
describe('Lauf in einer anderen Abrechnungsperiode als der des Gebäudes', () => {
	const run = { start: '2023-07-01', end: '2024-06-30' };

	it('nennt die Abrechnungsperiode des Gebäudes, wenn der Lauf keine ganze Periode davon ist', () => {
		expect(otherPeriod('calendar', run)).toBe('calendar');
	});

	it('nimmt den Lauf nur in einer ganzen Periode des Gebäudes', () => {
		expect(otherPeriod('july-june', run)).toBeNull();
	});
});

// code review 1088-1 C-1: the migration leaves older statements of another period; a whole period that overlaps one of
// them would share an invoice out a second time over the same days (#199)
describe('Lauf, der eine ältere Abrechnung des Gebäudes schneidet', () => {
	const older = { periodStart: '2022-07-01', periodEnd: '2023-06-30' };

	it('nennt die Perioden älterer Abrechnungen, die der Lauf schneidet, ohne gleich zu sein', () => {
		expect(overlapped({ start: '2023-01-01', end: '2023-12-31' }, [older])).toEqual([{ start: '2022-07-01', end: '2023-06-30' }]);
	});

	it('nennt keine Periode, die der Lauf nicht schneidet oder die ihm gleicht', () => {
		expect(overlapped({ start: '2024-01-01', end: '2024-12-31' }, [older])).toEqual([]);
		expect(overlapped({ start: '2022-07-01', end: '2023-06-30' }, [older])).toEqual([]);
	});
});
