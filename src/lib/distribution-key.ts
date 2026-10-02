// Variables the backend formula engine knows (backend/src/services/formula.service.ts)
export const FORMULA_VARIABLES = [
	{ name: 'area', description: 'Wohnfläche in m²', icon: 'square_foot' },
	{ name: 'rooms', description: 'Anzahl Zimmer', icon: 'meeting_room' },
	{ name: 'volume', description: 'Raumvolumen in m³', icon: 'view_in_ar' },
	{ name: 'units', description: 'Einheit (immer 1)', icon: 'home' }
];

export type DistributionKeyRow = {
	id: string;
	name: string;
	type: 'predefined' | 'custom';
	formula: string;
	description: string;
	usageCount: number;
};

export type FormulaTest = { errors: string[]; results: { apartment: string; share: string }[] };
