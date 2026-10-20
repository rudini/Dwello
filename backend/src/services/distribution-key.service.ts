/**
 * Distribution Key Service
 * Business logic for distribution key operations
 */

import { eq, sql, asc, ilike, and, or } from 'drizzle-orm';
import { db } from '../db/connection';
import { distributionKeys, type DistributionKey, type NewDistributionKey } from '../db/schema';
import {
	validateFormulaForDistribution,
	calculateDistribution,
	type FormulaVariables
} from './formula.service';
import { CodedError, refusal, type ErrorCode, type Refusal } from './coded-error';
import { Conflict } from './conflict';
import { isDefaultSetting } from './default-setting';

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
		conditions.push(or(ilike(distributionKeys.name, `%${search}%`), ilike(distributionKeys.nameDE, `%${search}%`)));
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
 * Get distribution key by English or German name (for lookups)
 */
export async function getDistributionKeyByName(name: string): Promise<DistributionKey | null> {
	const [key] = await db
		.select()
		.from(distributionKeys)
		.where(or(ilike(distributionKeys.name, name), ilike(distributionKeys.nameDE, name)))
		.limit(1);

	return key || null;
}

/** English and German names identify a distribution key, so both stay unique */
async function ensureNameIsFree(name: string, id?: string) {
	const existing = await getDistributionKeyByName(name);
	if (existing && existing.id !== id) {
		throw new Conflict('DISTRIBUTION_KEY_NAME_TAKEN', `Ein Verteilschlüssel mit dem Namen «${name}» existiert bereits.`, { name });
	}
}

function ensureValidFormula(formula: string) {
	const validation = validateFormulaForDistribution(formula);
	if (!validation.isValid) {
		// The UI names every error in its language, in the order of the text
		throw new CodedError('FORMULA_INVALID', `Die Formel ist ungültig: ${validation.errors.join(' ')}`, {}, validation.errorCodes);
	}
}

/**
 * Create a new distribution key
 */
export async function createDistributionKey(data: NewDistributionKey): Promise<DistributionKey> {
	await ensureNameIsFree(data.name);
	if (data.nameDE) await ensureNameIsFree(data.nameDE);

	// Validate formula if provided (required for custom keys)
	if (data.type === 'custom' && !data.formula) {
		throw new CodedError('FORMULA_REQUIRED', 'Bitte geben Sie eine Formel ein.');
	}
	if (data.formula) ensureValidFormula(data.formula);

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
		throw new CodedError('DISTRIBUTION_KEY_TYPE_FIXED', 'Die Art des Verteilschlüssels kann nicht geändert werden.');
	}

	// Don't allow modifying predefined formulas
	if (existing.type === 'predefined' && data.formula && data.formula !== existing.formula) {
		throw new CodedError('DISTRIBUTION_KEY_FORMULA_FIXED', 'Die Formel vordefinierter Verteilschlüssel kann nicht geändert werden.');
	}

	if (data.name) await ensureNameIsFree(data.name, id);
	if (data.nameDE) await ensureNameIsFree(data.nameDE, id);
	if (data.formula && data.formula !== existing.formula) ensureValidFormula(data.formula);

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
export async function deleteDistributionKey(
	id: string
): Promise<{ success: boolean; conflict?: boolean } & Partial<Refusal>> {
	// Check if key exists
	const existing = await getDistributionKey(id);
	if (!existing) {
		return { success: false, ...refusal('DISTRIBUTION_KEY_NOT_FOUND', 'Distribution key not found') };
	}

	// Don't allow deleting predefined keys
	if (existing.type === 'predefined') {
		return {
			success: false,
			...refusal('DISTRIBUTION_KEY_PREDEFINED', 'Vordefinierte Verteilschlüssel können nicht gelöscht werden.')
		};
	}

	const count = Number(existing.invoiceCount);
	if (count > 0) {
		return {
			success: false,
			conflict: true,
			...refusal(
				count === 1 ? 'DISTRIBUTION_KEY_IN_USE_ONE' : 'DISTRIBUTION_KEY_IN_USE',
				`Nach dem Verteilschlüssel ${count === 1 ? 'wird 1 Rechnung' : `werden ${count} Rechnungen`} verteilt, er kann nicht gelöscht werden.`,
				{ count }
			)
		};
	}

	// New invoices propose the default key of the settings
	if (await isDefaultSetting('default_distribution_key_id', id)) {
		return {
			success: false,
			conflict: true,
			...refusal('DISTRIBUTION_KEY_IS_DEFAULT', 'Der Verteilschlüssel ist in den Einstellungen als Standard hinterlegt.')
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
	errorCodes: ErrorCode[];
} {
	const validation = validateFormulaForDistribution(formula);
	if (!validation.isValid) {
		return {
			isValid: false,
			results: [],
			totalValue: 0,
			errors: validation.errors,
			errorCodes: validation.errorCodes
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
			errors: [distribution.error || 'Unknown error'],
			errorCodes: [distribution.errorCode!]
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
		errors: [],
		errorCodes: []
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
