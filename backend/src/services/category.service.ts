/**
 * Category Service
 * Business logic for utility cost category operations
 */

import { eq, sql, asc, ilike } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, invoices, type Category, type NewCategory } from '../db/schema';

export interface CategoryFilters {
	search?: string;
	isAllowedUtilityCost?: boolean;
	limit?: number;
	offset?: number;
}

export interface CategoryWithUsage extends Category {
	invoiceCount: number;
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
		conditions.push(ilike(categories.name, `%${search}%`));
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
			description: categories.description,
			sortOrder: categories.sortOrder,
			createdAt: categories.createdAt,
			updatedAt: categories.updatedAt,
			invoiceCount: sql<number>`(SELECT COUNT(*) FROM invoices WHERE invoices.category_id = ${categories.id})`.as(
				'invoice_count'
			)
		})
		.from(categories)
		.orderBy(asc(categories.sortOrder), asc(categories.name))
		.limit(limit)
		.offset(offset);

	// Apply conditions if any
	const results =
		conditions.length > 0
			? await categoriesQuery.where(
					conditions.length === 1 ? conditions[0] : sql`${conditions.join(' AND ')}`
				)
			: await categoriesQuery;

	// Get total count
	const countQuery = db.select({ count: sql<number>`count(*)` }).from(categories);

	const [{ count: total }] =
		conditions.length > 0
			? await countQuery.where(
					conditions.length === 1 ? conditions[0] : sql`${conditions.join(' AND ')}`
				)
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
			description: categories.description,
			sortOrder: categories.sortOrder,
			createdAt: categories.createdAt,
			updatedAt: categories.updatedAt,
			invoiceCount: sql<number>`(SELECT COUNT(*) FROM invoices WHERE invoices.category_id = ${categories.id})`.as(
				'invoice_count'
			)
		})
		.from(categories)
		.where(eq(categories.id, id))
		.limit(1);

	return (category as CategoryWithUsage) || null;
}

/**
 * Get category by name (for LLM categorization matching)
 */
export async function getCategoryByName(name: string): Promise<Category | null> {
	const [category] = await db
		.select()
		.from(categories)
		.where(ilike(categories.name, name))
		.limit(1);

	return category || null;
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

/**
 * Create a new category
 */
export async function createCategory(data: NewCategory): Promise<Category> {
	// Check for duplicate name
	const existing = await getCategoryByName(data.name);
	if (existing) {
		throw new Error(`Category with name "${data.name}" already exists`);
	}

	const [category] = await db.insert(categories).values(data).returning();
	return category;
}

/**
 * Update an existing category
 */
export async function updateCategory(id: string, data: Partial<NewCategory>): Promise<Category | null> {
	// Check for duplicate name if name is being changed
	if (data.name) {
		const existing = await getCategoryByName(data.name);
		if (existing && existing.id !== id) {
			throw new Error(`Category with name "${data.name}" already exists`);
		}
	}

	const [category] = await db
		.update(categories)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(categories.id, id))
		.returning();

	return category || null;
}

/**
 * Delete a category
 * Returns false if category is used by invoices
 */
export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
	// Check for invoices using this category
	const [invoiceCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(invoices)
		.where(eq(invoices.categoryId, id));

	if (Number(invoiceCount.count) > 0) {
		return {
			success: false,
			error: `Cannot delete category used by ${invoiceCount.count} invoices. Reassign invoices first.`
		};
	}

	const result = await db.delete(categories).where(eq(categories.id, id)).returning();

	if (result.length === 0) {
		return { success: false, error: 'Category not found' };
	}

	return { success: true };
}

/**
 * Check if a category exists
 */
export async function categoryExists(id: string): Promise<boolean> {
	const [result] = await db
		.select({ id: categories.id })
		.from(categories)
		.where(eq(categories.id, id))
		.limit(1);

	return !!result;
}
