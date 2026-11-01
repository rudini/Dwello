import { describe, expect, it } from 'vitest';
import { recalculatedText, type Recalculated } from '$lib/statement';

// #546 (Fachreview 546-1 V-1, V-3, V-4): the hint names the Saldo the recalculation gives, in the words of its kind
const now = (balance: string, belowMinimum = false): Recalculated => ({
	balance,
	difference: '0.00',
	belowMinimum,
	declineCosts: null
});

describe('Neu berechneter Saldo im Hinweis zum Berichtigen', () => {
	it('nennt eine Nachzahlung statt einer Rückerstattung', () => {
		expect(recalculatedText('Ruth Weber', -34.6, now('162.00'))).toBe(
			'Neu berechnet ergibt sich für Ruth Weber eine Nachzahlung von CHF 162.00 statt einer Rückerstattung von CHF 34.60.'
		);
	});

	it('nennt einen ausgeglichenen Saldo statt einer Nachzahlung', () => {
		expect(recalculatedText('Ruth Weber', 80, now('0.00'))).toBe(
			'Neu berechnet ergibt sich für Ruth Weber ein ausgeglichener Saldo statt einer Nachzahlung von CHF 80.00.'
		);
	});

	it('sagt, dass der Saldo gleich bleibt, wenn sich nur eine Position ändert', () => {
		expect(recalculatedText('Ruth Weber', 120, now('120.00'))).toBe(
			'Neu berechnet bleibt der Saldo für Ruth Weber gleich, aber eine Position ändert sich.'
		);
	});

	it('erklärt einen neuen Saldo unter CHF 5', () => {
		expect(recalculatedText('Ruth Weber', 2, now('3.00', true))).toBe(
			'Neu berechnet ergibt sich für Ruth Weber eine Nachzahlung von CHF 3.00 statt CHF 2.00. Ein Saldo unter CHF 5.00 wird weder eingefordert noch ausbezahlt, sondern mit der nächsten Abrechnung verrechnet.'
		);
	});
});
