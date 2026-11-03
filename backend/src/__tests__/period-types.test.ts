/**
 * #1088: each building has its own Abrechnungsperiode; a run's period fits a building when it is a whole period of the
 * building's type (no short periods), and the wizard proposes the last ended period of the type most buildings have
 */
import { describe, expect, it } from 'bun:test';
import { commonType, fitsType } from '../services/period-types';

describe('Abrechnungsperiode eines Gebäudes im Lauf', () => {
	it('passt, wenn der Lauf die ganze Periode des Gebäudes ist', () => {
		expect(fitsType('july-june', { start: '2023-07-01', end: '2024-06-30' })).toBe(true);
	});

	// Fachreview 1088-1: keine kurzen Abrechnungsperioden (product owner 03.11.2026)
	it('passt nicht, wenn der Lauf kürzer ist als eine Periode des Gebäudes', () => {
		expect(fitsType('calendar', { start: '2024-10-01', end: '2024-12-31' })).toBe(false);
	});

	it('passt nicht, wenn der Lauf über das Ende einer Periode des Gebäudes reicht', () => {
		expect(fitsType('july-june', { start: '2024-01-01', end: '2024-12-31' })).toBe(false);
	});
});

describe('Vorgeschlagene Abrechnungsperiode', () => {
	it('nimmt die Abrechnungsperiode, die die meisten Gebäude haben', () => {
		expect(commonType(['calendar', 'july-june', 'july-june'], '2026-11-03')).toBe('july-june');
	});

	// Fachreview 1088-1 V-5: am 03.11.2026 endete November – Oktober zuletzt (31.10.2026)
	it('nimmt bei gleich vielen Gebäuden die zuletzt beendete und ohne Gebäude das Kalenderjahr', () => {
		expect(commonType(['july-june', 'november-october'], '2026-11-03')).toBe('november-october');
		expect(commonType([], '2026-11-03')).toBe('calendar');
	});
});
