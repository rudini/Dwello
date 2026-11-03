/**
 * H-28: the rules of Abrechnungsperioden, decided by the backend (moved from src/lib/accounting-period.ts): the last
 * ended period, the ended periods since a day, and the parts of them a contract has no statement for
 */
import { describe, expect, it } from 'bun:test';
import { endedPeriodsSince, otherPeriod, lastCompletedPeriod, missingPeriods, missingWays } from '../services/accounting-period';

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

	it('zählt eine Abrechnung, die die Periode überlappt, und nennt für die übrigen Tage keine kurze Periode', () => {
		// an older statement of July–June in a building that bills the calendar year
		expect(missingPeriods('calendar', contract('2023-07-01', '2024-12-31'), [statement('2023-07-01', '2024-06-30')], today)).toEqual([]);
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
describe('Wege der fehlenden Abrechnungen am Mietvertrag', () => {
	const today = '2026-10-15';
	const own = (periodStart: string, periodEnd: string, status = 'sent') => ({ periodStart, periodEnd, status });
	const contract = (startDate: string) => ({ startDate, endDate: null, billedUntil: null });
	const whole = (y: number) => ({ start: `${y}-01-01`, end: `${y}-12-31`, way: { kind: 'whole', start: `${y}-01-01`, end: `${y}-12-31` }, open: true });
	const part = (start: string, end: string, kind: string, way = { start, end }, open = true) => ({ start, end, way: { kind, ...way }, open });

	it('führt jede ganze abgelaufene Periode ohne Abrechnung in diese Periode', () => {
		expect(missingWays('calendar', contract('2023-04-01'), [own('2024-01-01', '2024-12-31')], [own('2024-01-01', '2024-12-31')], today)).toEqual([
			whole(2025),
			whole(2023)
		]);
	});

	// #120, Fachreview W2e: a replaced statement does not count as a statement of the period
	it('nennt die Periode einer ersetzten Abrechnung ohne berichtigte', () => {
		const replaced = own('2025-01-01', '2025-12-31', 'replaced');
		expect(missingWays('calendar', contract('2025-03-01'), [replaced], [replaced], today)).toEqual([whole(2025)]);
	});

	// #1088 (Fachreview 1088-1 V-1): a period that overlaps older statements of the building in another period goes to
	// those periods, each with the contract's days there; no short period for the rest
	it('führt in die Perioden älterer Abrechnungen des Gebäudes, die die Periode schneiden', () => {
		expect(missingWays('calendar', contract('2025-04-01'), [], [own('2024-07-01', '2025-06-30'), own('2025-07-01', '2026-06-30')], today)).toEqual([
			part('2025-07-01', '2026-06-30', 'existing'),
			part('2025-04-01', '2025-06-30', 'existing', { start: '2024-07-01', end: '2025-06-30' })
		]);
	});

	// code review 199-1 C-2: days in a period equal to a statement period of the building go there only
	it('führt eine Periode gleich einer Abrechnung des Gebäudes nur in diese Periode', () => {
		expect(missingWays('calendar', contract('2025-01-01'), [], [own('2024-07-01', '2025-06-30'), own('2025-01-01', '2025-12-31')], today)).toEqual([whole(2025)]);
	});

	// Fachreview 199-1 V-1: a run of a period the contract cuts with its own statement would bill it no more there
	it('führt nicht in eine Periode, die der Mietvertrag mit einer eigenen Abrechnung schneidet', () => {
		const mine = own('2025-01-01', '2025-06-30');
		const parts = missingWays('calendar', contract('2024-01-01'), [mine], [mine, own('2024-07-01', '2025-06-30')], today);
		expect(parts.map(({ start, open }) => [start, open])).toEqual([['2024-07-01', false]]);
	});

	it('schweigt für Perioden vor dem Vertragsbeginn und wenn jede ihre Abrechnung hat', () => {
		const statement = own('2025-01-01', '2025-12-31');
		expect(missingWays('calendar', contract('2025-03-01'), [statement], [statement], today)).toEqual([]);
	});
});

// #1088 (Fachreview 1088-1 V-1): a building takes a run only for a whole period of its own Abrechnungsperiode or for
// the period of one of its statements (older ones of another period stay billable)
describe('Lauf in einer anderen Abrechnungsperiode als der des Gebäudes', () => {
	const run = { start: '2023-07-01', end: '2024-06-30' };

	it('nennt die Abrechnungsperiode des Gebäudes, wenn der Lauf keine ganze Periode davon ist', () => {
		expect(otherPeriod('calendar', run, [])).toBe('calendar');
	});

	it('nimmt den Lauf in einer ganzen Periode des Gebäudes oder der Periode einer seiner Abrechnungen', () => {
		expect(otherPeriod('july-june', run, [])).toBeNull();
		expect(otherPeriod('calendar', run, [{ periodStart: '2023-07-01', periodEnd: '2024-06-30' }])).toBeNull();
	});
});
