import { describe, it, expect } from 'vitest';
import { balanceClass, statusLabels, statusVariants } from '../lib/statement';

describe('statement status', () => {
	it('labels every status in German with its badge colour', () => {
		expect(statusLabels).toEqual({ draft: 'Entwurf', sent: 'Versendet', paid: 'Bezahlt', overdue: 'Überfällig' });
		expect(statusVariants).toEqual({ draft: 'default', sent: 'info', paid: 'success', overdue: 'danger' });
	});
});

describe('balanceClass', () => {
	it('shows additional payments red, refunds green and a settled balance grey', () => {
		expect(balanceClass(120)).toBe('text-red-600');
		expect(balanceClass(-80)).toBe('text-green-600');
		expect(balanceClass(0)).toBe('text-gray-600');
	});
});
