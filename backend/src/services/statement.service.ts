/**
 * Statement Service
 * Business logic for utility statement operations
 */

import { eq, sql, desc, and, gte, lte, lt, ilike, or, inArray, getTableColumns } from 'drizzle-orm';
import { db } from '../db/connection';
import {
	utilityStatements,
	utilityStatementLineItems,
	tenants,
	apartments,
	buildings,
	documents,
	heatingProfiles,
	type UtilityStatement,
	type NewUtilityStatement,
	type UtilityStatementLineItem,
	type NewUtilityStatementLineItem,
	type KeyValues
} from '../db/schema';
import { calculateStatementForContract, generateStatementNumber } from './calculation.service';
import { getTypedConfig } from './config.service';
import { fuelStockChange } from './fuel-stock.service';
import { listApartments } from './apartment.service';
import { CodedError, refusal, type Refusal } from './coded-error';
import { isRealDate } from './real-date';
import { oldAddress } from './old-address';
import { daysAfter, swissToday } from './today';

export interface StatementFilters {
	search?: string;
	contractId?: string;
	buildingId?: string;
	apartmentId?: string;
	tenantId?: string;
	status?: string;
	periodStart?: string;
	periodEnd?: string;
	limit?: number;
	offset?: number;
}

// The base64 PDF is only served by the /pdf routes, never with list or detail data
const { pdfBlob: _pdfBlob, ...tableColumns } = getTableColumns(utilityStatements);
// The day after the last reminder's Zahlungsfrist, from which the next Mahnstufe is possible (#107); none after the 3rd
// and none once paid
const nextReminderFrom = sql<string | null>`(
	select case when count(*) < 3 and ${utilityStatements.status} = 'sent' then (max(${documents.paymentDeadline}) + 1)::text end
	from ${documents}
	where ${documents.statementId} = ${utilityStatements.id} and ${documents.type} = 'reminder'
)`;
const statementColumns = { ...tableColumns, nextReminderFrom, oldAddress: oldAddress(utilityStatements.contractId) };

export interface StatementWithDetails extends Omit<UtilityStatement, 'pdfBlob'> {
	nextReminderFrom: string | null;
	oldAddress: boolean; // A-5: a moved-out tenant still has the building's address
	tenant: {
		id: string;
		firstName: string;
		lastName: string;
		email: string | null;
		language?: string;
		address?: string | null;
		postalCode?: string | null;
		city?: string | null;
	} | null;
	apartment: { id: string; number: string; floor: number; area: string } | null;
	building: { id: string; name: string; address: string; postalCode?: string; city?: string } | null;
	lineItems: UtilityStatementLineItem[];
	heatingProfile?: {
		id: string;
		name: string;
		nameDE: string | null;
		nameFR: string | null;
		nameIT: string | null;
		nameEN: string | null;
	} | null;
}

/**
 * Status filter; 'overdue' is computed as sent with a past payment deadline,
 * 'open' covers all sent statements that are not paid yet (overdue included)
 */
export function statusCondition(status: string) {
	const today = swissToday();
	if (status === 'open') return eq(utilityStatements.status, 'sent');
	if (status === 'overdue') {
		return and(eq(utilityStatements.status, 'sent'), lt(utilityStatements.paymentDeadline, today));
	}
	if (status === 'sent') {
		// 'sent' excludes overdue (sent with past deadline)
		return and(
			eq(utilityStatements.status, 'sent'),
			or(gte(utilityStatements.paymentDeadline, today), sql`${utilityStatements.paymentDeadline} IS NULL`)
		);
	}
	return eq(utilityStatements.status, status);
}

/**
 * Where conditions for listStatements; tenant and building columns come from its joins
 */
function statementFilterConditions(filters: StatementFilters) {
	const { search, contractId, buildingId, apartmentId, tenantId, status, periodStart, periodEnd } = filters;
	return [
		search &&
			or(
				ilike(utilityStatements.statementNumber, `%${search}%`),
				ilike(sql`${tenants.firstName} || ' ' || ${tenants.lastName}`, `%${search}%`)
			),
		contractId && eq(utilityStatements.contractId, contractId),
		apartmentId && eq(utilityStatements.apartmentId, apartmentId),
		tenantId && eq(utilityStatements.tenantId, tenantId),
		buildingId && eq(apartments.buildingId, buildingId),
		status && statusCondition(status),
		periodStart && gte(utilityStatements.periodStart, periodStart),
		periodEnd && lte(utilityStatements.periodEnd, periodEnd)
	].filter((condition) => !!condition);
}

/**
 * List statements with optional filters and pagination
 */
export async function listStatements(filters: StatementFilters = {}): Promise<{
	statements: StatementWithDetails[];
	total: number;
}> {
	const { limit = 20, offset = 0 } = filters;

	const conditions = statementFilterConditions(filters);

	const whereClause = and(...conditions);

	// Build the query with joins
	const results = await db
		.select({
			statement: statementColumns,
			tenant: {
				id: tenants.id,
				firstName: tenants.firstName,
				lastName: tenants.lastName,
				email: tenants.email
			},
			apartment: {
				id: apartments.id,
				number: apartments.number,
				floor: apartments.floor,
				area: apartments.area
			},
			building: {
				id: buildings.id,
				name: buildings.name,
				address: buildings.address
			}
		})
		.from(utilityStatements)
		.leftJoin(tenants, eq(utilityStatements.tenantId, tenants.id))
		.leftJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.where(whereClause)
		.orderBy(desc(utilityStatements.statementDate), desc(utilityStatements.createdAt), desc(utilityStatements.id))
		.limit(limit)
		.offset(offset);

	// Batch load all line items for the fetched statements (avoids N+1 query)
	const statementIds = results.map((r) => r.statement.id);
	const allLineItems =
		statementIds.length > 0
			? await db
					.select()
					.from(utilityStatementLineItems)
					.where(inArray(utilityStatementLineItems.statementId, statementIds))
					.orderBy(utilityStatementLineItems.statementId, utilityStatementLineItems.sortOrder)
			: [];

	// Group line items by statement ID for quick lookup
	const lineItemsByStatementId = new Map<string, typeof allLineItems>();
	for (const item of allLineItems) {
		const existing = lineItemsByStatementId.get(item.statementId) || [];
		existing.push(item);
		lineItemsByStatementId.set(item.statementId, existing);
	}

	// Build results with line items and compute effective status
	const today = swissToday();
	const statementsWithLineItems: StatementWithDetails[] = results.map((row) => {
		// Compute effective status: if sent and past deadline, show as overdue
		const effectiveStatus =
			row.statement.status === 'sent' &&
			row.statement.paymentDeadline &&
			row.statement.paymentDeadline < today
				? 'overdue'
				: row.statement.status;

		return {
			...row.statement,
			status: effectiveStatus,
			tenant: row.tenant,
			apartment: row.apartment,
			building: row.building,
			lineItems: lineItemsByStatementId.get(row.statement.id) || []
		};
	});

	// Get total count
	const [{ count: total }] = await db
		.select({ count: sql<number>`count(*)` })
		.from(utilityStatements)
		.leftJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
		.leftJoin(tenants, eq(utilityStatements.tenantId, tenants.id))
		.where(whereClause);

	return {
		statements: statementsWithLineItems,
		total: Number(total)
	};
}

/**
 * Get a single statement by ID with all related data
 */
export async function getStatement(id: string): Promise<StatementWithDetails | null> {
	const [result] = await db
		.select({
			statement: statementColumns,
			tenant: {
				id: tenants.id,
				firstName: tenants.firstName,
				lastName: tenants.lastName,
				email: tenants.email,
				correspondenceChannel: tenants.correspondenceChannel,
				language: tenants.language,
				address: tenants.address,
				postalCode: tenants.postalCode,
				city: tenants.city,
				country: tenants.country
			},
			apartment: {
				id: apartments.id,
				number: apartments.number,
				floor: apartments.floor,
				area: apartments.area
			},
			building: {
				id: buildings.id,
				name: buildings.name,
				address: buildings.address,
				postalCode: buildings.postalCode,
				city: buildings.city
			},
			// the profile the heating costs were spread with, named in the UI language (A-10)
			heatingProfile: {
				id: heatingProfiles.id,
				name: heatingProfiles.name,
				nameDE: heatingProfiles.nameDE,
				nameFR: heatingProfiles.nameFR,
				nameIT: heatingProfiles.nameIT,
				nameEN: heatingProfiles.nameEN
			}
		})
		.from(utilityStatements)
		.leftJoin(tenants, eq(utilityStatements.tenantId, tenants.id))
		.leftJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.leftJoin(heatingProfiles, eq(utilityStatements.heatingProfileId, heatingProfiles.id))
		.where(eq(utilityStatements.id, id))
		.limit(1);

	if (!result) return null;

	// Get line items
	const lineItems = await db
		.select()
		.from(utilityStatementLineItems)
		.where(eq(utilityStatementLineItems.statementId, id))
		.orderBy(utilityStatementLineItems.sortOrder);

	// Compute effective status: if sent and past deadline, show as overdue
	const today = swissToday();
	const effectiveStatus =
		result.statement.status === 'sent' &&
		result.statement.paymentDeadline &&
		result.statement.paymentDeadline < today
			? 'overdue'
			: result.statement.status;

	return {
		...result.statement,
		status: effectiveStatus,
		tenant: result.tenant,
		apartment: result.apartment,
		building: result.building,
		heatingProfile: result.heatingProfile,
		lineItems
	};
}

/** Parameters of a statement calculation; the management fee overrides the configured default */
export interface StatementInput {
	contractId: string;
	periodStart: string;
	periodEnd: string;
	heatingProfileId?: string;
	managementFeePercent?: number;
}

/** Calculate a contract's statement for a period without storing it */
export const calculateStatement = (input: StatementInput) =>
	calculateStatementForContract(
		input.contractId,
		new Date(input.periodStart),
		new Date(input.periodEnd),
		input.heatingProfileId,
		input.managementFeePercent
	);

/** Calculate a contract's statement and store it as a draft with its line items */
export async function generateStatement(
	input: StatementInput & { buildingId: string }
): Promise<StatementWithDetails> {
	const calculation = await calculateStatement(input);
	const statementNumber = await generateStatementNumber(
		input.buildingId,
		new Date(input.periodEnd)
	);

	const paymentDeadlineDays = await getTypedConfig('payment_deadline_days');
	const statementDate = swissToday();

	return createStatement(
		{
			tenantId: calculation.tenantId,
			apartmentId: calculation.apartmentId,
			contractId: input.contractId,
			statementNumber,
			periodStart: input.periodStart,
			periodEnd: input.periodEnd,
			statementDate,
			rentalDays: calculation.rentalDays,
			rentalStart: calculation.rentalStart,
			rentalEnd: calculation.rentalEnd,
			totalCosts: String(calculation.totalCosts),
			totalAdvancePayments: String(calculation.totalAdvancePayments),
			managementFee: String(calculation.managementFee),
			managementFeePercent: String(calculation.managementFeePercent),
			heatingProfileId: input.heatingProfileId || null,
			heatingShare: calculation.heating,
			fuelStock: (await fuelStockChange(input.buildingId, input.periodStart, input.periodEnd))[0]?.stock ?? null,
			keyValues: await keyValuesOf(input.buildingId, calculation.apartmentId),
			balance: String(calculation.balance),
			status: 'draft',
			paymentDeadline: daysAfter(statementDate, paymentDeadlineDays)
		},
		calculation.lineItems.map((item, index) => ({
			categoryId: item.categoryId,
			distributionKeyId: item.distributionKeyId,
			description: item.description,
			totalAmount: String(item.totalBuildingAmount),
			tenantShare: String(item.tenantShare),
			// Share column next to building total and tenant share: the tenant's share of the building total
			sharePercentage: item.totalBuildingAmount ? String((item.tenantShare / item.totalBuildingAmount) * 100) : '0',
			apartmentShare: String(item.apartmentShare),
			periodShare: String(item.periodShare),
			positionRentalDays: item.positionRentalDays,
			billedDays: item.billedDays,
			invoiceParts: item.invoiceParts,
			invoices: item.invoices,
			sortOrder: index
		}))
	);
}

/**
 * Create a new statement
 */
export async function createStatement(
	data: NewUtilityStatement,
	lineItems: Omit<NewUtilityStatementLineItem, 'statementId'>[] = []
): Promise<StatementWithDetails> {
	// Statement and line items are written together or not at all
	const statement = await db.transaction(async (tx) => {
		const [statement] = await tx.insert(utilityStatements).values(data).returning();
		if (lineItems.length > 0) {
			await tx.insert(utilityStatementLineItems).values(
				lineItems.map((item, index) => ({
					...item,
					statementId: statement.id,
					sortOrder: item.sortOrder ?? index
				}))
			);
		}
		return statement;
	});

	// Fetch and return with details
	const result = await getStatement(statement.id);
	if (!result) {
		throw new Error('Failed to fetch created statement');
	}

	return result;
}

/**
 * Update an existing statement
 */
export async function updateStatement(
	id: string,
	data: Partial<NewUtilityStatement>
): Promise<StatementWithDetails | null> {
	// Check if statement exists
	const existing = await getStatement(id);
	if (!existing) return null;

	// Once sent, the amounts stay as the tenant received them
	if (existing.status !== 'draft') {
		const protectedFields = ['totalCosts', 'totalAdvancePayments', 'managementFeePercent', 'managementFee', 'balance'];
		for (const field of protectedFields) {
			if (field in data) {
				throw new Error(`Cannot modify ${field} for a statement that is no longer a draft`);
			}
		}
	}

	// The PDF prints date and payment deadline; a change discards it, it is made again. Once paid, the PDF as sent stays
	const pdfOutdated =
		(data.paymentDeadline !== undefined && data.paymentDeadline !== existing.paymentDeadline) ||
		(data.statementDate !== undefined && data.statementDate !== existing.statementDate);

	// Update the statement
	const [updated] = await db
		.update(utilityStatements)
		.set({ ...data, ...(pdfOutdated && { pdfBlob: null, pdfGeneratedAt: null }), updatedAt: new Date() })
		.where(eq(utilityStatements.id, id))
		.returning();

	if (!updated) return null;

	return await getStatement(id);
}

/** The apartment's and the building's area, apartments and rooms: what a simple distribution key divides by */
export async function keyValuesOf(buildingId: string, apartmentId: string): Promise<KeyValues | null> {
	const { apartments: all } = await listApartments({ buildingId, limit: 1000 });
	const own = all.find((apartment) => apartment.id === apartmentId);
	if (!own) return null;
	const pair = (value: (apartment: (typeof all)[number]) => number): [number, number] => [value(own), all.reduce((sum, apartment) => sum + value(apartment), 0)];
	return { area: pair((a) => parseFloat(a.area)), units: pair(() => 1), rooms: pair((a) => parseFloat(a.rooms)) };
}

/** A statement goes out dated on the day it is sent (Swiss time), with the full payment deadline, never a shorter one */
export async function datedToday(paymentDeadline: string | null) {
	const statementDate = swissToday();
	const due = daysAfter(statementDate, await getTypedConfig('payment_deadline_days'));
	return { statementDate, paymentDeadline: paymentDeadline && paymentDeadline > due ? paymentDeadline : due };
}

/**
 * Update statement status
 */
export async function updateStatementStatus(
	id: string,
	status: 'draft' | 'sent' | 'paid' | 'overdue',
	additionalData?: {
		paidDate?: string;
		paidAmount?: string;
		reminderSentDate?: string;
	}
): Promise<StatementWithDetails | null> {
	const existing = await getStatement(id);
	if (!existing) return null;

	// Validate status transitions; overdue is not set, it follows from the passed payment deadline
	const validTransitions: Record<string, string[]> = {
		draft: ['sent'],
		sent: ['paid'],
		overdue: ['paid'],
		paid: []
	};

	if (!validTransitions[existing.status]?.includes(status)) {
		throw new Error(`Invalid status transition from ${existing.status} to ${status}`);
	}

	if (status === 'paid' && additionalData?.paidDate !== undefined) checkPaidDate(additionalData.paidDate, existing.statementDate);
	const sentToday = status === 'sent' && (await datedToday(existing.paymentDeadline));
	// A Saldo of 0 (often after the rounding to 5 Rappen) is settled once sent: nothing to pay or to pay back
	const settled = sentToday && parseFloat(existing.balance) === 0 && { status: 'paid', paidDate: sentToday.statementDate };
	const updateData: Partial<NewUtilityStatement> = {
		status,
		...additionalData,
		...sentToday,
		...settled,
		// the PDF as sent is made anew after sending, with the tenant and settings then, not a draft's of earlier (review C-9)
		...(sentToday && { pdfBlob: null, pdfGeneratedAt: null })
	};
	// paid without an amount: the Saldo, as the tenant pays it or gets it back (#93)
	if (updateData.status === 'paid') Object.assign(updateData, { paidAmount: updateData.paidAmount ?? existing.balance, paymentRecordedAt: new Date() });

	return updateStatement(id, updateData);
}

// #138: a day that exists, from the Abrechnungsdatum (for a sent statement the day it was sent) up to today
function checkPaidDate(paidDate: string, statementDate: string) {
	if (!isRealDate(paidDate)) throw new CodedError('PAID_DATE_INVALID', 'Invalid payment date', { date: paidDate });
	if (paidDate < statementDate) throw new CodedError('PAID_DATE_BEFORE_STATEMENT', 'Payment date before the statement date', { date: statementDate });
	const today = swissToday();
	if (paidDate > today) throw new CodedError('PAID_DATE_IN_FUTURE', 'Payment date in the future', { date: today });
}

/**
 * Take back a recorded payment (#92): back to sent (overdue once the payment deadline has passed), paid date and amount
 * cleared, the reset kept for the Verlauf; a PDF made after the payment was recorded confirms it: it is discarded and made again as sent
 */
export async function resetPayment(id: string): Promise<StatementWithDetails> {
	const existing = await getStatement(id);
	if (!existing) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (existing.status !== 'paid') throw new CodedError('STATEMENT_NOT_PAID', 'Statement is not paid');
	const reset = { resetOn: swissToday(), paidDate: existing.paidDate, paidAmount: existing.paidAmount };
	// only a PDF made after the payment was recorded says so; the one made before stays, with its row in the Verlauf
	const { pdfGeneratedAt, paymentRecordedAt } = existing;
	const paidPdf = pdfGeneratedAt && paymentRecordedAt && pdfGeneratedAt >= paymentRecordedAt;
	return (await updateStatement(id, {
		status: 'sent',
		paidDate: null,
		paidAmount: null,
		paymentRecordedAt: null,
		paymentResets: [...existing.paymentResets, reset],
		...(paidPdf && { pdfBlob: null, pdfGeneratedAt: null })
	}))!;
}

/**
 * Delete a statement
 */
export async function deleteStatement(id: string): Promise<{ success: boolean } & Partial<Refusal>> {
	const existing = await getStatement(id);
	if (!existing) {
		return { success: false, ...refusal('STATEMENT_NOT_FOUND', 'Statement not found') };
	}

	// Only a draft may be deleted; once sent, the statement stays as the tenant received it
	if (existing.status !== 'draft') {
		return { success: false, ...refusal('STATEMENT_NOT_DRAFT', 'Cannot delete a statement that is no longer a draft') };
	}

	// Delete line items first (cascade should handle this, but be explicit)
	await db.delete(utilityStatementLineItems).where(eq(utilityStatementLineItems.statementId, id));

	// Delete the statement
	await db.delete(utilityStatements).where(eq(utilityStatements.id, id));

	return { success: true };
}

/**
 * Add line items to a statement
 */
export async function addLineItems(
	statementId: string,
	items: Omit<NewUtilityStatementLineItem, 'statementId'>[]
): Promise<UtilityStatementLineItem[]> {
	const statement = await getStatement(statementId);
	if (!statement) {
		throw new Error('Statement not found');
	}

	if (statement.status !== 'draft') {
		throw new Error('Cannot add line items to a statement that is no longer a draft');
	}

	// Get current max sort order
	const [maxOrder] = await db
		.select({ maxOrder: sql<number>`COALESCE(MAX(sort_order), 0)` })
		.from(utilityStatementLineItems)
		.where(eq(utilityStatementLineItems.statementId, statementId));

	const startOrder = (maxOrder?.maxOrder || 0) + 1;

	const lineItems = await db
		.insert(utilityStatementLineItems)
		.values(
			items.map((item, index) => ({
				...item,
				statementId,
				sortOrder: item.sortOrder ?? startOrder + index
			}))
		)
		.returning();

	return lineItems;
}

/**
 * Statements per status, over the same filters as the list (all but the status itself),
 * so the status tabs count what the list can show
 */
export async function getStatementCountsByStatus(filters: Omit<StatementFilters, 'status'> = {}): Promise<{
	draft: number;
	sent: number;
	paid: number;
	overdue: number;
	total: number;
}> {
	const counted = (status: string) => sql<number>`count(*) filter (where ${statusCondition(status)})`;
	const [row] = await db
		.select({
			draft: counted('draft'),
			sent: counted('sent'),
			paid: counted('paid'),
			overdue: counted('overdue'),
			total: sql<number>`count(*)`
		})
		.from(utilityStatements)
		.leftJoin(tenants, eq(utilityStatements.tenantId, tenants.id))
		.leftJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
		.where(and(...statementFilterConditions(filters)));

	return {
		draft: Number(row.draft),
		sent: Number(row.sent),
		paid: Number(row.paid),
		overdue: Number(row.overdue),
		total: Number(row.total)
	};
}

