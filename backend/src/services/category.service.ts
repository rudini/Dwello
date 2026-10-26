/**
 * Category Service
 * Business logic for utility cost category operations
 */

import { eq, sql, asc, ilike, and, or } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, invoices, type Category, type NewCategory } from '../db/schema';
import { CodedError, refusal, type Refusal } from './coded-error';
import { recordAudit } from './audit-log.service';
import { Conflict } from './conflict';
import { categoryHasFuelStocks } from './fuel-stock.service';
import type { CategoryWithUsage } from '../api/category';

export interface CategoryFilters {
	search?: string;
	isAllowedUtilityCost?: boolean;
	limit?: number;
	offset?: number;
}

/**
 * List all categories with optional filters
 */
export async function listCategories(filters: CategoryFilters = {}): Promise<{
	categories: CategoryWithUsage[];
	total: number;
}> {
	const { search, isAllowedUtilityCost, limit = 100, offset = 0 } = filters;

	// Build where conditions
	const conditions = [];

	if (search) {
		conditions.push(or(ilike(categories.name, `%${search}%`), ilike(categories.nameDE, `%${search}%`)));
	}

	if (isAllowedUtilityCost !== undefined) {
		conditions.push(eq(categories.isAllowedUtilityCost, isAllowedUtilityCost));
	}

	// Get categories with usage stats
	const categoriesQuery = db
		.select({
			id: categories.id,
			name: categories.name,
			nameDE: categories.nameDE,
			nameFR: categories.nameFR,
			nameIT: categories.nameIT,
			nameEN: categories.nameEN,
			isAllowedUtilityCost: categories.isAllowedUtilityCost,
			isHeatingCost: categories.isHeatingCost,
			isFuel: categories.isFuel,
			type: categories.type,
			description: categories.description,
			sortOrder: categories.sortOrder,
			createdAt: categories.createdAt,
			updatedAt: categories.updatedAt,
			invoiceCount: sql<string>`(SELECT COUNT(*) FROM invoices WHERE invoices.category_id = "categories"."id")`.as(
				'invoice_count'
			)
		})
		.from(categories)
		.orderBy(asc(categories.sortOrder), asc(categories.name))
		.limit(limit)
		.offset(offset);

	// Apply conditions if any
	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	const results = whereClause
		? await categoriesQuery.where(whereClause)
		: await categoriesQuery;

	// Get total count
	const countQuery = db.select({ count: sql<number>`count(*)` }).from(categories);

	const [{ count: total }] = whereClause
		? await countQuery.where(whereClause)
		: await countQuery;

	return {
		categories: results as CategoryWithUsage[],
		total: Number(total)
	};
}

/**
 * Get a single category by ID
 */
export async function getCategory(id: string): Promise<CategoryWithUsage | null> {
	const [category] = await db
		.select({
			id: categories.id,
			name: categories.name,
			nameDE: categories.nameDE,
			nameFR: categories.nameFR,
			nameIT: categories.nameIT,
			nameEN: categories.nameEN,
			isAllowedUtilityCost: categories.isAllowedUtilityCost,
			isHeatingCost: categories.isHeatingCost,
			isFuel: categories.isFuel,
			type: categories.type,
			description: categories.description,
			sortOrder: categories.sortOrder,
			createdAt: categories.createdAt,
			updatedAt: categories.updatedAt,
			invoiceCount: sql<string>`(SELECT COUNT(*) FROM invoices WHERE invoices.category_id = "categories"."id")`.as(
				'invoice_count'
			),
			// the invoices a save as «nicht umlagefähig» would take out (#309)
			allocableInvoiceCount: sql<number>`(SELECT COUNT(*)::int FROM invoices WHERE invoices.category_id = "categories"."id" AND invoices.is_valid_utility_cost)`.as(
				'allocable_invoice_count'
			)
		})
		.from(categories)
		.where(eq(categories.id, id))
		.limit(1);

	return (category as CategoryWithUsage) || null;
}

/**
 * Get category by name (for LLM categorization matching)
 * Searches English name, then German name (nameDE) as fallback
 */
export async function getCategoryByName(name: string): Promise<Category | null> {
	// Try exact match on English name first
	const [byEnglish] = await db
		.select()
		.from(categories)
		.where(ilike(categories.name, name))
		.limit(1);

	if (byEnglish) return byEnglish;

	// Fallback: try German name (LLM sometimes returns German category names)
	const [byGerman] = await db
		.select()
		.from(categories)
		.where(ilike(categories.nameDE, name))
		.limit(1);

	return byGerman || null;
}

/**
 * Get all allowed utility cost categories
 */
export async function getAllowedCategories(): Promise<Category[]> {
	return await db
		.select()
		.from(categories)
		.where(eq(categories.isAllowedUtilityCost, true))
		.orderBy(asc(categories.sortOrder), asc(categories.name));
}

/** English and German names identify a category (LLM matching), so both stay unique */
async function ensureNameIsFree(name: string, id?: string) {
	const existing = await getCategoryByName(name);
	if (existing && existing.id !== id) {
		throw new Conflict('CATEGORY_NAME_TAKEN', `Eine Kategorie mit dem Namen «${name}» existiert bereits.`, { name });
	}
}

/**
 * Create a new category
 */
export async function createCategory(data: NewCategory): Promise<Category> {
	await ensureNameIsFree(data.name);
	if (data.nameDE) await ensureNameIsFree(data.nameDE);

	const [category] = await db
		.insert(categories)
		.values({ ...data, isFuel: !!(data.isHeatingCost && data.isFuel), type: 'custom' })
		.returning();
	return category;
}

/**
 * Update an existing category
 */
export async function updateCategory(id: string, changes: Partial<NewCategory>): Promise<Category | null> {
	// A predefined category keeps its key: the KI and its reason know it by that (#166); and «Heizkosten», which
	// decides how a tenant change shares its costs (#302)
	const [stored] = await db
		.select({ type: categories.type, heating: categories.isHeatingCost, fuel: categories.isFuel })
		.from(categories)
		.where(eq(categories.id, id));
	const { name: _key, isHeatingCost: _heating, ...fixed } = changes;
	const data: Partial<NewCategory> = stored?.type === 'predefined' ? fixed : changes;
	// Brennstoff is a mark of a heating cost (#100); one with a Tankbestand keeps it, else its next Endbestand could not
	// be recorded and the statement would bill the purchases
	if (stored) data.isFuel = (data.isHeatingCost ?? stored.heating) && (data.isFuel ?? stored.fuel);
	if (stored?.fuel && !data.isFuel && (await categoryHasFuelStocks(id))) {
		throw new CodedError('CATEGORY_FUEL_HAS_STOCK', 'Die Kategorie hat Tankbestände und bleibt Brennstoff.');
	}
	if (data.name) await ensureNameIsFree(data.name, id);
	if (data.nameDE) await ensureNameIsFree(data.nameDE, id);

	return db.transaction(async (tx) => {
		const [before] = await tx.select({ allocable: categories.isAllowedUtilityCost }).from(categories).where(eq(categories.id, id));
		const [category] = await tx
			.update(categories)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(categories.id, id))
			.returning();
		// Costs no longer allocable leave its invoices too, else statements would still pass them on (OR 257a)
		const excluded =
			category && data.isAllowedUtilityCost === false
				? await tx.update(invoices).set({ isValidUtilityCost: false, updatedAt: new Date() }).where(and(eq(invoices.categoryId, id), eq(invoices.isValidUtilityCost, true))).returning({ id: invoices.id })
				: [];
		// #357: the Protokoll names the change and, when it excludes costs, how many invoices
		if (category && before.allocable !== category.isAllowedUtilityCost) {
			const { name, nameDE, nameFR, nameIT, nameEN, isAllowedUtilityCost: allocable } = category;
			await recordAudit(
				'category_allocability_changed',
				{ categoryId: id, name, nameDE, nameFR, nameIT, nameEN, allocable, ...(!allocable && { invoices: excluded.length }) },
				tx
			);
		}
		return category || null;
	});
}

/**
 * Delete a category
 * Returns false if category is used by invoices
 */
export async function deleteCategory(id: string): Promise<{ success: boolean; conflict?: boolean } & Partial<Refusal>> {
	const [predefined] = await db.select({ id: categories.id }).from(categories).where(and(eq(categories.id, id), eq(categories.type, 'predefined')));
	if (predefined) {
		return { success: false, conflict: true, ...refusal('CATEGORY_PREDEFINED', 'Vordefinierte Kategorien können nicht gelöscht werden.') };
	}
	// Check for invoices using this category
	const [invoiceCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(invoices)
		.where(eq(invoices.categoryId, id));

	const count = Number(invoiceCount.count);
	if (count === 0 && (await categoryHasFuelStocks(id))) {
		return {
			success: false,
			conflict: true,
			...refusal('CATEGORY_HAS_FUEL_STOCK', 'Die Kategorie hat Tankbestände und kann nicht gelöscht werden.')
		};
	}
	if (count > 0) {
		return {
			success: false,
			conflict: true,
			...refusal(
				count === 1 ? 'CATEGORY_IN_USE_ONE' : 'CATEGORY_IN_USE',
				`Die Kategorie wird von ${count} ${count === 1 ? 'Rechnung' : 'Rechnungen'} verwendet und kann nicht gelöscht werden.`,
				{ count }
			)
		};
	}

	const result = await db.delete(categories).where(eq(categories.id, id)).returning();

	if (result.length === 0) {
		return { success: false, ...refusal('CATEGORY_NOT_FOUND', 'Category not found') };
	}

	return { success: true };
}
