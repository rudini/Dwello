/**
 * «Gültig ab» the contract form proposes for a new Akonto (#464, fach review 464-2 V-2; #815): in a running contract the
 * next first of a month, a future contract corrects it from its Vertragsbeginn, an ended one its last amount
 */

import { describe, expect, it } from 'bun:test';
import { proposedAdvanceFrom } from '../services/advance-payment.service';

const advances = [
	{ validFrom: '2024-04-01', amount: '50.00' },
	{ validFrom: '2024-07-01', amount: '80.00' }
];
const today = '2026-10-10';

describe('«Gültig ab» eines neuen Akontos', () => {
	it('schlägt im laufenden Mietvertrag den nächsten Ersten vor', () => {
		expect(proposedAdvanceFrom({ startDate: '2024-04-01', endDate: null }, advances, today)).toBe('2026-11-01');
		expect(proposedAdvanceFrom({ startDate: '2024-04-01', endDate: '2026-11-01' }, advances, today)).toBe('2026-11-01');
		expect(proposedAdvanceFrom({ startDate: '2024-04-01', endDate: null }, advances, '2026-12-31')).toBe('2027-01-01');
	});

	it('schlägt beim künftigen Mietvertrag den Vertragsbeginn, beim beendeten den Tag des letzten Betrags vor', () => {
		expect(proposedAdvanceFrom({ startDate: '2099-01-01', endDate: null }, advances, today)).toBe('2099-01-01');
		expect(proposedAdvanceFrom({ startDate: '2024-04-01', endDate: '2025-03-31' }, advances, today)).toBe('2024-07-01');
		// ends before the next first: no month left to change it in
		expect(proposedAdvanceFrom({ startDate: '2024-04-01', endDate: '2026-10-31' }, advances, today)).toBe('2024-07-01');
	});
});
