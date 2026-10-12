import { describe, it, expect, vi } from 'vitest';
import {
	contractEndError,
	contractEnd,
	contractPeriod,
	contractStatusOn,
	endedSince,
	localToday,
	pastEndConfirmation,
	billedDaysError,
	statusBadges
} from '../lib/contract-status';

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

// Beenden auf den Kündigungstermin: auch nachträglich, nie vor dem Vertragsbeginn
describe('Vertragsende beim Beenden', () => {
	it('nimmt heute, spätere und frühere Tage an', () => {
		expect(contractEndError('2026-10-10', '2024-04-01', today)).toBeNull();
		expect(contractEndError('2027-03-31', '2024-04-01', today)).toBeNull();
		expect(contractEndError('2025-03-31', '2024-04-01', today)).toBeNull();
	});

	it('verlangt ein Datum als Tag', () => {
		for (const wrong of ['', '31.03.2027', '2027-3-31', '2025-13-01', '2025-02-30'])
			expect(contractEndError(wrong, '2024-04-01', today)).toBe(
				'Bitte geben Sie das Vertragsende ein, zum Beispiel 31.12.2026.'
			);
	});

	it('lehnt bei einem künftigen Mietvertrag einen Tag vor dem Vertragsbeginn ab', () => {
		expect(contractEndError('2099-10-31', '2099-11-01', today)).toBe(
			'Das Vertragsende kann nicht vor dem Vertragsbeginn am 01.11.2099 liegen.'
		);
	});
});

// ein nachträglich erfasster Kündigungstermin: die Folge wird bestätigt, ein Tippfehler im Jahr fällt auf
describe('Vergangenes Vertragsende', () => {
	it('verlangt eine Bestätigung mit dem Tag, an dem der Mietvertrag endete', () => {
		expect(pastEndConfirmation('2025-03-31', today)).toBe(
			'Bitte bestätigen Sie, dass der Mietvertrag am 31.03.2025 endete, oder korrigieren Sie das Vertragsende.'
		);
		expect(pastEndConfirmation('2024-12-31', today)).toContain('am 31.12.2024 endete');
	});

	it('nennt den Tag nach dem Vertragsende auch über Monats-, Jahres- und Schaltjahresende', () => {
		expect(endedSince('2024-02-28')).toBe('29.02.2024');
		expect(endedSince('2024-02-29')).toBe('01.03.2024');
		expect(endedSince('2025-02-28')).toBe('01.03.2025');
		expect(endedSince('2025-12-31')).toBe('01.01.2026');
	});

	it('verlangt für heute und spätere Tage keine Bestätigung', () => {
		expect(pastEndConfirmation('2026-10-10', today)).toBeNull();
		expect(pastEndConfirmation('2027-03-31', today)).toBeNull();
		expect(pastEndConfirmation('', today)).toBeNull();
	});
});

// eine gespeicherte Abrechnung wurde mit den bisherigen Vertragsdaten berechnet: neue Daten änderten ihre Mietstage
describe('Vertragsdaten, die die Mietstage einer Abrechnung ändern', () => {
	const of = (statementNumber: string, status = 'draft') => ({ statementNumber, status });

	it('sagt bei einem Entwurf, dass er zuerst gelöscht und danach neu erstellt wird', () => {
		expect(billedDaysError([of('NK-2025-0003')])).toBe(
			'Die Nebenkostenabrechnung NK-2025-0003 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen.'
		);
	});

	it('nennt mehrere Entwürfe in der Mehrzahl', () => {
		expect(billedDaysError([of('NK-2024-0002'), of('NK-2025-0003')])).toBe(
			'Die Nebenkostenabrechnungen NK-2024-0002 und NK-2025-0003 (Entwürfe) wurden mit den bisherigen Vertragsdaten berechnet. Löschen Sie zuerst die Entwürfe und erstellen Sie die Nebenkostenabrechnungen danach neu.'
		);
	});

	// eine versendete oder bezahlte Abrechnung ändert Dwello nicht: der Weg führt über den Mieter
	it('nennt versendete und bezahlte Abrechnungen, die betroffenen Entwürfe und was zu tun ist', () => {
		expect(
			billedDaysError([of('NK-2025-0003'), of('NK-2024-0003', 'paid'), of('NK-2023-0001', 'sent')])
		).toBe(
			'Die Nebenkostenabrechnungen NK-2024-0003 (bezahlt) und NK-2023-0001 (versendet) wurden mit den bisherigen Vertragsdaten berechnet. Dwello ändert sie nicht, darum lässt sich das Datum nicht speichern. Prüfen Sie das Datum. Stimmt es, klären Sie die Korrektur der Abrechnung direkt mit dem Mieter. Betroffen ist auch der Entwurf NK-2025-0003.'
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
		expect(contractPeriod('2024-01-01', '2024-12-31', 'ended')).toBe(
			'01.01.2024 – 31.12.2024, befristet'
		);
	});

	// A-1: ein gekündigter Mietvertrag war unbefristet, er ist nicht befristet
	it('nennt bei einem gekündigten Mietvertrag die Kündigung', () => {
		expect(contractPeriod('2024-04-01', '2099-03-31', 'active', true)).toBe(
			'01.04.2024 – 31.03.2099, gekündigt'
		);
	});
});

describe('Vertragsende', () => {
	it.each([
		[null, false, 'Unbefristet'],
		['2099-12-31', false, 'Befristet bis 31.12.2099'],
		['2099-03-31', true, 'Unbefristet, gekündigt auf den 31.03.2099']
	])('%s, gekündigt %s: «%s»', (endDate, terminated, text) => {
		expect(contractEnd(endDate, terminated)).toBe(text);
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
