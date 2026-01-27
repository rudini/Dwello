/**
 * Statement Service
 * Business logic for utility statement operations
 */

import { eq, sql, desc, and, gte, lte, ilike, or } from 'drizzle-orm';
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

export interface StatementWithDetails extends UtilityStatement {
	tenant: { id: string; firstName: string; lastName: string; email: string | null } | null;
	apartment: { id: string; number: string; floor: number; area: string } | null;
	building: { id: string; name: string; address: string } | null;
	lineItems: UtilityStatementLineItem[];
}

/**
 * List statements with optional filters and pagination
 */
export async function listStatements(filters: StatementFilters = {}): Promise<{
	statements: StatementWithDetails[];
	total: number;
}> {
	const {
		search,
		buildingId,
		apartmentId,
		tenantId,
		status,
		periodStart,
		periodEnd,
		limit = 20,
		offset = 0
	} = filters;

	// Build where conditions
	const conditions = [];

	if (search) {
		conditions.push(
			or(
				ilike(utilityStatements.statementNumber, `%${search}%`),
				ilike(tenants.firstName, `%${search}%`),
				ilike(tenants.lastName, `%${search}%`)
			)
		);
	}

	if (apartmentId) {
		conditions.push(eq(utilityStatements.apartmentId, apartmentId));
	}

	if (tenantId) {
		conditions.push(eq(utilityStatements.tenantId, tenantId));
	}

	if (status) {
		conditions.push(eq(utilityStatements.status, status));
	}

	if (periodStart) {
		conditions.push(gte(utilityStatements.periodStart, periodStart));
	}

	if (periodEnd) {
		conditions.push(lte(utilityStatements.periodEnd, periodEnd));
	}

	// Build the query with joins
	let query = db
		.select({
			statement: utilityStatements,
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
		.orderBy(desc(utilityStatements.statementDate), desc(utilityStatements.createdAt))
		.limit(limit)
		.offset(offset);

	// Filter by buildingId through apartments
	if (buildingId) {
		conditions.push(eq(apartments.buildingId, buildingId));
	}

	// Apply conditions
	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	const results = whereClause ? await query.where(whereClause) : await query;

	// Get line items for each statement
	const statementsWithLineItems: StatementWithDetails[] = await Promise.all(
		results.map(async (row) => {
			const lineItems = await db
				.select()
				.from(utilityStatementLineItems)
				.where(eq(utilityStatementLineItems.statementId, row.statement.id))
				.orderBy(utilityStatementLineItems.sortOrder);

			return {
				...row.statement,
				tenant: row.tenant,
				apartment: row.apartment,
				building: row.building,
				lineItems
			};
		})
	);

	// Get total count
	let countQuery = db
		.select({ count: sql<number>`count(*)` })
		.from(utilityStatements)
		.leftJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
		.leftJoin(tenants, eq(utilityStatements.tenantId, tenants.id));

	const [{ count: total }] = whereClause
		? await countQuery.where(whereClause)
		: await countQuery;

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
			statement: utilityStatements,
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
		.where(eq(utilityStatements.id, id))
		.limit(1);

	if (!result) return null;

	// Get line items
	const lineItems = await db
		.select()
		.from(utilityStatementLineItems)
		.where(eq(utilityStatementLineItems.statementId, id))
		.orderBy(utilityStatementLineItems.sortOrder);

	return {
		...result.statement,
		tenant: result.tenant,
		apartment: result.apartment,
		building: result.building,
		lineItems
	};
}

/**
 * Create a new statement
 */
export async function createStatement(
	data: NewUtilityStatement,
	lineItems: Omit<NewUtilityStatementLineItem, 'statementId'>[] = []
): Promise<StatementWithDetails> {
	// Insert the statement
	const [statement] = await db
		.insert(utilityStatements)
		.values(data)
		.returning();

	// Insert line items if provided
	if (lineItems.length > 0) {
		await db.insert(utilityStatementLineItems).values(
			lineItems.map((item, index) => ({
				...item,
				statementId: statement.id,
				sortOrder: item.sortOrder ?? index
			}))
		);
	}

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

	// Update the statement
	const [updated] = await db
		.update(utilityStatements)
		.set({ ...data, updatedAt: new Date() })
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
 */
export async function getStatementCountsByStatus(buildingId?: string): Promise<{
	draft: number;
	sent: number;
	paid: number;
	overdue: number;
	total: number;
}> {
	const counts = {
		draft: 0,
		sent: 0,
		paid: 0,
		overdue: 0,
		total: 0
	};

	let results: { status: string; count: number }[];

	if (buildingId) {
		results = await db
			.select({
				status: utilityStatements.status,
				count: sql<number>`count(*)`
			})
			.from(utilityStatements)
			.leftJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
			.where(eq(apartments.buildingId, buildingId))
			.groupBy(utilityStatements.status);
	} else {
		results = await db
			.select({
				status: utilityStatements.status,
				count: sql<number>`count(*)`
			})
			.from(utilityStatements)
			.groupBy(utilityStatements.status);
	}

	for (const row of results) {
		if (row.status in counts) {
			counts[row.status as keyof typeof counts] = Number(row.count);
		}
		counts.total += Number(row.count);
	}

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
