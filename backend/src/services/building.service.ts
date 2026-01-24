/**
 * Building Service
 * Business logic for building operations
 */

import { eq, ilike, or, sql, desc } from 'drizzle-orm';
import { db } from '../db/connection';
import { buildings, apartments, type Building, type NewBuilding } from '../db/schema';

export interface BuildingFilters {
	search?: string;
	city?: string;
	canton?: string;
	limit?: number;
	offset?: number;
}

export interface BuildingWithStats extends Building {
	apartmentCount: number;
	occupiedCount: number;
	vacantCount: number;
}

/**
 * List buildings with optional filters and pagination
 */
export async function listBuildings(filters: BuildingFilters = {}): Promise<{
	buildings: BuildingWithStats[];
	total: number;
}> {
	const { search, city, canton, limit = 20, offset = 0 } = filters;

	// Build where conditions
	const conditions = [];

	if (search) {
		conditions.push(
			or(
				ilike(buildings.name, `%${search}%`),
				ilike(buildings.address, `%${search}%`),
				ilike(buildings.city, `%${search}%`)
			)
		);
	}

	if (city) {
		conditions.push(ilike(buildings.city, `%${city}%`));
	}

	if (canton) {
		conditions.push(eq(buildings.canton, canton.toUpperCase()));
	}

	// Get buildings with apartment stats using subquery
	const buildingsQuery = db
		.select({
			id: buildings.id,
			name: buildings.name,
			address: buildings.address,
			postalCode: buildings.postalCode,
			city: buildings.city,
			canton: buildings.canton,
			country: buildings.country,
			latitude: buildings.latitude,
			longitude: buildings.longitude,
			buildingType: buildings.buildingType,
			yearBuilt: buildings.yearBuilt,
			createdAt: buildings.createdAt,
			updatedAt: buildings.updatedAt,
			apartmentCount: sql<number>`(SELECT COUNT(*) FROM apartments WHERE apartments.building_id = ${buildings.id})`.as(
				'apartment_count'
			),
			occupiedCount: sql<number>`(SELECT COUNT(*) FROM apartments WHERE apartments.building_id = ${buildings.id} AND apartments.status = 'occupied')`.as(
				'occupied_count'
			),
			vacantCount: sql<number>`(SELECT COUNT(*) FROM apartments WHERE apartments.building_id = ${buildings.id} AND apartments.status = 'vacant')`.as(
				'vacant_count'
			)
		})
		.from(buildings)
		.orderBy(desc(buildings.updatedAt))
		.limit(limit)
		.offset(offset);

	// Apply conditions if any
	const results =
		conditions.length > 0
			? await buildingsQuery.where(conditions.length === 1 ? conditions[0] : sql`${conditions[0]}`)
			: await buildingsQuery;

	// Get total count
	const countQuery = db.select({ count: sql<number>`count(*)` }).from(buildings);

	const [{ count: total }] =
		conditions.length > 0
			? await countQuery.where(conditions.length === 1 ? conditions[0] : sql`${conditions[0]}`)
			: await countQuery;

	return {
		buildings: results as BuildingWithStats[],
		total: Number(total)
	};
}

/**
 * Get a single building by ID with apartment list
 */
export async function getBuilding(id: string): Promise<BuildingWithStats | null> {
	const [building] = await db
		.select({
			id: buildings.id,
			name: buildings.name,
			address: buildings.address,
			postalCode: buildings.postalCode,
			city: buildings.city,
			canton: buildings.canton,
			country: buildings.country,
			latitude: buildings.latitude,
			longitude: buildings.longitude,
			buildingType: buildings.buildingType,
			yearBuilt: buildings.yearBuilt,
			createdAt: buildings.createdAt,
			updatedAt: buildings.updatedAt,
			apartmentCount: sql<number>`(SELECT COUNT(*) FROM apartments WHERE apartments.building_id = ${buildings.id})`.as(
				'apartment_count'
			),
			occupiedCount: sql<number>`(SELECT COUNT(*) FROM apartments WHERE apartments.building_id = ${buildings.id} AND apartments.status = 'occupied')`.as(
				'occupied_count'
			),
			vacantCount: sql<number>`(SELECT COUNT(*) FROM apartments WHERE apartments.building_id = ${buildings.id} AND apartments.status = 'vacant')`.as(
				'vacant_count'
			)
		})
		.from(buildings)
		.where(eq(buildings.id, id))
		.limit(1);

	return (building as BuildingWithStats) || null;
}

/**
 * Get building with its apartments
 */
export async function getBuildingWithApartments(id: string): Promise<{
	building: BuildingWithStats;
	apartments: typeof apartments.$inferSelect[];
} | null> {
	const building = await getBuilding(id);
	if (!building) return null;

	const buildingApartments = await db
		.select()
		.from(apartments)
		.where(eq(apartments.buildingId, id))
		.orderBy(apartments.floor, apartments.number);

	return {
		building,
		apartments: buildingApartments
	};
}

/**
 * Create a new building
 */
export async function createBuilding(data: NewBuilding): Promise<Building> {
	const [building] = await db.insert(buildings).values(data).returning();
	return building;
}

/**
 * Update an existing building
 */
export async function updateBuilding(
	id: string,
	data: Partial<NewBuilding>
): Promise<Building | null> {
	const [building] = await db
		.update(buildings)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(buildings.id, id))
		.returning();

	return building || null;
}

/**
 * Delete a building
 * Returns false if building has apartments (cascade delete would remove them)
 */
export async function deleteBuilding(id: string): Promise<{ success: boolean; error?: string }> {
	// Check for apartments
	const [apartmentCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(apartments)
		.where(eq(apartments.buildingId, id));

	if (Number(apartmentCount.count) > 0) {
		return {
			success: false,
			error: `Cannot delete building with ${apartmentCount.count} apartments. Delete apartments first.`
		};
	}

	const result = await db.delete(buildings).where(eq(buildings.id, id)).returning();

	if (result.length === 0) {
		return { success: false, error: 'Building not found' };
	}

	return { success: true };
}

/**
 * Check if a building exists
 */
export async function buildingExists(id: string): Promise<boolean> {
	const [result] = await db
		.select({ id: buildings.id })
		.from(buildings)
		.where(eq(buildings.id, id))
		.limit(1);

	return !!result;
}
