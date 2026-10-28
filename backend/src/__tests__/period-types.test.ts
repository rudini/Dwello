/**
 * #512: the change of the setting «Abrechnungsperiode» the settings store when it is saved with another type
 */
import { describe, expect, it } from 'bun:test';
import { changeOnSave } from '../services/period-types';

describe('Gespeicherter Wechsel der Abrechnungsperiode', () => {
	it('speichert den Tag und die bisherige Abrechnungsperiode beim ersten Wechsel', () => {
		expect(changeOnSave('calendar', undefined, '2026-10-28')).toBe('2026-10-28:calendar');
	});

	// code review 512-3 C-5: a setting that ended no period of its own keeps the first change, its day included
	it('behält Tag und Abrechnungsperiode des ersten Wechsels, wenn die Zwischeneinstellung keine Periode beendete', () => {
		expect(changeOnSave('july-june', '2026-10-28:calendar', '2027-03-01')).toBe('2026-10-28:calendar');
	});

	it('speichert einen neuen Wechsel, wenn die Zwischeneinstellung eine Periode beendete', () => {
		expect(changeOnSave('july-june', '2026-10-28:calendar', '2027-07-02')).toBe('2027-07-02:july-june');
	});
});
