import type { Category } from '$lib/types';

interface CategoryWithUsage extends Category {
	usageCount: number;
}

interface CategoriesListData {
	categories: CategoryWithUsage[];
	total: number;
}

export const load = async (): Promise<CategoriesListData> => {
	// Mock categories data
	const mockCategories: CategoryWithUsage[] = [
		{
			id: 'cat-001',
			name: 'Heizung',
			nameDE: 'Heizung',
			nameFR: 'Chauffage',
			nameIT: 'Riscaldamento',
			nameEN: 'Heating',
			isAllowedUtilityCost: true,
			description: 'Heizkosten inkl. Brennstoff und Wartung',
			sortOrder: 1,
			usageCount: 45
		},
		{
			id: 'cat-002',
			name: 'Warmwasser',
			nameDE: 'Warmwasser',
			nameFR: 'Eau chaude',
			nameIT: 'Acqua calda',
			nameEN: 'Hot water',
			isAllowedUtilityCost: true,
			description: 'Warmwasseraufbereitung',
			sortOrder: 2,
			usageCount: 32
		},
		{
			id: 'cat-003',
			name: 'Wasser/Abwasser',
			nameDE: 'Wasser/Abwasser',
			nameFR: 'Eau/Eaux usées',
			nameIT: 'Acqua/Acque reflue',
			nameEN: 'Water/Sewage',
			isAllowedUtilityCost: true,
			description: 'Kaltwasser und Abwasserentsorgung',
			sortOrder: 3,
			usageCount: 28
		},
		{
			id: 'cat-004',
			name: 'Allgemeinstrom',
			nameDE: 'Allgemeinstrom',
			nameFR: 'Électricité commune',
			nameIT: 'Elettricità comune',
			nameEN: 'Common electricity',
			isAllowedUtilityCost: true,
			description: 'Strom für Gemeinschaftsflächen',
			sortOrder: 4,
			usageCount: 24
		},
		{
			id: 'cat-005',
			name: 'Hauswart',
			nameDE: 'Hauswart',
			nameFR: 'Concierge',
			nameIT: 'Custode',
			nameEN: 'Caretaker',
			isAllowedUtilityCost: true,
			description: 'Hauswartung und Reinigung',
			sortOrder: 5,
			usageCount: 18
		},
		{
			id: 'cat-006',
			name: 'Aufzug',
			nameDE: 'Aufzug',
			nameFR: 'Ascenseur',
			nameIT: 'Ascensore',
			nameEN: 'Elevator',
			isAllowedUtilityCost: true,
			description: 'Liftbetrieb und -wartung',
			sortOrder: 6,
			usageCount: 12
		},
		{
			id: 'cat-007',
			name: 'Gartenpflege',
			nameDE: 'Gartenpflege',
			nameFR: 'Entretien du jardin',
			nameIT: 'Manutenzione del giardino',
			nameEN: 'Garden maintenance',
			isAllowedUtilityCost: true,
			description: 'Grünanlagenpflege',
			sortOrder: 7,
			usageCount: 8
		},
		{
			id: 'cat-008',
			name: 'Kehricht',
			nameDE: 'Kehricht',
			nameFR: 'Ordures',
			nameIT: 'Rifiuti',
			nameEN: 'Waste',
			isAllowedUtilityCost: true,
			description: 'Abfallentsorgung und Recycling',
			sortOrder: 8,
			usageCount: 15
		},
		{
			id: 'cat-009',
			name: 'Reparaturen',
			nameDE: 'Reparaturen',
			nameFR: 'Réparations',
			nameIT: 'Riparazioni',
			nameEN: 'Repairs',
			isAllowedUtilityCost: false,
			description: 'Instandhaltungsarbeiten (nicht umlagefähig)',
			sortOrder: 9,
			usageCount: 22
		},
		{
			id: 'cat-010',
			name: 'Versicherung',
			nameDE: 'Versicherung',
			nameFR: 'Assurance',
			nameIT: 'Assicurazione',
			nameEN: 'Insurance',
			isAllowedUtilityCost: false,
			description: 'Gebäudeversicherungen (nicht umlagefähig)',
			sortOrder: 10,
			usageCount: 6
		},
		{
			id: 'cat-011',
			name: 'Steuern',
			nameDE: 'Steuern',
			nameFR: 'Impôts',
			nameIT: 'Imposte',
			nameEN: 'Taxes',
			isAllowedUtilityCost: false,
			description: 'Grundstücksteuern (nicht umlagefähig)',
			sortOrder: 11,
			usageCount: 4
		},
		{
			id: 'cat-012',
			name: 'Verwaltungskosten',
			nameDE: 'Verwaltungskosten',
			nameFR: 'Frais de gestion',
			nameIT: 'Costi di gestione',
			nameEN: 'Management costs',
			isAllowedUtilityCost: true,
			description: 'Verwaltungsgebühren (max. 3%)',
			sortOrder: 12,
			usageCount: 10
		}
	];

	return {
		categories: mockCategories,
		total: mockCategories.length
	};
};
