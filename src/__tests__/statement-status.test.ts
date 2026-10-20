import { describe, it, expect } from 'vitest';
import { balanceLabel, earlyPaidDate, paidDateError, statusLabels, statusTones } from '../lib/statement';
import { backendMessage } from '../lib/backend-error';
import paidDateRefused from '../../tests/contracts/statement-paid-date-refused.json';

describe('statement status', () => {
	it('labels every status in German with its badge tone', () => {
		expect(statusLabels).toEqual({
			draft: 'Entwurf',
			sent: 'Versendet',
			paid: 'Bezahlt',
			settled: 'Erledigt',
			overdue: 'Überfällig',
			replaced: 'Ersetzt'
		});
		expect(statusTones).toEqual({
			draft: 'neutral',
			sent: 'info',
			paid: 'positive',
			settled: 'neutral', // persona 448: «Erledigt» is no payment, unlike «Bezahlt»
			overdue: 'critical',
			replaced: 'neutral'
		});
	});
});

describe('balanceLabel', () => {
	it('names the balance in words: the tenant pays, gets money back, or nothing is due', () => {
		expect(balanceLabel(120)).toBe('Nachzahlung');
		expect(balanceLabel(-80)).toBe('Rückerstattung');
		expect(balanceLabel(0)).toBe('Ausgeglichen');
	});
});

// #138: das Zahlungsdatum ist ein Tag, den es gibt; #448: frühestens das Ende der Abrechnungsperiode
describe('paidDateError', () => {
	it('lehnt einen Tag ab, den es nicht gibt', () => {
		for (const day of ['2025-02-30', '2025-13-01', '2025-01-32', '2025-00-10'])
			expect(paidDateError(day, '2024-12-31'), day).toBe('Bitte geben Sie das Zahlungsdatum als TT.MM.JJJJ ein.');
	});

	it('lehnt einen Tag vor dem Ende der Abrechnungsperiode ab', () => {
		expect(paidDateError('2024-12-30', '2024-12-31')).toBe(
			'Das Zahlungsdatum liegt vor dem Ende der Abrechnungsperiode am 31.12.2024. Geben Sie frühestens dieses Datum ein.'
		);
	});

	it('nimmt das Ende der Abrechnungsperiode selbst an', () => {
		expect(paidDateError('2024-12-31', '2024-12-31')).toBeNull();
	});
});

// #448 (4): ein Mieter darf vor dem Abrechnungsdatum zahlen, gespeichert wird es nach einer Bestätigung
describe('earlyPaidDate', () => {
	it('fragt bei einem Tag vor dem Abrechnungsdatum nach', () => {
		expect(earlyPaidDate('2025-01-14', '2025-01-15')).toBe(
			'Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom 15.01.2025. Trotzdem speichern?'
		);
	});

	it('fragt ab dem Abrechnungsdatum nicht', () => {
		expect(earlyPaidDate('2025-01-15', '2025-01-15')).toBeNull();
	});
});

describe('Ablehnung des Zahlungsdatums durch das Backend', () => {
	it('nennt das Ende der Abrechnungsperiode als Datum', () => {
		expect(backendMessage(paidDateRefused, '')).toBe(
			'Das Zahlungsdatum liegt vor dem Ende der Abrechnungsperiode am 31.12.2024. Geben Sie frühestens dieses Datum ein.'
		);
	});
});
