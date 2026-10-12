import { m } from '$lib/paraglide/messages';

// Variables the backend formula engine knows (backend/src/services/formula.service.ts), described in the UI language
export const FORMULA_VARIABLES = [
	{ name: 'area', description: m.keys_var_area },
	{ name: 'rooms', description: m.keys_var_rooms },
	{ name: 'volume', description: m.keys_var_volume },
	{ name: 'units', description: m.keys_var_units }
];

// Sums over all apartments of the building, for keys that split in fixed parts (e.g. 70 % by area, 30 % equally)
export const BUILDING_TOTALS = [
	{ name: 'area_total', description: m.keys_total_area },
	{ name: 'rooms_total', description: m.keys_total_rooms },
	{ name: 'volume_total', description: m.keys_total_volume },
	{ name: 'units_total', description: m.keys_total_units }
];

export type DistributionKeyRow = {
	id: string;
	name: string;
	nameFR?: string | null;
	nameIT?: string | null;
	nameEN?: string | null;
	type: 'predefined' | 'custom';
	formula: string;
	description: string;
	usageCount: number;
};

export type FormulaTest = { errors: string[]; results: { apartment: string; share: string }[] };
