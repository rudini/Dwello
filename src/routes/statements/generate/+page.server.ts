import type { Building, Category, DistributionKey, HeatingProfile } from '$lib/types';

interface GenerateStatementData {
	buildings: (Building & { apartmentCount: number })[];
	categories: Category[];
	distributionKeys: DistributionKey[];
	heatingProfiles: HeatingProfile[];
	defaultPeriod: {
		start: string;
		end: string;
	};
}

export const load = async (): Promise<GenerateStatementData> => {
	// Mock buildings with apartment counts
	const buildings = [
		{
			id: 'building-001',
			name: 'Musterhaus Zentrum',
			address: 'Musterstraße 12',
			postalCode: '8000',
			city: 'Zürich',
			apartmentCount: 12
		},
		{
			id: 'building-002',
			name: 'Seepark Residenz',
			address: 'Seestrasse 45',
			postalCode: '6004',
			city: 'Luzern',
			apartmentCount: 8
		},
		{
			id: 'building-003',
			name: 'Alpenblick',
			address: 'Bergweg 7',
			postalCode: '3800',
			city: 'Interlaken',
			apartmentCount: 6
		}
	];

	const categories: Category[] = [
		{ id: 'cat-001', name: 'Heizung', isAllowedUtilityCost: true, sortOrder: 1 },
		{ id: 'cat-002', name: 'Warmwasser', isAllowedUtilityCost: true, sortOrder: 2 },
		{ id: 'cat-003', name: 'Wasser/Abwasser', isAllowedUtilityCost: true, sortOrder: 3 },
		{ id: 'cat-004', name: 'Allgemeinstrom', isAllowedUtilityCost: true, sortOrder: 4 },
		{ id: 'cat-005', name: 'Hauswart', isAllowedUtilityCost: true, sortOrder: 5 },
		{ id: 'cat-006', name: 'Gartenpflege', isAllowedUtilityCost: true, sortOrder: 6 },
		{ id: 'cat-007', name: 'Kehricht', isAllowedUtilityCost: true, sortOrder: 7 }
	];

	const distributionKeys: DistributionKey[] = [
		{ id: 'dk-heating', name: 'Heizkosten', type: 'predefined', isActive: true },
		{ id: 'dk-units', name: 'Nach Einheiten', type: 'predefined', isActive: true },
		{ id: 'dk-area', name: 'Nach Fläche', type: 'predefined', isActive: true },
		{ id: 'dk-persons', name: 'Nach Personen', type: 'predefined', isActive: true }
	];

	const heatingProfiles: HeatingProfile[] = [
		{
			id: 'hp-standard',
			name: 'Standard',
			type: 'predefined',
			description: 'Standardverteilung für die Schweiz',
			isActive: true,
			monthlyPercentages: {
				january: 15,
				february: 13,
				march: 11,
				april: 8,
				may: 3,
				june: 0,
				july: 0,
				august: 0,
				september: 3,
				october: 9,
				november: 13,
				december: 15
			}
		},
		{
			id: 'hp-mittelland',
			name: 'Mittelland',
			type: 'predefined',
			description: 'Optimiert für das Schweizer Mittelland',
			isActive: true,
			monthlyPercentages: {
				january: 16,
				february: 14,
				march: 12,
				april: 7,
				may: 2,
				june: 0,
				july: 0,
				august: 0,
				september: 2,
				october: 8,
				november: 12,
				december: 15
			}
		}
	];

	// Default to previous calendar year
	const currentYear = new Date().getFullYear();
	const defaultPeriod = {
		start: `${currentYear - 1}-01-01`,
		end: `${currentYear - 1}-12-31`
	};

	return {
		buildings,
		categories,
		distributionKeys,
		heatingProfiles,
		defaultPeriod
	};
};
