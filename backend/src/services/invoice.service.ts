/**
 * Invoice Service
 * Business logic for invoice operations with LLM categorization
 */

import { eq, sql, desc, and, gte, lte, ilike, or } from 'drizzle-orm';
import { db } from '../db/connection';
import {
	invoices,
	buildings,
	categories,
	distributionKeys,
	type Invoice,
	type NewInvoice
} from '../db/schema';
import { categorizeInvoice, recategorizeInvoice } from './llm.service';
import { validateInvoiceForUtilityStatement } from './utility-validation.service';
import { buildingExists } from './building.service';
import { getCategory } from './category.service';

export interface InvoiceFilters {
	search?: string;
	buildingId?: string;
	categoryId?: string;
	dateFrom?: string;
	dateTo?: string;
	isValidUtilityCost?: boolean;
	wasManuallyOverridden?: boolean;
	limit?: number;
	offset?: number;
}

export interface InvoiceWithDetails extends Invoice {
	building: { id: string; name: string; address: string } | null;
	category: { id: string; name: string; nameDE: string | null; isAllowedUtilityCost: boolean } | null;
	distributionKey: { id: string; name: string; nameDE: string | null } | null;
	llmCategory: { id: string; name: string; nameDE: string | null } | null;
}

/**
 * Invoices with their building, category and distribution key (names in English and German)
 */
function selectWithDetails() {
	return db
		.select({
			invoice: invoices,
			building: {
				id: buildings.id,
				name: buildings.name,
				address: buildings.address
			},
			category: {
				id: categories.id,
				name: categories.name,
				nameDE: categories.nameDE,
				isAllowedUtilityCost: categories.isAllowedUtilityCost
			},
			distributionKey: {
				id: distributionKeys.id,
				name: distributionKeys.name,
				nameDE: distributionKeys.nameDE
			}
		})
		.from(invoices)
		.leftJoin(buildings, eq(invoices.buildingId, buildings.id))
		.leftJoin(categories, eq(invoices.categoryId, categories.id))
		.leftJoin(distributionKeys, eq(invoices.distributionKeyId, distributionKeys.id));
}

/**
 * List invoices with optional filters and pagination
 */
export async function listInvoices(filters: InvoiceFilters = {}): Promise<{
	invoices: InvoiceWithDetails[];
	total: number;
}> {
	const {
		search,
		buildingId,
		categoryId,
		dateFrom,
		dateTo,
		isValidUtilityCost,
		wasManuallyOverridden,
		limit = 20,
		offset = 0
	} = filters;

	// Build where conditions
	const conditions = [];

	if (search) {
		conditions.push(
			or(
				ilike(invoices.billingEntityName, `%${search}%`),
				ilike(invoices.description, `%${search}%`),
				ilike(invoices.invoiceNumber, `%${search}%`)
			)
		);
	}

	if (buildingId) {
		conditions.push(eq(invoices.buildingId, buildingId));
	}

	if (categoryId) {
		conditions.push(eq(invoices.categoryId, categoryId));
	}

	if (dateFrom) {
		conditions.push(gte(invoices.invoiceDate, dateFrom));
	}

	if (dateTo) {
		conditions.push(lte(invoices.invoiceDate, dateTo));
	}

	if (isValidUtilityCost !== undefined) {
		conditions.push(eq(invoices.isValidUtilityCost, isValidUtilityCost));
	}

	if (wasManuallyOverridden !== undefined) {
		conditions.push(eq(invoices.wasManuallyOverridden, wasManuallyOverridden));
	}

	const whereClause = and(...conditions);

	// Build the query with joins
	const results = await selectWithDetails()
		.where(whereClause)
		.orderBy(desc(invoices.invoiceDate), desc(invoices.createdAt))
		.limit(limit)
		.offset(offset);

	// Transform results
	const invoiceList: InvoiceWithDetails[] = results.map((row) => ({
		...row.invoice,
		building: row.building,
		category: row.category,
		distributionKey: row.distributionKey,
		llmCategory: null // Would need another join for llm category
	}));

	// Get total count
	const countQuery = db.select({ count: sql<number>`count(*)` }).from(invoices);
	const [{ count: total }] = await countQuery.where(whereClause);

	return {
		invoices: invoiceList,
		total: Number(total)
	};
}

/**
 * Get a single invoice by ID with all related data
 */
export async function getInvoice(id: string): Promise<InvoiceWithDetails | null> {
	const [result] = await selectWithDetails()
		.where(eq(invoices.id, id))
		.limit(1);

	if (!result) return null;

	// Get LLM category if present
	let llmCategory = null;
	if (result.invoice.llmCategoryId) {
		const [llmCat] = await db
			.select({ id: categories.id, name: categories.name, nameDE: categories.nameDE })
			.from(categories)
			.where(eq(categories.id, result.invoice.llmCategoryId))
			.limit(1);
		llmCategory = llmCat || null;
	}

	return {
		...result.invoice,
		building: result.building,
		category: result.category,
		distributionKey: result.distributionKey,
		llmCategory
	};
}

/**
 * The KI's category for an invoice without one; a sure suggestion (85% and more) becomes its category
 */
async function categorizeWithKi(data: NewInvoice): Promise<Pick<NewInvoice, 'llmCategoryId' | 'llmConfidence'>> {
	try {
		const categorization = await categorizeInvoice({
			billingEntityName: data.billingEntityName,
			description: data.description,
			amount: data.amount
		});
		if (!categorization.category || categorization.confidence < 0.7) return {};

		if (categorization.confidence >= 0.85) {
			data.categoryId = categorization.category.id;
			data.isValidUtilityCost = categorization.isAllowedUtilityCost;
		}
		return { llmCategoryId: categorization.category.id, llmConfidence: String(categorization.confidence) };
	} catch (error) {
		console.warn('LLM categorization failed, continuing without:', error);
		return {};
	}
}

/** Checks the invoice's category; costs of a non-allocable one stay with the owners (OR 257a), whatever the form sends */
async function applyCategory(data: Partial<NewInvoice>, categoryId: string | null | undefined) {
	if (!categoryId) return;
	const category = await getCategory(categoryId);
	if (!category) throw new Error('Category not found');
	if (!category.isAllowedUtilityCost) data.isValidUtilityCost = false;
}

/**
 * Create a new invoice with optional LLM categorization
 */
export async function createInvoice(
	data: NewInvoice,
	options: { skipLlmCategorization?: boolean } = {}
): Promise<InvoiceWithDetails> {
	// Validate building exists
	if (!(await buildingExists(data.buildingId))) {
		throw new Error('Building not found');
	}

	await applyCategory(data, data.categoryId);

	// Without a category the KI categorizes the invoice; a suggestion taken in the form arrives in data
	const suggestion = !data.categoryId && !options.skipLlmCategorization ? await categorizeWithKi(data) : {};

	// Insert the invoice
	const [invoice] = await db
		.insert(invoices)
		.values({
			...data,
			...suggestion,
			wasManuallyOverridden: false
		})
		.returning();

	// Fetch and return with details
	const result = await getInvoice(invoice.id);
	if (!result) {
		throw new Error('Failed to fetch created invoice');
	}

	return result;
}

/**
 * Update an existing invoice
 */
export async function updateInvoice(
	id: string,
	data: Partial<NewInvoice>,
	options: { logOverride?: boolean } = {}
): Promise<InvoiceWithDetails | null> {
	// Check if invoice exists
	const existing = await getInvoice(id);
	if (!existing) return null;

	await applyCategory(data, 'categoryId' in data ? data.categoryId : existing.categoryId);

	// Check if category is being manually overridden
	let wasManuallyOverridden = existing.wasManuallyOverridden;
	if (data.categoryId && data.categoryId !== existing.categoryId) {
		// Category is being changed - check if different from LLM suggestion
		if (existing.llmCategoryId && data.categoryId !== existing.llmCategoryId) {
			wasManuallyOverridden = true;
			if (options.logOverride) {
				console.log(
					`Invoice ${id}: Category manually overridden from "${existing.llmCategory?.name}" to new category`
				);
			}
		}
	}

	// Update the invoice
	const [updated] = await db
		.update(invoices)
		.set({
			...data,
			wasManuallyOverridden,
			updatedAt: new Date()
		})
		.where(eq(invoices.id, id))
		.returning();

	if (!updated) return null;

	return await getInvoice(id);
}

/**
 * Delete an invoice
 * Returns false if invoice is used in utility statements
 */
export async function deleteInvoice(id: string): Promise<{ success: boolean; error?: string }> {
	// Check if invoice is used in any statement line items
	// Note: This would require a link between invoices and statement line items
	// For now, we'll just check if invoice exists

	const existing = await getInvoice(id);
	if (!existing) {
		return { success: false, error: 'Invoice not found' };
	}

	// Delete the invoice
	await db.delete(invoices).where(eq(invoices.id, id));

	return { success: true };
}

/** Answer of the recategorization when the KI does not run or names no known category */
export const KI_UNAVAILABLE = 'Die KI ist nicht erreichbar oder hat keine passende Kategorie geliefert.';

/**
 * Re-categorize an invoice using LLM
 */
export async function recategorizeInvoiceById(id: string): Promise<{
	success: boolean;
	invoice?: InvoiceWithDetails;
	categorization?: {
		category: string | null;
		confidence: number;
		isAllowedUtilityCost: boolean;
		reasoning?: string;
	};
	error?: string;
}> {
	const invoice = await getInvoice(id);
	if (!invoice) {
		return { success: false, error: 'Invoice not found' };
	}

	try {
		const result = await recategorizeInvoice({
			billingEntityName: invoice.billingEntityName,
			description: invoice.description,
			amount: invoice.amount
		});

		if (!result.category) {
			return { success: false, error: KI_UNAVAILABLE };
		}

		// Update invoice with new categorization
		await db
			.update(invoices)
			.set({
				llmCategoryId: result.category.id,
				llmConfidence: String(result.confidence),
				updatedAt: new Date()
			})
			.where(eq(invoices.id, id));

		const updatedInvoice = await getInvoice(id);

		return {
			success: true,
			invoice: updatedInvoice || undefined,
			categorization: {
				category: result.category.name,
				confidence: result.confidence,
				isAllowedUtilityCost: result.isAllowedUtilityCost,
				reasoning: result.reasoning
			}
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Categorization failed'
		};
	}
}

/**
 * Validate an invoice for utility statement inclusion
 */
export async function validateInvoice(id: string): Promise<{
	isValid: boolean;
	errors: string[];
	warnings: string[];
}> {
	const invoice = await getInvoice(id);
	if (!invoice) {
		return {
			isValid: false,
			errors: ['Invoice not found'],
			warnings: []
		};
	}

	return await validateInvoiceForUtilityStatement({
		categoryId: invoice.categoryId,
		amount: invoice.amount,
		isValidUtilityCost: invoice.isValidUtilityCost,
		description: invoice.description
	});
}

/**
 * Get invoices for a building within a date range (for statement generation)
 */
export async function getInvoicesForStatement(
	buildingId: string,
	periodStart: string,
	periodEnd: string
): Promise<InvoiceWithDetails[]> {
	const results = await selectWithDetails()
		.where(
			and(
				eq(invoices.buildingId, buildingId),
				eq(invoices.isValidUtilityCost, true),
				gte(invoices.invoiceDate, periodStart),
				lte(invoices.invoiceDate, periodEnd)
			)
		)
		.orderBy(invoices.invoiceDate);

	return results.map((row) => ({
		...row.invoice,
		building: row.building,
		category: row.category,
		distributionKey: row.distributionKey,
		llmCategory: null
	}));
}

/**
 * Check if an invoice exists
 */
export async function invoiceExists(id: string): Promise<boolean> {
	const [result] = await db
		.select({ id: invoices.id })
		.from(invoices)
		.where(eq(invoices.id, id))
		.limit(1);

	return !!result;
}
