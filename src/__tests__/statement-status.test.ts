import { describe, it, expect } from 'vitest';
import { balanceLabel, paidDateError, statusLabels, statusTones } from '../lib/statement';
import { backendMessage } from '../lib/backend-error';
import paidDateRefused from '../../tests/contracts/statement-paid-date-refused.json';

describe('statement status', () => {
	it('labels every status in German with its badge tone', () => {
		expect(statusLabels).toEqual({
			draft: 'Entwurf',
			sent: 'Versendet',
			paid: 'Bezahlt',
			overdue: 'Überfällig'
		});
		expect(statusTones).toEqual({
			draft: 'neutral',
			sent: 'info',
			paid: 'positive',
			overdue: 'critical'
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

// #138: das Zahlungsdatum ist ein Tag, den es gibt, frühestens das Abrechnungsdatum
describe('paidDateError', () => {
	it('lehnt einen Tag ab, den es nicht gibt', () => {
		expect(paidDateError('2025-02-30', '2025-01-15')).toBe('Bitte geben Sie das Zahlungsdatum als TT.MM.JJJJ ein.');
	});

	it('lehnt einen Tag vor dem Abrechnungsdatum ab', () => {
		expect(paidDateError('2025-01-14', '2025-01-15')).toBe(
			'Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom 15.01.2025. Geben Sie frühestens dieses Datum ein.'
		);
	});

	it('nimmt das Abrechnungsdatum selbst an', () => {
		expect(paidDateError('2025-01-15', '2025-01-15')).toBeNull();
	});
});

describe('Ablehnung des Zahlungsdatums durch das Backend', () => {
	it('nennt das Abrechnungsdatum als Datum', () => {
		expect(backendMessage(paidDateRefused, '')).toBe(
			'Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom 05.01.2026. Geben Sie frühestens dieses Datum ein.'
		);
	});
});
