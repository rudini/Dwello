import { describe, it, expect } from 'vitest';
import { balanceLabel, statusLabels, statusTones } from '../lib/statement';

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
