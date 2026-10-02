/**
 * Distribution Key Service
 * Business logic for distribution key operations
 */

import { eq, sql, asc, ilike, and } from 'drizzle-orm';
import { db } from '../db/connection';
import { distributionKeys, type DistributionKey, type NewDistributionKey } from '../db/schema';
import {
	validateFormulaForDistribution,
	calculateDistribution,
	type FormulaVariables
} from './formula.service';

export interface DistributionKeyFilters {
	search?: string;
	type?: 'predefined' | 'custom';
	limit?: number;
	offset?: number;
}

export interface DistributionKeyWithUsage extends DistributionKey {
	invoiceCount: number;
}

/**
 * Predefined distribution keys (initialized at first run)
 */
export const PREDEFINED_DISTRIBUTION_KEYS: Omit<NewDistributionKey, 'id' | 'createdAt' | 'updatedAt'>[] = [
	{
		name: 'Per Unit',
		nameDE: 'Pro Einheit',
		nameFR: 'Par unité',
		nameIT: 'Per unità',
		nameEN: 'Per Unit',
		type: 'predefined',
		formula: '{units}',
		description: 'Gleichmässige Verteilung auf alle Wohnungen (1 Anteil pro Einheit)',
		sortOrder: 1
	},
	{
		name: 'Per Area',
		nameDE: 'Nach Fläche',
		nameFR: 'Par surface',
		nameIT: 'Per superficie',
		nameEN: 'Per Area',
		type: 'predefined',
		formula: '{area}',
		description: 'Verteilung nach Wohnfläche in Quadratmetern',
		sortOrder: 2
	},
	{
		name: 'Per Rooms',
		nameDE: 'Nach Zimmerzahl',
		nameFR: 'Par nombre de pièces',
		nameIT: 'Per numero di stanze',
		nameEN: 'Per Rooms',
		type: 'predefined',
		formula: '{rooms}',
		description: 'Verteilung nach Anzahl Zimmer',
		sortOrder: 3
	},
	{
		name: 'Heating Costs (Area)',
		nameDE: 'Heizkosten (nach Fläche)',
		nameFR: 'Frais de chauffage (surface)',
		nameIT: 'Costi riscaldamento (superficie)',
		nameEN: 'Heating Costs (Area)',
		type: 'predefined',
		formula: '{area}',
		description: 'Standard-Verteilschlüssel für Heizkosten basierend auf Wohnfläche',
		sortOrder: 4
	},
	{
		name: 'Hot Water (Per Unit)',
		nameDE: 'Warmwasser (pro Einheit)',
		nameFR: 'Eau chaude (par unité)',
		nameIT: 'Acqua calda (per unità)',
		nameEN: 'Hot Water (Per Unit)',
		type: 'predefined',
		formula: '{units}',
		description: 'Warmwasserkosten gleichmässig verteilt',
		sortOrder: 5
	}
];

/**
 * List all distribution keys with optional filters
 */
export async function listDistributionKeys(filters: DistributionKeyFilters = {}): Promise<{
	distributionKeys: DistributionKeyWithUsage[];
	total: number;
}> {
	const { search, type, limit = 100, offset = 0 } = filters;

	// Build where conditions
	const conditions = [];

	if (search) {
		conditions.push(ilike(distributionKeys.name, `%${search}%`));
	}

	if (type) {
		conditions.push(eq(distributionKeys.type, type));
	}

	// Get distribution keys with usage stats
	const keysQuery = db
		.select({
			id: distributionKeys.id,
			name: distributionKeys.name,
			nameDE: distributionKeys.nameDE,
			nameFR: distributionKeys.nameFR,
			nameIT: distributionKeys.nameIT,
			nameEN: distributionKeys.nameEN,
			type: distributionKeys.type,
			formula: distributionKeys.formula,
			description: distributionKeys.description,
			sortOrder: distributionKeys.sortOrder,
			createdAt: distributionKeys.createdAt,
			updatedAt: distributionKeys.updatedAt,
			invoiceCount: sql<number>`(SELECT COUNT(*) FROM invoices WHERE invoices.distribution_key_id = "distribution_keys"."id")`.as(
				'invoice_count'
			)
		})
		.from(distributionKeys)
		.orderBy(asc(distributionKeys.sortOrder), asc(distributionKeys.name))
		.limit(limit)
		.offset(offset);

	// Apply conditions if any
	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	const results = whereClause
		? await keysQuery.where(whereClause)
		: await keysQuery;

	// Get total count
	const countQuery = db.select({ count: sql<number>`count(*)` }).from(distributionKeys);

	const [{ count: total }] = whereClause
		? await countQuery.where(whereClause)
		: await countQuery;

	return {
		distributionKeys: results as DistributionKeyWithUsage[],
		total: Number(total)
	};
}

/**
 * Get a single distribution key by ID
 */
export async function getDistributionKey(id: string): Promise<DistributionKeyWithUsage | null> {
	const [key] = await db
		.select({
			id: distributionKeys.id,
			name: distributionKeys.name,
			nameDE: distributionKeys.nameDE,
			nameFR: distributionKeys.nameFR,
			nameIT: distributionKeys.nameIT,
			nameEN: distributionKeys.nameEN,
			type: distributionKeys.type,
			formula: distributionKeys.formula,
			description: distributionKeys.description,
			sortOrder: distributionKeys.sortOrder,
			createdAt: distributionKeys.createdAt,
			updatedAt: distributionKeys.updatedAt,
			invoiceCount: sql<number>`(SELECT COUNT(*) FROM invoices WHERE invoices.distribution_key_id = "distribution_keys"."id")`.as(
				'invoice_count'
			)
		})
		.from(distributionKeys)
		.where(eq(distributionKeys.id, id))
		.limit(1);

	return (key as DistributionKeyWithUsage) || null;
}

/**
 * Get distribution key by name (for lookups)
 */
export async function getDistributionKeyByName(name: string): Promise<DistributionKey | null> {
	const [key] = await db
		.select()
		.from(distributionKeys)
		.where(ilike(distributionKeys.name, name))
		.limit(1);

	return key || null;
}

/**
 * Create a new distribution key
 */
export async function createDistributionKey(data: NewDistributionKey): Promise<DistributionKey> {
	// Check for duplicate name
	const existing = await getDistributionKeyByName(data.name);
	if (existing) {
		throw new Error(`Distribution key with name "${data.name}" already exists`);
	}

	// Validate formula if provided (required for custom keys)
	if (data.type === 'custom' && !data.formula) {
		throw new Error('Custom distribution keys require a formula');
	}

	if (data.formula) {
		const validation = validateFormulaForDistribution(data.formula);
		if (!validation.isValid) {
			throw new Error(`Invalid formula: ${validation.errors.join('; ')}`);
		}
	}

	const [key] = await db.insert(distributionKeys).values(data).returning();
	return key;
}

/**
 * Update an existing distribution key
 */
export async function updateDistributionKey(
	id: string,
	data: Partial<NewDistributionKey>
): Promise<DistributionKey | null> {
	// Check if key exists
	const existing = await getDistributionKey(id);
	if (!existing) {
		return null;
	}

	// Don't allow changing predefined keys to custom or vice versa
	if (data.type && data.type !== existing.type) {
		throw new Error('Cannot change distribution key type');
	}

	// Don't allow modifying predefined formulas
	if (existing.type === 'predefined' && data.formula && data.formula !== existing.formula) {
		throw new Error('Cannot modify formula of predefined distribution key');
	}

	// Check for duplicate name if name is being changed
	if (data.name && data.name !== existing.name) {
		const duplicate = await getDistributionKeyByName(data.name);
		if (duplicate && duplicate.id !== id) {
			throw new Error(`Distribution key with name "${data.name}" already exists`);
		}
	}

	// Validate formula if being changed
	if (data.formula && data.formula !== existing.formula) {
		const validation = validateFormulaForDistribution(data.formula);
		if (!validation.isValid) {
			throw new Error(`Invalid formula: ${validation.errors.join('; ')}`);
		}
	}

	const [key] = await db
		.update(distributionKeys)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(distributionKeys.id, id))
		.returning();

	return key || null;
}

/**
 * Delete a distribution key
 * Returns false if key is used by invoices
 */
export async function deleteDistributionKey(id: string): Promise<{ success: boolean; error?: string }> {
	// Check if key exists
	const existing = await getDistributionKey(id);
	if (!existing) {
		return { success: false, error: 'Distribution key not found' };
	}

	// Don't allow deleting predefined keys
	if (existing.type === 'predefined') {
		return { success: false, error: 'Cannot delete predefined distribution key' };
	}

	// Check for invoices using this key
	if (Number(existing.invoiceCount) > 0) {
		return {
			success: false,
			error: `Cannot delete distribution key used by ${existing.invoiceCount} invoices. Reassign invoices first.`
		};
	}

	await db.delete(distributionKeys).where(eq(distributionKeys.id, id));

	return { success: true };
}

/**
 * Check if a distribution key exists
 */
export async function distributionKeyExists(id: string): Promise<boolean> {
	const [result] = await db
		.select({ id: distributionKeys.id })
		.from(distributionKeys)
		.where(eq(distributionKeys.id, id))
		.limit(1);

	return !!result;
}

/**
 * Test a formula with sample apartment data
 */
export function testFormulaWithSamples(formula: string): {
	isValid: boolean;
	results: Array<{
		apartment: { area: number; rooms: number };
		value: number;
		share: string;
	}>;
	totalValue: number;
	errors: string[];
} {
	const validation = validateFormulaForDistribution(formula);
	if (!validation.isValid) {
		return {
			isValid: false,
			results: [],
			totalValue: 0,
			errors: validation.errors
		};
	}

	// Sample apartments for testing
	const sampleApartments: FormulaVariables[] = [
		{ area: 50, rooms: 2, units: 1 },
		{ area: 75, rooms: 3, units: 1 },
		{ area: 100, rooms: 4, units: 1 },
		{ area: 120, rooms: 5, units: 1 }
	];

	const distribution = calculateDistribution(formula, sampleApartments, 10000);

	if (!distribution.isValid) {
		return {
			isValid: false,
			results: [],
			totalValue: 0,
			errors: [distribution.error || 'Unknown error']
		};
	}

	const totalValue = distribution.distributions.reduce(
		(sum, d) => sum + (d.amount / d.share) * d.share,
		0
	);

	return {
		isValid: true,
		results: distribution.distributions.map((d) => ({
			apartment: { area: d.variables.area, rooms: d.variables.rooms },
			value: d.amount,
			share: `${(d.share * 100).toFixed(2)}%`
		})),
		totalValue,
		errors: []
	};
}

/**
 * Calculate distribution for apartments in a building
 */
export async function calculateBuildingDistribution(
	distributionKeyId: string,
	apartments: Array<{ id: string; area: number; rooms: number }>,
	totalAmount: number
): Promise<{
	isValid: boolean;
	distributions: Array<{
		apartmentId: string;
		share: number;
		amount: number;
	}>;
	error?: string;
}> {
	const key = await getDistributionKey(distributionKeyId);
	if (!key) {
		return { isValid: false, distributions: [], error: 'Distribution key not found' };
	}

	if (!key.formula) {
		return { isValid: false, distributions: [], error: 'Distribution key has no formula' };
	}

	// Map apartments to formula variables
	const aptVariables: FormulaVariables[] = apartments.map((apt) => ({
		area: apt.area,
		rooms: apt.rooms,
		units: 1,
		volume: apt.area * 2.5 // Estimate ceiling height
	}));

	const result = calculateDistribution(key.formula, aptVariables, totalAmount);

	if (!result.isValid) {
		return { isValid: false, distributions: [], error: result.error };
	}

	return {
		isValid: true,
		distributions: result.distributions.map((d, i) => ({
			apartmentId: apartments[i].id,
			share: d.share,
			amount: d.amount
		}))
	};
}

/**
 * Initialize predefined distribution keys if they don't exist
 */
export async function initializePredefinedKeys(): Promise<{ created: number; existing: number }> {
	let created = 0;
	let existing = 0;

	for (const keyData of PREDEFINED_DISTRIBUTION_KEYS) {
		const exists = await getDistributionKeyByName(keyData.name);
		if (!exists) {
			await db.insert(distributionKeys).values(keyData);
			created++;
		} else {
			existing++;
		}
	}

	return { created, existing };
}
