/**
 * Apartment Service
 * Business logic for apartment operations
 */

import { eq, and, ilike, or, sql, desc } from 'drizzle-orm';
import { db } from '../db/connection';
import {
	apartments,
	buildings,
	rentalContracts,
	tenants,
	type Apartment,
	type NewApartment
} from '../db/schema';
import { sqlToday, swissToday } from './today';

export type ApartmentStatus = 'occupied' | 'relet' | 'vacant' | 'reserved';

/** First day of the next rental contract that has not started yet */
const nextContractStart = sql<string | null>`(
	select min(c.start_date)::text from rental_contracts c
	where c.apartment_id = "apartments"."id" and c.start_date > ${sqlToday}
)`;

/** Last day of the rental contract that runs today, null without one or when it has no end */
const currentContractEnd = sql<string | null>`(
	select c.end_date::text from rental_contracts c
	where c.apartment_id = "apartments"."id"
		and c.start_date <= ${sqlToday}
		and (c.end_date is null or c.end_date >= ${sqlToday})
	limit 1
)`;

/**
 * Occupied while a rental contract runs today; relet when only a future contract is signed;
 * otherwise as the property manager set it (vacant or reserved).
 * Computed on every read, so it is right on the day a contract starts or ends.
 * The outer columns are named explicitly: drizzle leaves them unqualified in single-table selects.
 */
export const apartmentStatus = sql<ApartmentStatus>`(case
	when exists (
		select 1 from rental_contracts c
		where c.apartment_id = "apartments"."id"
			and c.start_date <= ${sqlToday}
			and (c.end_date is null or c.end_date >= ${sqlToday})
	) then 'occupied'
	when ${nextContractStart} is not null then 'relet'
	else "apartments"."status"
end)`;

export interface ApartmentFilters {
	search?: string;
	buildingId?: string;
	status?: ApartmentStatus;
	floor?: number;
	limit?: number;
	offset?: number;
}

export interface ApartmentWithDetails extends Apartment {
	buildingName?: string;
	building?: {
		id: string;
		name: string | null;
		address: string | null;
		postalCode: string | null;
		city: string | null;
	};
	currentTenantName?: string;
	currentContractId?: string;
	nextContractStart?: string | null;
	currentContractEnd?: string | null;
}

/**
 * List apartments with optional filters
 */
export async function listApartments(filters: ApartmentFilters = {}): Promise<{
	apartments: ApartmentWithDetails[];
	total: number;
}> {
	const { search, buildingId, status, floor, limit = 50, offset = 0 } = filters;

	// Build conditions
	const conditions = [];

	if (search) {
		conditions.push(or(ilike(apartments.number, `%${search}%`), ilike(buildings.name, `%${search}%`)));
	}

	if (buildingId) {
		conditions.push(eq(apartments.buildingId, buildingId));
	}

	if (status) {
		conditions.push(sql`${apartmentStatus} = ${status}`);
	}

	if (floor !== undefined) {
		conditions.push(eq(apartments.floor, floor));
	}

	const whereClause = and(...conditions);

	// Query with building name and current tenant
	const results = await db
		.select({
			id: apartments.id,
			buildingId: apartments.buildingId,
			number: apartments.number,
			floor: apartments.floor,
			area: apartments.area,
			rooms: apartments.rooms,
			status: apartmentStatus,
			nextContractStart,
			currentContractEnd,
			createdAt: apartments.createdAt,
			updatedAt: apartments.updatedAt,
			buildingName: buildings.name
		})
		.from(apartments)
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.where(whereClause)
		.orderBy(buildings.name, apartments.floor, apartments.number)
		.limit(limit)
		.offset(offset);

	// Get total count
	const [{ count: total }] = await db
		.select({ count: sql<number>`count(*)` })
		.from(apartments)
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.where(whereClause);

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
			status: apartmentStatus,
			nextContractStart,
			currentContractEnd,
			createdAt: apartments.createdAt,
			updatedAt: apartments.updatedAt,
			buildingName: buildings.name,
			buildingAddress: buildings.address,
			buildingPostalCode: buildings.postalCode,
			buildingCity: buildings.city
		})
		.from(apartments)
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.where(eq(apartments.id, id))
		.limit(1);

	if (!apartment) return null;

	// Get current tenant if occupied
	const today = swissToday();
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
		building: {
			id: apartment.buildingId,
			name: apartment.buildingName,
			address: apartment.buildingAddress,
			postalCode: apartment.buildingPostalCode,
			city: apartment.buildingCity
		},
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
	const today = swissToday();
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
