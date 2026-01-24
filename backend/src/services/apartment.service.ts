/**
 * Apartment Service
 * Business logic for apartment operations
 */

import { eq, and, sql, desc } from 'drizzle-orm';
import { db } from '../db/connection';
import {
	apartments,
	buildings,
	rentalContracts,
	tenants,
	type Apartment,
	type NewApartment
} from '../db/schema';

export interface ApartmentFilters {
	buildingId?: string;
	status?: 'occupied' | 'vacant' | 'reserved';
	floor?: number;
	limit?: number;
	offset?: number;
}

export interface ApartmentWithDetails extends Apartment {
	buildingName?: string;
	currentTenantName?: string;
	currentContractId?: string;
}

/**
 * List apartments with optional filters
 */
export async function listApartments(filters: ApartmentFilters = {}): Promise<{
	apartments: ApartmentWithDetails[];
	total: number;
}> {
	const { buildingId, status, floor, limit = 50, offset = 0 } = filters;

	// Build conditions
	const conditions = [];

	if (buildingId) {
		conditions.push(eq(apartments.buildingId, buildingId));
	}

	if (status) {
		conditions.push(eq(apartments.status, status));
	}

	if (floor !== undefined) {
		conditions.push(eq(apartments.floor, floor));
	}

	// Query with building name and current tenant
	const query = db
		.select({
			id: apartments.id,
			buildingId: apartments.buildingId,
			number: apartments.number,
			floor: apartments.floor,
			area: apartments.area,
			rooms: apartments.rooms,
			status: apartments.status,
			createdAt: apartments.createdAt,
			updatedAt: apartments.updatedAt,
			buildingName: buildings.name
		})
		.from(apartments)
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.orderBy(buildings.name, apartments.floor, apartments.number)
		.limit(limit)
		.offset(offset);

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	const results = whereClause ? await query.where(whereClause) : await query;

	// Get total count
	const countQuery = db.select({ count: sql<number>`count(*)` }).from(apartments);

	const [{ count: total }] = whereClause
		? await countQuery.where(whereClause)
		: await countQuery;

	return {
		apartments: results as ApartmentWithDetails[],
		total: Number(total)
	};
}

/**
 * Get a single apartment with current tenant info
 */
export async function getApartment(id: string): Promise<ApartmentWithDetails | null> {
	const [apartment] = await db
		.select({
			id: apartments.id,
			buildingId: apartments.buildingId,
			number: apartments.number,
			floor: apartments.floor,
			area: apartments.area,
			rooms: apartments.rooms,
			status: apartments.status,
			createdAt: apartments.createdAt,
			updatedAt: apartments.updatedAt,
			buildingName: buildings.name
		})
		.from(apartments)
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.where(eq(apartments.id, id))
		.limit(1);

	if (!apartment) return null;

	// Get current tenant if occupied
	const today = new Date().toISOString().split('T')[0];
	const [currentContract] = await db
		.select({
			contractId: rentalContracts.id,
			tenantName: sql<string>`${tenants.firstName} || ' ' || ${tenants.lastName}`
		})
		.from(rentalContracts)
		.leftJoin(tenants, eq(rentalContracts.tenantId, tenants.id))
		.where(
			and(
				eq(rentalContracts.apartmentId, id),
				sql`${rentalContracts.startDate} <= ${today}`,
				sql`(${rentalContracts.endDate} IS NULL OR ${rentalContracts.endDate} >= ${today})`
			)
		)
		.limit(1);

	return {
		...apartment,
		currentTenantName: currentContract?.tenantName,
		currentContractId: currentContract?.contractId
	} as ApartmentWithDetails;
}

/**
 * Get apartment with full details including contract history
 */
export async function getApartmentWithHistory(id: string): Promise<{
	apartment: ApartmentWithDetails;
	contracts: Array<{
		id: string;
		tenantName: string;
		startDate: string;
		endDate: string | null;
		baseRent: string;
	}>;
} | null> {
	const apartment = await getApartment(id);
	if (!apartment) return null;

	const contracts = await db
		.select({
			id: rentalContracts.id,
			tenantName: sql<string>`${tenants.firstName} || ' ' || ${tenants.lastName}`,
			startDate: rentalContracts.startDate,
			endDate: rentalContracts.endDate,
			baseRent: rentalContracts.baseRent
		})
		.from(rentalContracts)
		.leftJoin(tenants, eq(rentalContracts.tenantId, tenants.id))
		.where(eq(rentalContracts.apartmentId, id))
		.orderBy(desc(rentalContracts.startDate));

	return {
		apartment,
		contracts: contracts as Array<{
			id: string;
			tenantName: string;
			startDate: string;
			endDate: string | null;
			baseRent: string;
		}>
	};
}

/**
 * Create a new apartment
 */
export async function createApartment(data: NewApartment): Promise<Apartment> {
	const [apartment] = await db.insert(apartments).values(data).returning();
	return apartment;
}

/**
 * Update an existing apartment
 */
export async function updateApartment(
	id: string,
	data: Partial<NewApartment>
): Promise<Apartment | null> {
	const [apartment] = await db
		.update(apartments)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(apartments.id, id))
		.returning();

	return apartment || null;
}

/**
 * Delete an apartment
 * Returns false if apartment has active contracts
 */
export async function deleteApartment(id: string): Promise<{ success: boolean; error?: string }> {
	// Check for active contracts
	const today = new Date().toISOString().split('T')[0];
	const [activeContract] = await db
		.select({ id: rentalContracts.id })
		.from(rentalContracts)
		.where(
			and(
				eq(rentalContracts.apartmentId, id),
				sql`(${rentalContracts.endDate} IS NULL OR ${rentalContracts.endDate} >= ${today})`
			)
		)
		.limit(1);

	if (activeContract) {
		return {
			success: false,
			error: 'Cannot delete apartment with active contract'
		};
	}

	const result = await db.delete(apartments).where(eq(apartments.id, id)).returning();

	if (result.length === 0) {
		return { success: false, error: 'Apartment not found' };
	}

	return { success: true };
}

/**
 * Update apartment status based on contracts
 */
export async function updateApartmentStatus(id: string): Promise<void> {
	const today = new Date().toISOString().split('T')[0];

	const [activeContract] = await db
		.select({ id: rentalContracts.id })
		.from(rentalContracts)
		.where(
			and(
				eq(rentalContracts.apartmentId, id),
				sql`${rentalContracts.startDate} <= ${today}`,
				sql`(${rentalContracts.endDate} IS NULL OR ${rentalContracts.endDate} >= ${today})`
			)
		)
		.limit(1);

	await db
		.update(apartments)
		.set({
			status: activeContract ? 'occupied' : 'vacant',
			updatedAt: new Date()
		})
		.where(eq(apartments.id, id));
}

/**
 * Check if an apartment exists
 */
export async function apartmentExists(id: string): Promise<boolean> {
	const [result] = await db
		.select({ id: apartments.id })
		.from(apartments)
		.where(eq(apartments.id, id))
		.limit(1);

	return !!result;
}
