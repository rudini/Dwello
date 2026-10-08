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
	type UtilityStatement,
	type NewUtilityStatement,
	type UtilityStatementLineItem,
	type NewUtilityStatementLineItem
} from '../db/schema';
import { calculateStatementForContract, generateStatementNumber } from './calculation.service';
import { getTypedConfig } from './config.service';

export interface StatementFilters {
	search?: string;
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
const { pdfBlob: _pdfBlob, ...statementColumns } = getTableColumns(utilityStatements);

export interface StatementWithDetails extends Omit<UtilityStatement, 'pdfBlob'> {
	tenant: { id: string; firstName: string; lastName: string; email: string | null; language?: string } | null;
	apartment: { id: string; number: string; floor: number; area: string } | null;
	building: { id: string; name: string; address: string } | null;
	lineItems: UtilityStatementLineItem[];
}

/**
 * Status filter; 'overdue' is computed as sent with a past payment deadline,
 * 'open' covers all sent statements that are not paid yet (overdue included)
 */
export function statusCondition(status: string) {
	const today = new Date().toISOString().split('T')[0];
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
	const { search, buildingId, apartmentId, tenantId, status, periodStart, periodEnd } = filters;
	return [
		search &&
			or(
				ilike(utilityStatements.statementNumber, `%${search}%`),
				ilike(sql`${tenants.firstName} || ' ' || ${tenants.lastName}`, `%${search}%`)
			),
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
		.orderBy(desc(utilityStatements.statementDate), desc(utilityStatements.createdAt))
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
	const today = new Date().toISOString().split('T')[0];
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
				language: tenants.language
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
	const today = new Date().toISOString().split('T')[0];
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
	managementFeeDistributionKeyId?: string;
}

/** Calculate a contract's statement for a period without storing it */
export const calculateStatement = (input: StatementInput) =>
	calculateStatementForContract(
		input.contractId,
		new Date(input.periodStart),
		new Date(input.periodEnd),
		input.heatingProfileId,
		input.managementFeePercent,
		input.managementFeeDistributionKeyId
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
	const statementDate = new Date();
	const paymentDeadline = new Date(statementDate);
	paymentDeadline.setDate(paymentDeadline.getDate() + paymentDeadlineDays);

	return createStatement(
		{
			tenantId: calculation.tenantId,
			apartmentId: calculation.apartmentId,
			contractId: input.contractId,
			statementNumber,
			periodStart: input.periodStart,
			periodEnd: input.periodEnd,
			statementDate: statementDate.toISOString().split('T')[0],
			rentalDays: calculation.rentalDays,
			totalCosts: String(calculation.totalCosts),
			totalAdvancePayments: String(calculation.totalAdvancePayments),
			managementFee: String(calculation.managementFee),
			managementFeePercent: String(calculation.managementFeePercent),
			balance: String(calculation.balance),
			status: 'draft',
			paymentDeadline: paymentDeadline.toISOString().split('T')[0]
		},
		calculation.lineItems.map((item, index) => ({
			categoryId: item.categoryId,
			distributionKeyId: item.distributionKeyId,
			description: item.description,
			totalAmount: String(item.totalBuildingAmount),
			tenantShare: String(item.tenantShare),
			// Share column next to building total and tenant share: the tenant's share of the building total
			sharePercentage: item.totalBuildingAmount ? String((item.tenantShare / item.totalBuildingAmount) * 100) : '0',
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

	// Don't allow editing certain fields if statement is sent or paid
	if (['sent', 'paid'].includes(existing.status)) {
		const protectedFields = ['totalCosts', 'totalAdvancePayments', 'managementFee', 'balance'];
		for (const field of protectedFields) {
			if (field in data) {
				throw new Error(`Cannot modify ${field} for sent or paid statements`);
			}
		}
	}

	// The PDF prints the payment deadline; a changed deadline discards it so it can be generated again
	const pdfOutdated = data.paymentDeadline !== undefined && data.paymentDeadline !== existing.paymentDeadline;

	// Update the statement
	const [updated] = await db
		.update(utilityStatements)
		.set({ ...data, ...(pdfOutdated && { pdfBlob: null, pdfGeneratedAt: null }), updatedAt: new Date() })
		.where(eq(utilityStatements.id, id))
		.returning();

	if (!updated) return null;

	return await getStatement(id);
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

	// Validate status transitions
	const validTransitions: Record<string, string[]> = {
		draft: ['sent'],
		sent: ['paid', 'overdue'],
		overdue: ['paid'],
		paid: []
	};

	if (!validTransitions[existing.status]?.includes(status)) {
		throw new Error(`Invalid status transition from ${existing.status} to ${status}`);
	}

	const updateData: Partial<NewUtilityStatement> = {
		status,
		...additionalData
	};

	return updateStatement(id, updateData);
}

/**
 * Delete a statement
 */
export async function deleteStatement(id: string): Promise<{ success: boolean; error?: string }> {
	const existing = await getStatement(id);
	if (!existing) {
		return { success: false, error: 'Statement not found' };
	}

	// Don't allow deleting sent or paid statements
	if (['sent', 'paid'].includes(existing.status)) {
		return { success: false, error: 'Cannot delete sent or paid statements' };
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

	if (['sent', 'paid'].includes(statement.status)) {
		throw new Error('Cannot add line items to sent or paid statements');
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
 * Get statements for a building in a period
 */
export async function getStatementsForBuilding(
	buildingId: string,
	periodStart: string,
	periodEnd: string
): Promise<StatementWithDetails[]> {
	const { statements } = await listStatements({
		buildingId,
		periodStart,
		periodEnd,
		limit: 1000
	});

	return statements;
}

/**
 * Check if a statement exists
 */
export async function statementExists(id: string): Promise<boolean> {
	const [result] = await db
		.select({ id: utilityStatements.id })
		.from(utilityStatements)
		.where(eq(utilityStatements.id, id))
		.limit(1);

	return !!result;
}

/**
 * Get statement count by status for a building
 * Note: overdue is calculated dynamically (status='sent' AND payment_deadline < today)
 * Note: sent count excludes overdue statements
 */
export async function getStatementCountsByStatus(buildingId?: string): Promise<{
	draft: number;
	sent: number;
	paid: number;
	overdue: number;
	total: number;
}> {
	const today = new Date().toISOString().split('T')[0];

	const counts = {
		draft: 0,
		sent: 0,
		paid: 0,
		overdue: 0,
		total: 0
	};

	// Base condition for building filter
	const buildingCondition = buildingId
		? eq(apartments.buildingId, buildingId)
		: undefined;

	// Query for draft and paid (straightforward status counts)
	const baseQuery = buildingId
		? db.select({ status: utilityStatements.status, count: sql<number>`count(*)` })
				.from(utilityStatements)
				.leftJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
				.where(buildingCondition)
				.groupBy(utilityStatements.status)
		: db.select({ status: utilityStatements.status, count: sql<number>`count(*)` })
				.from(utilityStatements)
				.groupBy(utilityStatements.status);

	const results = await baseQuery;

	for (const row of results) {
		if (row.status === 'draft' || row.status === 'paid') {
			counts[row.status] = Number(row.count);
		}
		counts.total += Number(row.count);
	}

	// Calculate overdue count (sent statements past payment deadline)
	const overdueConditions = [
		eq(utilityStatements.status, 'sent'),
		lt(utilityStatements.paymentDeadline, today)
	];
	if (buildingCondition) overdueConditions.push(buildingCondition);

	const overdueQuery = buildingId
		? db.select({ count: sql<number>`count(*)` })
				.from(utilityStatements)
				.leftJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
				.where(and(...overdueConditions))
		: db.select({ count: sql<number>`count(*)` })
				.from(utilityStatements)
				.where(and(eq(utilityStatements.status, 'sent'), lt(utilityStatements.paymentDeadline, today)));

	const [overdueResult] = await overdueQuery;
	counts.overdue = Number(overdueResult?.count ?? 0);

	// Calculate sent count (sent statements NOT past deadline)
	const sentConditions = [
		eq(utilityStatements.status, 'sent'),
		or(
			gte(utilityStatements.paymentDeadline, today),
			sql`${utilityStatements.paymentDeadline} IS NULL`
		)
	];
	if (buildingCondition) sentConditions.push(buildingCondition);

	const sentQuery = buildingId
		? db.select({ count: sql<number>`count(*)` })
				.from(utilityStatements)
				.leftJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
				.where(and(...sentConditions))
		: db.select({ count: sql<number>`count(*)` })
				.from(utilityStatements)
				.where(and(
					eq(utilityStatements.status, 'sent'),
					or(
						gte(utilityStatements.paymentDeadline, today),
						sql`${utilityStatements.paymentDeadline} IS NULL`
					)
				));

	const [sentResult] = await sentQuery;
	counts.sent = Number(sentResult?.count ?? 0);

	return counts;
}

/**
 * Get overdue statements
 */
export async function getOverdueStatements(): Promise<StatementWithDetails[]> {
	const today = new Date().toISOString().split('T')[0];

	const { statements } = await listStatements({
		status: 'sent',
		limit: 1000
	});

	return statements.filter(
		(s) => s.paymentDeadline && s.paymentDeadline < today
	);
}

/**
 * Mark overdue statements
 */
export async function markOverdueStatements(): Promise<number> {
	const overdueStatements = await getOverdueStatements();
	let marked = 0;

	for (const statement of overdueStatements) {
		try {
			await updateStatementStatus(statement.id, 'overdue');
			marked++;
		} catch {
			// Skip if status transition not valid
		}
	}

	return marked;
}
