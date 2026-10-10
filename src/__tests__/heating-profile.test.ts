import { describe, it, expect } from 'vitest';
import { toHeatingProfile } from '../lib/server/heating-profile';

describe('Heizprofil aus dem Backend', () => {
	it('übernimmt die Monatsanteile als Zahlen', () => {
		const months = [
			'january',
			'february',
			'march',
			'april',
			'may',
			'june',
			'july',
			'august',
			'september',
			'october',
			'november',
			'december'
		];
		const row = Object.fromEntries(months.map((month, i) => [`${month}Pct`, `${i + 1}.50`]));

		const profile = toHeatingProfile({ id: 'hp1', name: 'Mittelland', type: 'predefined', ...row });

		expect(profile.monthlyPercentages.january).toBe(1.5);
		expect(profile.monthlyPercentages.december).toBe(12.5);
		expect(profile).toMatchObject({
			id: 'hp1',
			name: 'Mittelland',
			nameDE: '',
			description: '',
			isActive: true
		});
	});

	it('übernimmt den deutschen Namen', () => {
		const profile = toHeatingProfile({
			id: 'hp1',
			name: 'Heating Mountain',
			nameDE: 'Heizung Bergregion'
		});

		expect(profile.nameDE).toBe('Heizung Bergregion');
	});
});
