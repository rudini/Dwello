// Variables the backend formula engine knows (backend/src/services/formula.service.ts)
export const FORMULA_VARIABLES = [
	{ name: 'area', description: 'Wohnfläche in m²' },
	{ name: 'rooms', description: 'Anzahl Zimmer' },
	{ name: 'volume', description: 'Raumvolumen in m³' },
	{ name: 'units', description: '1 für jede Wohnung, alle tragen gleich viel' }
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
