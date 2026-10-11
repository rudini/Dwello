import { describe, it, expect, vi } from 'vitest';
import { contractEndError, contractPeriod, contractStatusOn, localToday, statusBadges } from '../lib/contract-status';

const today = '2026-10-10';

describe('Vertragsstatus', () => {
	it.each([
		['2024-04-01', null, 'active'],
		['2024-04-01', '2026-10-10', 'active'], // the last day still counts, as in the backend's filter
		['2024-04-01', '2026-10-09', 'ended'],
		['2026-10-10', null, 'active'],
		['2026-10-11', null, 'future'],
		['2099-11-01', '2100-10-31', 'future']
	])('ein Mietvertrag von %s bis %s ist %s', (start, end, status) => {
		expect(contractStatusOn(start, end, today)).toBe(status);
	});

	it('nennt den Status mit den Worten des Glossars', () => {
		expect(Object.values(statusBadges).map((b) => b.label)).toEqual([
			'Laufend',
			'Künftig',
			'Beendet'
		]);
	});
});

// Beenden auf den Tag, auf den der Mieter gekündigt hat: heute oder später, nie vor dem Vertragsbeginn
describe('Vertragsende beim Beenden', () => {
	it('nimmt heute und spätere Tage an', () => {
		expect(contractEndError('2026-10-10', '2024-04-01', today)).toBeNull();
		expect(contractEndError('2027-03-31', '2024-04-01', today)).toBeNull();
	});

	it('verlangt ein Datum als Tag', () => {
		for (const wrong of ['', '31.03.2027', '2027-3-31'])
			expect(contractEndError(wrong, '2024-04-01', today)).toBe(
				'Bitte geben Sie das Vertragsende ein, zum Beispiel 31.03.2027.'
			);
	});

	it('lehnt einen Tag vor heute ab und sagt, wo ein früheres Ende hingehört', () => {
		expect(contractEndError('2026-10-09', '2024-04-01', today)).toBe(
			'Das Vertragsende kann nicht vor heute liegen. Ein früheres Vertragsende tragen Sie unter «Bearbeiten» ein.'
		);
	});

	it('lehnt bei einem künftigen Mietvertrag einen Tag vor dem Vertragsbeginn ab', () => {
		expect(contractEndError('2099-10-31', '2099-11-01', today)).toBe(
			'Das Vertragsende kann nicht vor dem Vertragsbeginn am 01.11.2099 liegen.'
		);
	});
});

describe('Vertragsdauer in Worten', () => {
	it('nennt bei einem künftigen Mietvertrag den Vertragsbeginn, nicht «heute»', () => {
		expect(contractPeriod('2099-11-01', null, 'future')).toBe('ab 01.11.2099, unbefristet');
	});

	it('nennt bei einem laufenden unbefristeten Mietvertrag seinen Beginn', () => {
		expect(contractPeriod('2024-04-01', null, 'active')).toBe('seit 01.04.2024, unbefristet');
	});

	it('nennt bei einem befristeten Mietvertrag Beginn und Ende', () => {
		expect(contractPeriod('2024-01-01', '2024-12-31', 'ended')).toBe('01.01.2024 – 31.12.2024');
	});
});

// Der Server läuft in UTC: um 00:30 Schweizer Zeit ist dort noch gestern
describe('Heute', () => {
	it('ist der Tag in der Schweiz, auch auf einem Server in UTC', () => {
		vi.useFakeTimers({ now: new Date('2026-10-11T22:30:00Z') });
		expect(localToday()).toBe('2026-10-12');
		vi.useRealTimers();
	});
});
