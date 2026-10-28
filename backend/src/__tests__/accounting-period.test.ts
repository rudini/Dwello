/**
 * H-28: the rules of Abrechnungsperioden, decided by the backend (moved from src/lib/accounting-period.ts): the last
 * ended period, the ended periods since a day, and the parts of them a contract has no statement for
 */
import { describe, expect, it } from 'bun:test';
import { endedPeriodsSince, lastCompletedPeriod, missingPeriods, missingWays } from '../services/accounting-period';

// #199, #211: one rule for dashboard, contract list, contract page and step 2 of the wizard: a statement that overlaps
// an ended Abrechnungsperiode counts, only the days no statement covers are missing, and only where the contract has
// rent days
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

	it('zählt eine Abrechnung, die die Periode überlappt, und nennt nur die Tage ohne Abrechnung', () => {
		// a statement made under July–June before the switch to the calendar year
		expect(missingPeriods('calendar', contract('2023-07-01', '2024-12-31'), [statement('2023-07-01', '2024-06-30')], today)).toEqual([
			{ start: '2024-07-01', end: '2024-12-31' }
		]);
	});

	it('nennt Tage ohne Abrechnung nicht, an denen der Mietvertrag nicht läuft', () => {
		expect(missingPeriods('calendar', contract('2024-04-01', '2024-12-31'), [statement('2024-04-01', '2024-09-30')], today)).toEqual([
			{ start: '2024-10-01', end: '2024-12-31' }
		]);
	});

	it('nennt eine Lücke zwischen zwei Abrechnungen und die Tage danach, die späteren zuerst', () => {
		const statements = [statement('2025-01-01', '2025-03-31'), statement('2025-07-01', '2025-09-30')];
		expect(missingPeriods('calendar', contract('2025-01-01', '2025-12-31'), statements, today)).toEqual([
			{ start: '2025-10-01', end: '2025-12-31' },
			{ start: '2025-04-01', end: '2025-06-30' }
		]);
	});

	it('schweigt, wenn Abrechnungen zusammen jeden Tag der Periode abdecken', () => {
		const statements = [statement('2024-07-01', '2025-06-30'), statement('2025-06-01', '2026-06-30')];
		expect(missingPeriods('calendar', contract('2025-01-01', '2025-12-31'), statements, today)).toEqual([]);
	});

	// A-9: the tenant who moved out still gets a statement for his days of the period
	it('nennt die Periode, in der ein Mieter ausgezogen ist', () => {
		expect(missingPeriods('july-june', contract('2023-01-01', '2025-09-30'), [statement('2019-07-01', '2025-06-30')], today)).toEqual([
			{ start: '2025-07-01', end: '2026-06-30' }
		]);
	});

	// #133: the days up to «Abgerechnet bis» were billed outside Dwello
	it('übergeht die Tage bis «Abgerechnet bis»', () => {
		expect(missingPeriods('calendar', contract('2023-01-01', null, '2024-12-31'), [], today)).toEqual([{ start: '2025-01-01', end: '2025-12-31' }]);
	});

	// #120: a replaced statement no longer bills its days
	it('zählt eine ersetzte Abrechnung nicht', () => {
		expect(missingPeriods('calendar', contract('2025-01-01', '2025-12-31'), [statement('2025-01-01', '2025-12-31', 'replaced')], today)).toEqual([
			{ start: '2025-01-01', end: '2025-12-31' }
		]);
	});

	// #512: before the building's last statement over a period of another type than the setting, its type cuts the periods
	it('folgt bis zur letzten Abrechnung nach einer anderen Abrechnungsperiode deren Perioden, danach der Einstellung', () => {
		expect(missingPeriods('calendar', contract('2022-07-01', null), [statement('2023-07-01', '2024-06-30')], today)).toEqual([
			{ start: '2025-01-01', end: '2025-12-31' },
			{ start: '2024-07-01', end: '2024-12-31' },
			{ start: '2022-07-01', end: '2023-06-30' }
		]);
	});

	it('folgt den Abrechnungen des Gebäudes, auch wenn der Mietvertrag selbst keine hat', () => {
		const building = [statement('2023-07-01', '2024-06-30')];
		expect(missingPeriods('calendar', contract('2023-07-01', '2024-06-30'), [], today, building)).toEqual([
			{ start: '2023-07-01', end: '2024-06-30' }
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

	it('führt jede ganze abgelaufene Periode ohne Abrechnung in diese Periode', () => {
		expect(missingWays('calendar', contract('2023-04-01'), [own('2024-01-01', '2024-12-31')], [own('2024-01-01', '2024-12-31')], today)).toEqual([
			whole(2025),
			whole(2023)
		]);
	});

	const part = (start: string, end: string, kind: string, way = { start, end }, open = true) => ({ start, end, way: { kind, ...way }, open });
	const days = (parts: { start: string; end: string }[]) => parts.map(({ start, end }) => [start, end]);

	// #120, Fachreview W2e: a replaced statement does not count as a statement of the period
	it('nennt die Periode einer ersetzten Abrechnung ohne berichtigte', () => {
		const replaced = own('2025-01-01', '2025-12-31', 'replaced');
		expect(missingWays('calendar', contract('2025-03-01'), [replaced], [replaced], today)).toEqual([whole(2025)]);
	});

	// #199, #408 point 2: an overlapping statement counts; the days no statement of the building covers get a short period
	it('bietet für die Tage, die keine Abrechnung des Gebäudes abdeckt, eine kurze Abrechnungsperiode an', () => {
		const overlapping = own('2024-07-01', '2025-06-30');
		expect(missingWays('calendar', contract('2025-01-01'), [overlapping], [overlapping], today)).toEqual([part('2025-07-01', '2025-12-31', 'short')]);
	});

	// #408 point 2: days inside the period of another contract's statement are billed in exactly that period
	it('bietet für Tage in der Periode einer Abrechnung des Gebäudes genau diese Periode an', () => {
		expect(missingWays('calendar', contract('2025-01-01'), [], [own('2024-07-01', '2025-06-30')], today)).toEqual([
			part('2025-07-01', '2025-12-31', 'short'),
			part('2025-01-01', '2025-06-30', 'existing', { start: '2024-07-01', end: '2025-06-30' })
		]);
	});

	// code review 199-1 C-2: days in a period equal to a statement period of the building go there only
	it('nennt bei überschneidenden Altdaten dieselben Tage nur einmal', () => {
		expect(missingWays('calendar', contract('2025-01-01'), [], [own('2024-07-01', '2025-06-30'), own('2025-01-01', '2025-12-31')], today)).toEqual([whole(2025)]);
	});

	// code review 199-3 C-12: another contract's replaced statement still holds its period for the building (C-8)
	it('führt Tage in der Periode einer ersetzten Abrechnung des Gebäudes in diese Periode', () => {
		expect(missingWays('calendar', contract('2025-01-01'), [], [own('2024-07-01', '2025-06-30', 'replaced')], today)).toEqual([
			part('2025-07-01', '2025-12-31', 'short'),
			part('2025-01-01', '2025-06-30', 'existing', { start: '2024-07-01', end: '2025-06-30' })
		]);
	});

	// code review 199-2 C-9: two older periods with one first day: the longer one, so no missing day is lost
	it('nennt bei zwei Altperioden mit gleichem Beginn die Tage der längeren', () => {
		const parts = missingWays('calendar', contract('2025-01-01'), [], [own('2025-01-01', '2025-03-31'), own('2025-01-01', '2025-06-30')], today);
		expect(days(parts)).toEqual([
			['2025-07-01', '2025-12-31'],
			['2025-01-01', '2025-06-30']
		]);
	});

	// a part names the contract's own days: from the Vertragsbeginn, not from the start of the period
	it('nennt bei einem Teil die Tage ab Vertragsbeginn', () => {
		const parts = missingWays('calendar', contract('2025-04-01'), [], [own('2024-07-01', '2025-06-30')], today);
		expect(days(parts)).toEqual([
			['2025-07-01', '2025-12-31'],
			['2025-04-01', '2025-06-30']
		]);
	});

	// Fachreview 199-1 V-1: a run of a period the contract cuts with its own statement would bill it no more there
	it('führt nicht in eine Periode, die der Mietvertrag mit einer eigenen Abrechnung schneidet', () => {
		const mine = own('2025-01-01', '2025-06-30');
		const parts = missingWays('calendar', contract('2025-01-01'), [mine], [mine, own('2025-01-01', '2025-12-31')], today);
		expect(parts.map(({ start, open }) => [start, open])).toEqual([['2025-07-01', false]]);
	});

	// #512: an ended period of the earlier type without a statement is offered whole; the days after the switch are a
	// short period of the setting, where the hint of #486 belongs
	it('bietet vor dem Wechsel der Abrechnungsperiode die ganze frühere Periode an, danach eine kurze Abrechnungsperiode', () => {
		const mine = own('2024-07-01', '2025-06-30');
		expect(missingWays('calendar', contract('2024-04-01'), [mine], [mine], today)).toEqual([
			part('2025-07-01', '2025-12-31', 'short'),
			part('2023-07-01', '2024-06-30', 'whole')
		]);
	});

	// Fachreview 512-1 V-1: a contract billed by its own period (#486) after the first statement under the setting is no
	// change of the setting; the other contracts keep the setting's periods (kept behaviour)
	it('folgt der Einstellung, wenn die andere Abrechnungsperiode erst nach der ersten Abrechnung nach der Einstellung beginnt', () => {
		const building = [own('2023-01-01', '2023-12-31'), own('2024-01-01', '2024-12-31'), own('2023-07-01', '2024-06-30'), own('2024-07-01', '2025-06-30')];
		expect(missingWays('calendar', contract('2024-04-01'), [], building, today)).toEqual([
			part('2025-07-01', '2025-12-31', 'short'),
			part('2025-01-01', '2025-06-30', 'existing', { start: '2024-07-01', end: '2025-06-30' }),
			whole(2024)
		]);
	});

	it('schweigt für Perioden vor dem Vertragsbeginn und wenn jede ihre Abrechnung hat', () => {
		const statement = own('2025-01-01', '2025-12-31');
		expect(missingWays('calendar', contract('2025-03-01'), [statement], [statement], today)).toEqual([]);
	});
});

