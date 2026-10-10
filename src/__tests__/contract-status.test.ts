import { describe, it, expect } from 'vitest';
import { contractPeriod, contractStatusOn, statusBadges } from '../lib/contract-status';

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

describe('Vertragsdauer in Worten', () => {
	it('nennt bei einem künftigen Mietvertrag den Vertragsbeginn, nicht «heute»', () => {
		expect(contractPeriod('2099-11-01', null, 'future')).toBe('ab 1.11.2099, unbefristet');
	});

	it('nennt bei einem laufenden unbefristeten Mietvertrag seinen Beginn', () => {
		expect(contractPeriod('2024-04-01', null, 'active')).toBe('seit 1.4.2024, unbefristet');
	});

	it('nennt bei einem befristeten Mietvertrag Beginn und Ende', () => {
		expect(contractPeriod('2024-01-01', '2024-12-31', 'ended')).toBe('1.1.2024 – 31.12.2024');
	});
});
