/**
 * Tenant Service
 * Business logic for tenant operations
 */

import { eq, ilike, or, sql, desc, and, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import {
	tenants,
	rentalContracts,
	apartments,
	buildings,
	type Tenant,
	type NewTenant
} from '../db/schema';

export interface TenantFilters {
	search?: string;
	language?: string;
	hasActiveContract?: boolean;
	limit?: number;
	offset?: number;
}

export interface TenantWithOccupancy extends Tenant {
	currentApartment?: string;
	currentBuilding?: string;
	contractCount: number;
}

/**
 * List tenants with optional filters
 */
export async function listTenants(filters: TenantFilters = {}): Promise<{
	tenants: TenantWithOccupancy[];
	total: number;
}> {
	const { search, language, limit = 50, offset = 0 } = filters;

	// Build conditions
	const conditions = [];

	if (search) {
		conditions.push(
			or(
				ilike(tenants.firstName, `%${search}%`),
				ilike(tenants.lastName, `%${search}%`),
				ilike(tenants.email, `%${search}%`)
			)
		);
	}

	if (language) {
		conditions.push(eq(tenants.language, language));
	}

	// Query with current occupancy
	const query = db
		.select({
			id: tenants.id,
			firstName: tenants.firstName,
			lastName: tenants.lastName,
			email: tenants.email,
			phone: tenants.phone,
			language: tenants.language,
			address: tenants.address,
			postalCode: tenants.postalCode,
			city: tenants.city,
			createdAt: tenants.createdAt,
			updatedAt: tenants.updatedAt,
			contractCount: sql<number>`(SELECT COUNT(*) FROM rental_contracts WHERE rental_contracts.tenant_id = ${tenants.id})`.as(
				'contract_count'
			)
		})
		.from(tenants)
		.orderBy(tenants.lastName, tenants.firstName)
		.limit(limit)
		.offset(offset);

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	const results = whereClause ? await query.where(whereClause) : await query;

	// Get total count
	const countQuery = db.select({ count: sql<number>`count(*)` }).from(tenants);
	const [{ count: total }] = whereClause
		? await countQuery.where(whereClause)
		: await countQuery;

	// Batch load current occupancy for all tenants (avoids N+1 query)
	const tenantIds = results.map((t) => t.id);
	const today = new Date().toISOString().split('T')[0];

	const currentContracts =
		tenantIds.length > 0
			? await db
					.select({
						tenantId: rentalContracts.tenantId,
						apartmentNumber: apartments.number,
						buildingName: buildings.name
					})
					.from(rentalContracts)
					.leftJoin(apartments, eq(rentalContracts.apartmentId, apartments.id))
					.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
					.where(
						and(
							inArray(rentalContracts.tenantId, tenantIds),
							sql`${rentalContracts.startDate} <= ${today}`,
							sql`(${rentalContracts.endDate} IS NULL OR ${rentalContracts.endDate} >= ${today})`
						)
					)
			: [];

	// Create a map of tenant ID to their current occupancy
	const occupancyByTenantId = new Map(
		currentContracts.map((c) => [
			c.tenantId,
			{ apartmentNumber: c.apartmentNumber, buildingName: c.buildingName }
		])
	);

	// Build results with occupancy data
	const tenantsWithOccupancy: TenantWithOccupancy[] = results.map((tenant) => {
		const occupancy = occupancyByTenantId.get(tenant.id);
		return {
			...tenant,
			currentApartment: occupancy?.apartmentNumber,
			currentBuilding: occupancy?.buildingName
		} as TenantWithOccupancy;
	});

	return {
		tenants: tenantsWithOccupancy,
		total: Number(total)
	};
}

/**
 * Get a single tenant by ID
 */
export async function getTenant(id: string): Promise<TenantWithOccupancy | null> {
	const [tenant] = await db
		.select({
			id: tenants.id,
			firstName: tenants.firstName,
			lastName: tenants.lastName,
			email: tenants.email,
			phone: tenants.phone,
			language: tenants.language,
			address: tenants.address,
			postalCode: tenants.postalCode,
			city: tenants.city,
			createdAt: tenants.createdAt,
			updatedAt: tenants.updatedAt,
			contractCount: sql<number>`(SELECT COUNT(*) FROM rental_contracts WHERE rental_contracts.tenant_id = ${tenants.id})`.as(
				'contract_count'
			)
		})
		.from(tenants)
		.where(eq(tenants.id, id))
		.limit(1);

	if (!tenant) return null;

	// Get current occupancy
	const today = new Date().toISOString().split('T')[0];
	const [currentContract] = await db
		.select({
			apartmentNumber: apartments.number,
			buildingName: buildings.name
		})
		.from(rentalContracts)
		.leftJoin(apartments, eq(rentalContracts.apartmentId, apartments.id))
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.where(
			and(
				eq(rentalContracts.tenantId, id),
				sql`${rentalContracts.startDate} <= ${today}`,
				sql`(${rentalContracts.endDate} IS NULL OR ${rentalContracts.endDate} >= ${today})`
			)
		)
		.limit(1);

	return {
		...tenant,
		currentApartment: currentContract?.apartmentNumber,
		currentBuilding: currentContract?.buildingName
	} as TenantWithOccupancy;
}

/**
 * Get tenant with contract history
 */
export async function getTenantWithHistory(id: string): Promise<{
	tenant: TenantWithOccupancy;
	contracts: Array<{
		id: string;
		apartmentNumber: string;
		buildingName: string;
		startDate: string;
		endDate: string | null;
		baseRent: string;
		isActive: boolean;
	}>;
} | null> {
	const tenant = await getTenant(id);
	if (!tenant) return null;

	const today = new Date().toISOString().split('T')[0];

	const contracts = await db
		.select({
			id: rentalContracts.id,
			apartmentNumber: apartments.number,
			buildingName: buildings.name,
			startDate: rentalContracts.startDate,
			endDate: rentalContracts.endDate,
			baseRent: rentalContracts.baseRent
		})
		.from(rentalContracts)
		.leftJoin(apartments, eq(rentalContracts.apartmentId, apartments.id))
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.where(eq(rentalContracts.tenantId, id))
		.orderBy(desc(rentalContracts.startDate));

	return {
		tenant,
		contracts: contracts.map((c) => ({
			...c,
			apartmentNumber: c.apartmentNumber || '',
			buildingName: c.buildingName || '',
			isActive:
				c.startDate <= today && (c.endDate === null || c.endDate >= today)
		})) as Array<{
			id: string;
			apartmentNumber: string;
			buildingName: string;
			startDate: string;
			endDate: string | null;
			baseRent: string;
			isActive: boolean;
		}>
	};
}

/**
 * Create a new tenant
 */
export async function createTenant(data: NewTenant): Promise<Tenant> {
	const [tenant] = await db.insert(tenants).values(data).returning();
	return tenant;
}

/**
 * Update an existing tenant
 */
export async function updateTenant(id: string, data: Partial<NewTenant>): Promise<Tenant | null> {
	const [tenant] = await db
		.update(tenants)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(tenants.id, id))
		.returning();

	return tenant || null;
}

/**
 * Delete a tenant
 * Returns false if tenant has active contracts
 */
export async function deleteTenant(id: string): Promise<{ success: boolean; error?: string }> {
	// Check for active contracts
	const today = new Date().toISOString().split('T')[0];
	const [activeContract] = await db
		.select({ id: rentalContracts.id })
		.from(rentalContracts)
		.where(
			and(
				eq(rentalContracts.tenantId, id),
				sql`(${rentalContracts.endDate} IS NULL OR ${rentalContracts.endDate} >= ${today})`
			)
		)
		.limit(1);

	if (activeContract) {
		return {
			success: false,
			error: 'Cannot delete tenant with active contract'
		};
	}

	// Check for any contracts (even ended ones have statements)
	const [anyContract] = await db
		.select({ id: rentalContracts.id })
		.from(rentalContracts)
		.where(eq(rentalContracts.tenantId, id))
		.limit(1);

	if (anyContract) {
		return {
			success: false,
			error: 'Cannot delete tenant with contract history. Archive instead.'
		};
	}

	const result = await db.delete(tenants).where(eq(tenants.id, id)).returning();

	if (result.length === 0) {
		return { success: false, error: 'Tenant not found' };
	}

	return { success: true };
}

/**
 * Check if a tenant exists
 */
export async function tenantExists(id: string): Promise<boolean> {
	const [result] = await db
		.select({ id: tenants.id })
		.from(tenants)
		.where(eq(tenants.id, id))
		.limit(1);

	return !!result;
}
