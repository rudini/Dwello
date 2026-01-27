import type { DistributionKey } from '$lib/types';

interface DistributionKeysData {
	keys: DistributionKey[];
	total: number;
}

export const load = async (): Promise<DistributionKeysData> => {
	const mockKeys: DistributionKey[] = [
		{
			id: 'dk-units',
			name: 'Nach Einheiten',
			type: 'predefined',
			description: 'Gleichmässige Verteilung pro Wohneinheit',
			isActive: true
		},
		{
			id: 'dk-area',
			name: 'Nach Fläche',
			type: 'predefined',
			formula: '{area}',
			description: 'Verteilung proportional zur Wohnfläche in m²',
			isActive: true
		},
		{
			id: 'dk-rooms',
			name: 'Nach Zimmern',
			type: 'predefined',
			formula: '{rooms}',
			description: 'Verteilung proportional zur Zimmeranzahl',
			isActive: true
		},
		{
			id: 'dk-heating',
			name: 'Heizkosten',
			type: 'predefined',
			formula: '{area} * 0.7 + {rooms} * 0.3',
			description: 'Gewichtete Kombination aus Fläche (70%) und Zimmern (30%)',
			isActive: true
		},
		{
			id: 'dk-water',
			name: 'Wasserverbrauch',
			type: 'predefined',
			formula: '{persons}',
			description: 'Verteilung nach Personenanzahl',
			isActive: true
		},
		{
			id: 'dk-custom-1',
			name: 'Eigener Schlüssel 1',
			type: 'custom',
			formula: '{area} * 0.5 + {rooms} * 0.3 + {persons} * 0.2',
			description: 'Kombination aus Fläche, Zimmern und Personen',
			isActive: true
		}
	];

	return {
		keys: mockKeys,
		total: mockKeys.length
	};
};
