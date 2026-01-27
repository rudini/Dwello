import type { SystemConfig, HeatingProfile, DistributionKey, ConfigPageData } from '$lib/types';

export const load = async (): Promise<ConfigPageData> => {
	// Mock heating profiles
	const mockHeatingProfiles: HeatingProfile[] = [
		{
			id: 'hp-standard',
			name: 'Standard',
			type: 'predefined',
			description: 'Gleichmässige Verteilung über Heizperiode (Okt-Apr)',
			isActive: true,
			monthlyPercentages: {
				january: 15,
				february: 13,
				march: 10,
				april: 5,
				may: 0,
				june: 0,
				july: 0,
				august: 0,
				september: 2,
				october: 10,
				november: 15,
				december: 15
			}
		},
		{
			id: 'hp-mittelland',
			name: 'Mittelland',
			type: 'predefined',
			description: 'Optimiert für Schweizer Mittelland',
			isActive: true,
			monthlyPercentages: {
				january: 18,
				february: 15,
				march: 12,
				april: 5,
				may: 0,
				june: 0,
				july: 0,
				august: 0,
				september: 0,
				october: 8,
				november: 12,
				december: 15
			}
		},
		{
			id: 'hp-mountain',
			name: 'Bergregion',
			type: 'predefined',
			description: 'Für höher gelegene Regionen mit längerer Heizperiode',
			isActive: true,
			monthlyPercentages: {
				january: 16,
				february: 14,
				march: 12,
				april: 8,
				may: 3,
				june: 0,
				july: 0,
				august: 0,
				september: 3,
				october: 10,
				november: 14,
				december: 15
			}
		},
		{
			id: 'hp-tessin',
			name: 'Tessin',
			type: 'predefined',
			description: 'Für das milde Klima im Tessin',
			isActive: true,
			monthlyPercentages: {
				january: 20,
				february: 18,
				march: 12,
				april: 3,
				may: 0,
				june: 0,
				july: 0,
				august: 0,
				september: 0,
				october: 5,
				november: 12,
				december: 15
			}
		}
	];

	// Mock distribution keys
	const mockDistributionKeys: DistributionKey[] = [
		{
			id: 'dk-units',
			name: 'Nach Einheiten',
			type: 'predefined',
			description: 'Gleichmässige Verteilung pro Wohnung',
			isActive: true
		},
		{
			id: 'dk-area',
			name: 'Nach Fläche',
			type: 'predefined',
			formula: '{area}',
			description: 'Verteilung nach Wohnfläche in m²',
			isActive: true
		},
		{
			id: 'dk-rooms',
			name: 'Nach Zimmern',
			type: 'predefined',
			formula: '{rooms}',
			description: 'Verteilung nach Zimmeranzahl',
			isActive: true
		},
		{
			id: 'dk-heating',
			name: 'Heizkosten',
			type: 'predefined',
			formula: '{area} * 0.7 + {rooms} * 0.3',
			description: 'Kombination aus Fläche und Zimmern für Heizkosten',
			isActive: true
		}
	];

	// Mock system configuration
	const mockConfig: SystemConfig = {
		id: 'config-001',
		accountingPeriod: 'calendar',
		managementFeePercentage: 2.5,
		defaultHeatingProfileId: 'hp-standard',
		defaultDistributionKeyId: 'dk-area',
		companyName: 'Muster Immobilien AG',
		companyAddress: 'Bahnhofstrasse 1, 8001 Zürich',
		iban: 'CH93 0076 2011 6238 5295 7',
		updatedAt: '2025-01-15T10:30:00Z'
	};

	return {
		config: mockConfig,
		heatingProfiles: mockHeatingProfiles,
		distributionKeys: mockDistributionKeys
	};
};
