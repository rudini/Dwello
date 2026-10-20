/**
 * Invoice Service
 * Business logic for invoice operations with LLM categorization
 */

import { eq, sql, desc, and, gte, lte, ilike, isNotNull, isNull, or } from 'drizzle-orm';
import { db } from '../db/connection';
import { recordAudit } from './audit-log.service';
import {
	invoices,
	buildings,
	categories,
	distributionKeys,
	invoiceDocuments,
	type Invoice,
	type NewInvoice
} from '../db/schema';
import { categorizeInvoice, extractInvoice, recategorizeInvoice } from './llm.service';
import { validateInvoiceForUtilityStatement } from './utility-validation.service';
import { buildingExists } from './building.service';
import { periodReadings } from './fuel-stock.service';
import { getCategory } from './category.service';
import { roundToRappen } from './pdf-format';
import { CodedError, refusal, type Refusal } from './coded-error';
import { checkedFile } from './document.service';

/** An uploaded file for an invoice, Base64 encoded */
/** A file for an invoice; read by the KI in «Rechnungen hochladen», with what it saw on it (#233) */
export type BelegUpload = { fileName: string; content: string; deductedAmount?: string | null; nonAllocableItems?: boolean };

export interface InvoiceFilters {
	search?: string;
	buildingId?: string;
	categoryId?: string;
	dateFrom?: string;
	dateTo?: string;
	isValidUtilityCost?: boolean;
	wasManuallyOverridden?: boolean;
	// #454: the invoices that fall into an Abrechnungsperiode by rule 1, allocable first, each with its part in it
	periodStart?: string;
	periodEnd?: string;
	limit?: number;
	offset?: number;
}

export interface InvoiceWithDetails extends Invoice {
	building: { id: string; name: string; address: string } | null;
	category: {
		id: string;
		name: string;
		nameDE: string | null;
		isAllowedUtilityCost: boolean;
		isHeatingCost: boolean;
		type: string;
	} | null;
	distributionKey: { id: string; name: string; nameDE: string | null } | null;
	llmCategory: { id: string; name: string; nameDE: string | null } | null;
	beleg: { fileName: string; mimeType: string; deductedAmount: string | null; nonAllocableItems: boolean } | null;
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
				isAllowedUtilityCost: categories.isAllowedUtilityCost,
				isHeatingCost: categories.isHeatingCost,
				type: categories.type
			},
			distributionKey: {
				id: distributionKeys.id,
				name: distributionKeys.name,
				nameDE: distributionKeys.nameDE
			},
			beleg: {
				fileName: invoiceDocuments.fileName,
				mimeType: invoiceDocuments.mimeType,
				deductedAmount: invoiceDocuments.deductedAmount,
				nonAllocableItems: invoiceDocuments.nonAllocableItems
			}
		})
		.from(invoices)
		.leftJoin(buildings, eq(invoices.buildingId, buildings.id))
		.leftJoin(categories, eq(invoices.categoryId, categories.id))
		.leftJoin(distributionKeys, eq(invoices.distributionKeyId, distributionKeys.id))
		.leftJoin(invoiceDocuments, eq(invoiceDocuments.invoiceId, invoices.id));
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
		periodStart,
		periodEnd,
		limit = 20,
		offset = 0
	} = filters;
	const period = periodStart && periodEnd ? { start: periodStart, end: periodEnd } : null;

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

	if (period) conditions.push(inPeriodOf(period.start, period.end));

	const whereClause = and(...conditions);

	// Build the query with joins
	const results = await selectWithDetails()
		.where(whereClause)
		.orderBy(
			...(period ? [desc(invoices.isValidUtilityCost)] : []), // grouped by allocability (Fachreview 454-1 E-1)
			desc(invoices.invoiceDate),
			desc(invoices.createdAt),
			desc(invoices.id) // a stable page order for ties
		)
		.limit(limit)
		.offset(offset);

	// Transform results
	const invoiceList: InvoiceWithDetails[] = results.map((row) => ({
		...row.invoice,
		building: row.building,
		category: row.category,
		distributionKey: row.distributionKey,
		llmCategory: null, // Would need another join for llm category
		beleg: row.beleg,
		...(period && { inPeriod: inPeriod(row.invoice, period.start, period.end) })
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
		llmCategory,
		beleg: result.beleg
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

/** #379: every invoice says how its costs are shared; without a key the PDF could not name one */
function requireKey(distributionKeyId: string | null | undefined) {
	if (!distributionKeyId) throw new CodedError('INVOICE_KEY_REQUIRED', 'An invoice needs a distribution key');
}

/**
 * Per building and category the Verteilschlüssel of the latest invoice that has one (#379): the invoice form proposes
 * it, as one category of a building keeps one key
 */
export async function latestKeys() {
	return db
		.selectDistinctOn([invoices.buildingId, invoices.categoryId], {
			buildingId: invoices.buildingId,
			categoryId: invoices.categoryId,
			distributionKeyId: invoices.distributionKeyId
		})
		.from(invoices)
		.where(and(isNotNull(invoices.categoryId), isNotNull(invoices.distributionKeyId)))
		.orderBy(invoices.buildingId, invoices.categoryId, desc(invoices.invoiceDate), desc(invoices.createdAt));
}

/** Checks the invoice's category; costs of a non-allocable one stay with the owners (OR 257a), whatever the form sends */
async function applyCategory(data: Partial<NewInvoice>, categoryId: string | null | undefined) {
	if (!categoryId) return;
	const category = await getCategory(categoryId);
	if (!category) throw new CodedError('CATEGORY_NOT_FOUND', 'Category not found');
	if (!category.isAllowedUtilityCost) data.isValidUtilityCost = false;
}

// A credit is deducted from the invoice it belongs to, as the form says; never a negative invoice (#451, point 1)
function refuseCredit(amount?: string) {
	if (amount != null && parseFloat(amount) < 0) throw new CodedError('INVOICE_AMOUNT_NEGATIVE', 'The amount of an invoice cannot be negative');
}

/**
 * Create a new invoice with optional LLM categorization
 */
export async function createInvoice(
	{ beleg, ...data }: NewInvoice & { beleg?: BelegUpload },
	options: { skipLlmCategorization?: boolean } = {}
): Promise<InvoiceWithDetails> {
	// Validate building exists
	if (!(await buildingExists(data.buildingId))) {
		throw new CodedError('BUILDING_NOT_FOUND', 'Building not found');
	}
	refuseCredit(data.amount);
	// A file Dwello does not keep refuses the invoice before anything is saved
	const file = beleg && checkedFile(beleg);

	await applyCategory(data, data.categoryId);
	requireKey(data.distributionKeyId);

	// Without a category the KI categorizes the invoice; a suggestion taken in the form arrives in data
	const suggestion = !data.categoryId && !options.skipLlmCategorization ? await categorizeWithKi(data) : {};

	// Insert the invoice, with its Beleg or not at all
	const invoice = await db.transaction(async (tx) => {
		const [created] = await tx
			.insert(invoices)
			.values({
				...data,
				...suggestion,
				wasManuallyOverridden: false
			})
			.returning();
		if (file)
			await tx.insert(invoiceDocuments).values({
				invoiceId: created.id,
				...file,
				deductedAmount: beleg.deductedAmount ?? null,
				nonAllocableItems: beleg.nonAllocableItems ?? false
			});
		return created;
	});

	// Fetch and return with details
	const result = await getInvoice(invoice.id);
	if (!result) {
		throw new Error('Failed to fetch created invoice');
	}

	return result;
}

/** The Beleg of an invoice with its file, or null without one */
export async function getBeleg(invoiceId: string) {
	const [beleg] = await db.select().from(invoiceDocuments).where(eq(invoiceDocuments.invoiceId, invoiceId));
	return beleg && { fileName: beleg.fileName, mimeType: beleg.mimeType, content: Buffer.from(beleg.content, 'base64') };
}

/** Adds or replaces the Beleg of an invoice; null when there is no such invoice */
export async function setBeleg(invoiceId: string, upload: BelegUpload) {
	if (!(await getInvoice(invoiceId))) return null;
	// a new file: what the KI saw on the old one does not hold for it
	const file = { ...checkedFile(upload), deductedAmount: null, nonAllocableItems: false };
	await db
		.insert(invoiceDocuments)
		.values({ invoiceId, ...file })
		.onConflictDoUpdate({ target: invoiceDocuments.invoiceId, set: { ...file, createdAt: new Date() } });
	return getInvoice(invoiceId);
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
	refuseCredit(data.amount);
	// an old invoice without key keeps working for other changes; emptying the key is refused
	if ('distributionKeyId' in data) requireKey(data.distributionKeyId);

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

	return recordAllocability(existing, await getInvoice(id));
}

/** #357: an invoice that leaves the statements or comes back into them goes into the Protokoll; returns it */
async function recordAllocability(before: InvoiceWithDetails, after: InvoiceWithDetails | null) {
	if (after && after.isValidUtilityCost !== before.isValidUtilityCost) {
		const { id, description, billingEntityName, invoiceDate, amount, building, isValidUtilityCost } = after;
		await recordAudit('invoice_allocability_changed', {
			invoiceId: id,
			description,
			supplier: billingEntityName,
			invoiceDate,
			amount,
			building: building?.name,
			allocable: isValidUtilityCost
		});
	}
	return after;
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

/** The KI's category for an invoice as the form shows it */
export const suggestion = (result: Awaited<ReturnType<typeof categorizeInvoice>>) => ({
	category: result.category
		? { id: result.category.id, name: result.category.name, isAllowedUtilityCost: result.category.isAllowedUtilityCost }
		: null,
	confidence: result.confidence,
	isAllowedUtilityCost: result.isAllowedUtilityCost,
	reasoning: result.reasoning
});

/**
 * Proposals for a new invoice of the building from its uploaded file: what the KI read, the Kategorie it suggests and
 * an invoice of the building with the same Rechnungssteller and Rechnungsnummer; null when the KI did not read it
 */
export async function extractFromFile(buildingId: string, fileName: string, pages: string[]) {
	const extraction = await extractInvoice(fileName, pages);
	if (!extraction || extraction === 'unreadable') return extraction;
	const { billingEntityName, invoiceNumber, description, amount } = extraction.fields;
	const categorization =
		billingEntityName && description ? await categorizeInvoice({ billingEntityName, description, amount: amount ?? '0' }) : null;
	const [duplicate] =
		billingEntityName && invoiceNumber
			? await db
					.select({ id: invoices.id })
					.from(invoices)
					.where(
						and(
							eq(invoices.buildingId, buildingId),
							sql`lower(trim(${invoices.billingEntityName})) = lower(${billingEntityName})`,
							sql`lower(trim(${invoices.invoiceNumber})) = lower(${invoiceNumber})`
						)
					)
					.limit(1)
			: [];
	return {
		...extraction,
		categorization: categorization?.category ? suggestion(categorization) : null,
		duplicateOf: duplicate?.id ?? null
	};
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
} & Partial<Refusal>> {
	const invoice = await getInvoice(id);
	if (!invoice) {
		return { success: false, ...refusal('INVOICE_NOT_FOUND', 'Invoice not found') };
	}

	try {
		const result = await recategorizeInvoice({
			billingEntityName: invoice.billingEntityName,
			description: invoice.description,
			amount: invoice.amount
		});

		if (!result.category) {
			return { success: false, ...refusal('KI_UNAVAILABLE', KI_UNAVAILABLE) };
		}

		// As when entering an invoice, a sure suggestion becomes its category; a non-allocable one makes the invoice
		// non-allocable (OR 257a), while an exclusion by the property manager stays
		const sure = result.confidence >= 0.85 && {
			categoryId: result.category.id,
			...(!result.category.isAllowedUtilityCost && { isValidUtilityCost: false }),
			wasManuallyOverridden: false,
			manualOverrideReason: null
		};
		await db
			.update(invoices)
			.set({
				...sure,
				llmCategoryId: result.category.id,
				llmConfidence: String(result.confidence),
				updatedAt: new Date()
			})
			.where(eq(invoices.id, id));

		const updatedInvoice = await recordAllocability(invoice, await getInvoice(id));

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

const DAY = 86_400_000;
const daysFrom = (start: string, end: string) => (Date.parse(end) - Date.parse(start)) / DAY + 1;

/**
 * An invoice's part in a period: the days of its Leistungszeitraum within the period (without one, the whole period
 * when the Rechnungsdatum lies in it) and the amount of those days
 */
function inPeriod(
	invoice: { amount: string; servicePeriodStart: string | null; servicePeriodEnd: string | null },
	periodStart: string,
	periodEnd: string
) {
	const amount = parseFloat(invoice.amount);
	if (!invoice.servicePeriodStart || !invoice.servicePeriodEnd) return { start: periodStart, end: periodEnd, amount, noPeriod: true as const };
	const start = invoice.servicePeriodStart > periodStart ? invoice.servicePeriodStart : periodStart;
	const end = invoice.servicePeriodEnd < periodEnd ? invoice.servicePeriodEnd : periodEnd;
	const part = { start, end, amount: roundToRappen((amount * daysFrom(start, end)) / daysFrom(invoice.servicePeriodStart, invoice.servicePeriodEnd)) };
	// a Leistungszeitraum reaching beyond the period: the receipt's dates and amount, so the tenant finds it (#241)
	const beyond = start !== invoice.servicePeriodStart || end !== invoice.servicePeriodEnd;
	return beyond ? { ...part, whole: { start: invoice.servicePeriodStart, end: invoice.servicePeriodEnd, amount } } : part;
}

// Rule 1: in the period by its Leistungszeitraum, without one by its Rechnungsdatum
const inPeriodOf = (periodStart: string, periodEnd: string) =>
	or(
		and(isNull(invoices.servicePeriodStart), gte(invoices.invoiceDate, periodStart), lte(invoices.invoiceDate, periodEnd)),
		and(lte(invoices.servicePeriodStart, periodEnd), gte(invoices.servicePeriodEnd, periodStart))
	);

/**
 * Allocable invoices of a building for a period (for statement generation): those whose Leistungszeitraum overlaps it,
 * or without one, whose Rechnungsdatum lies in it; each with its part in the period. A delivery into the building's
 * tank counts in full in the period of its delivery date, the end of its Leistungszeitraum, never split (#451, M-1)
 */
export async function getInvoicesForStatement(buildingId: string, periodStart: string, periodEnd: string) {
	const tank = await periodReadings(buildingId, periodStart, periodEnd);
	const results = await selectWithDetails()
		.where(and(eq(invoices.buildingId, buildingId), eq(invoices.isValidUtilityCost, true), inPeriodOf(periodStart, periodEnd)))
		.orderBy(invoices.invoiceDate);
	const delivery = (invoice: (typeof results)[number]['invoice']) => !!tank?.covered && invoice.categoryId === tank.categoryId;

	return results
		.filter(({ invoice }) => !delivery(invoice) || !invoice.servicePeriodEnd || invoice.servicePeriodEnd <= periodEnd)
		.map((row) => ({
			...row.invoice,
			building: row.building,
			category: row.category,
			distributionKey: row.distributionKey,
			llmCategory: null,
			inPeriod: delivery(row.invoice) ? { start: periodStart, end: periodEnd, amount: parseFloat(row.invoice.amount) } : inPeriod(row.invoice, periodStart, periodEnd)
		}));
}

/**
 * The building's invoices the period would bill without a category (#382): Dwello checks the agreement of the
 * Mietvertrag through the category, so the run waits until each has one or is not allocable
 */
export async function getUncategorizedInvoices(buildingId: string, periodStart: string, periodEnd: string) {
	return (await getInvoicesForStatement(buildingId, periodStart, periodEnd))
		.filter((invoice) => !invoice.categoryId)
		.map(({ billingEntityName, invoiceDate, amount }) => ({ billingEntityName, invoiceDate, amount }));
}
