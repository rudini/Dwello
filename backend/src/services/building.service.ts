/**
 * Building Service
 * Business logic for building operations
 */

import { eq, ilike, or, sql, desc, and, inArray } from 'drizzle-orm';
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

	// Get buildings first
	const buildingsQuery = db
		.select()
		.from(buildings)
		.orderBy(desc(buildings.updatedAt))
		.limit(limit)
		.offset(offset);

	// Apply conditions if any
	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	const buildingResults = whereClause
		? await buildingsQuery.where(whereClause)
		: await buildingsQuery;

	// Get apartment counts for all buildings
	const buildingIds = buildingResults.map((b) => b.id);

	const apartmentCounts = buildingIds.length > 0
		? await db
				.select({
					buildingId: apartments.buildingId,
					total: sql<number>`count(*)`,
					occupied: sql<number>`count(*) filter (where status = 'occupied')`,
					vacant: sql<number>`count(*) filter (where status = 'vacant')`
				})
				.from(apartments)
				.where(inArray(apartments.buildingId, buildingIds))
				.groupBy(apartments.buildingId)
		: [];

	// Create a map for quick lookup
	const countsMap = new Map(
		apartmentCounts.map((c) => [
			c.buildingId,
			{ total: Number(c.total), occupied: Number(c.occupied), vacant: Number(c.vacant) }
		])
	);

	// Combine buildings with their counts
	const results: BuildingWithStats[] = buildingResults.map((b) => {
		const counts = countsMap.get(b.id) || { total: 0, occupied: 0, vacant: 0 };
		return {
			...b,
			apartmentCount: counts.total,
			occupiedCount: counts.occupied,
			vacantCount: counts.vacant
		};
	});

	// Get total count
	const countQuery = db.select({ count: sql<number>`count(*)` }).from(buildings);

	const [{ count: total }] = whereClause
		? await countQuery.where(whereClause)
		: await countQuery;

	return {
		buildings: results,
		total: Number(total)
	};
}

/**
 * Get a single building by ID with apartment list
 */
export async function getBuilding(id: string): Promise<BuildingWithStats | null> {
	// First get the building
	const [building] = await db
		.select()
		.from(buildings)
		.where(eq(buildings.id, id))
		.limit(1);

	if (!building) return null;

	// Get apartment counts separately for reliability
	const [counts] = await db
		.select({
			total: sql<number>`count(*)`,
			occupied: sql<number>`count(*) filter (where status = 'occupied')`,
			vacant: sql<number>`count(*) filter (where status = 'vacant')`
		})
		.from(apartments)
		.where(eq(apartments.buildingId, id));

	return {
		...building,
		apartmentCount: Number(counts?.total ?? 0),
		occupiedCount: Number(counts?.occupied ?? 0),
		vacantCount: Number(counts?.vacant ?? 0)
	};
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
