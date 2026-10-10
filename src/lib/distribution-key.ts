// Variables the backend formula engine knows (backend/src/services/formula.service.ts)
export const FORMULA_VARIABLES = [
	{ name: 'area', description: 'Wohnfläche in m²' },
	{ name: 'rooms', description: 'Anzahl Zimmer' },
	{ name: 'volume', description: 'Raumvolumen in m³' },
	{ name: 'units', description: '1 für jede Wohnung, alle tragen gleich viel' }
];

// Sums over all apartments of the building, for keys that split in fixed parts (e.g. 70 % by area, 30 % equally)
export const BUILDING_TOTALS = [
	{ name: 'area_total', description: 'Summe der Wohnflächen aller Wohnungen' },
	{ name: 'rooms_total', description: 'Summe der Zimmer aller Wohnungen' },
	{ name: 'volume_total', description: 'Summe der Raumvolumen aller Wohnungen' },
	{ name: 'units_total', description: 'Anzahl Wohnungen im Gebäude' }
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
