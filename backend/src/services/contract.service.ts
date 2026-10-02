/**
 * Contract Service
 * Business logic for rental contract operations
 */

import { eq, and, or, sql, desc, gte, lte, isNull, ilike } from 'drizzle-orm';
import { db } from '../db/connection';
import {
	rentalContracts,
	apartments,
	tenants,
	buildings,
	utilityStatements,
	type RentalContract,
	type NewRentalContract
} from '../db/schema';
import { apartmentStatus } from './apartment.service';

export interface ContractFilters {
	apartmentId?: string;
	tenantId?: string;
	buildingId?: string;
	status?: 'active' | 'ended' | 'future';
	search?: string;
	limit?: number;
	offset?: number;
}

export interface ContractWithDetails extends RentalContract {
	tenantName: string;
	tenantEmail: string | null;
	apartmentNumber: string;
	buildingName: string;
	buildingAddress: string;
}

/**
 * List contracts with optional filters
 */
export async function listContracts(filters: ContractFilters = {}): Promise<{
	contracts: ContractWithDetails[];
	total: number;
}> {
	const { apartmentId, tenantId, buildingId, status, search, limit = 50, offset = 0 } = filters;
	const today = new Date().toISOString().split('T')[0];

	// Build conditions
	const conditions = [];

	if (apartmentId) {
		conditions.push(eq(rentalContracts.apartmentId, apartmentId));
	}

	if (tenantId) {
		conditions.push(eq(rentalContracts.tenantId, tenantId));
	}

	if (buildingId) {
		conditions.push(eq(apartments.buildingId, buildingId));
	}

	if (search) {
		const pattern = `%${search}%`;
		conditions.push(
			or(
				ilike(sql`${tenants.firstName} || ' ' || ${tenants.lastName}`, pattern),
				ilike(apartments.number, pattern),
				ilike(buildings.name, pattern)
			)
		);
	}

	if (status === 'active') {
		conditions.push(
			and(
				lte(rentalContracts.startDate, today),
				or(isNull(rentalContracts.endDate), gte(rentalContracts.endDate, today))
			)
		);
	} else if (status === 'ended') {
		conditions.push(
			and(sql`${rentalContracts.endDate} IS NOT NULL`, sql`${rentalContracts.endDate} < ${today}`)
		);
	} else if (status === 'future') {
		conditions.push(sql`${rentalContracts.startDate} > ${today}`);
	}

	// Query with tenant and apartment info
	const query = db
		.select({
			id: rentalContracts.id,
			apartmentId: rentalContracts.apartmentId,
			tenantId: rentalContracts.tenantId,
			startDate: rentalContracts.startDate,
			endDate: rentalContracts.endDate,
			baseRent: rentalContracts.baseRent,
			additionalRent: rentalContracts.additionalRent,
			monthlyAdvancePayment: rentalContracts.monthlyAdvancePayment,
			referenceIndex: rentalContracts.referenceIndex,
			contractPdf: rentalContracts.contractPdf,
			notes: rentalContracts.notes,
			createdAt: rentalContracts.createdAt,
			updatedAt: rentalContracts.updatedAt,
			tenantName: sql<string>`${tenants.firstName} || ' ' || ${tenants.lastName}`,
			tenantEmail: tenants.email,
			apartmentNumber: apartments.number,
			buildingName: buildings.name,
			buildingAddress: buildings.address
		})
		.from(rentalContracts)
		.leftJoin(tenants, eq(rentalContracts.tenantId, tenants.id))
		.leftJoin(apartments, eq(rentalContracts.apartmentId, apartments.id))
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.orderBy(desc(rentalContracts.startDate))
		.limit(limit)
		.offset(offset);

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	const results = whereClause ? await query.where(whereClause) : await query;

	// Get total count
	const countQuery = db
		.select({ count: sql<number>`count(*)` })
		.from(rentalContracts)
		.leftJoin(tenants, eq(rentalContracts.tenantId, tenants.id))
		.leftJoin(apartments, eq(rentalContracts.apartmentId, apartments.id))
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id));

	const [{ count: total }] = whereClause
		? await countQuery.where(whereClause)
		: await countQuery;

	return {
		contracts: results as ContractWithDetails[],
		total: Number(total)
	};
}

/**
 * Get a single contract by ID
 */
export async function getContract(id: string): Promise<ContractWithDetails | null> {
	const [contract] = await db
		.select({
			id: rentalContracts.id,
			apartmentId: rentalContracts.apartmentId,
			tenantId: rentalContracts.tenantId,
			startDate: rentalContracts.startDate,
			endDate: rentalContracts.endDate,
			baseRent: rentalContracts.baseRent,
			additionalRent: rentalContracts.additionalRent,
			monthlyAdvancePayment: rentalContracts.monthlyAdvancePayment,
			referenceIndex: rentalContracts.referenceIndex,
			contractPdf: rentalContracts.contractPdf,
			notes: rentalContracts.notes,
			createdAt: rentalContracts.createdAt,
			updatedAt: rentalContracts.updatedAt,
			tenantName: sql<string>`${tenants.firstName} || ' ' || ${tenants.lastName}`,
			tenantEmail: tenants.email,
			apartmentNumber: apartments.number,
			buildingName: buildings.name,
			buildingAddress: buildings.address,
			tenant: {
				id: tenants.id,
				firstName: tenants.firstName,
				lastName: tenants.lastName,
				email: tenants.email,
				phone: tenants.phone,
				language: tenants.language
			},
			apartment: {
				id: apartments.id,
				buildingId: apartments.buildingId,
				number: apartments.number,
				floor: apartments.floor,
				area: apartments.area,
				rooms: apartments.rooms,
				status: apartmentStatus
			},
			building: {
				id: buildings.id,
				name: buildings.name,
				address: buildings.address,
				postalCode: buildings.postalCode,
				city: buildings.city,
				canton: buildings.canton
			}
		})
		.from(rentalContracts)
		.leftJoin(tenants, eq(rentalContracts.tenantId, tenants.id))
		.leftJoin(apartments, eq(rentalContracts.apartmentId, apartments.id))
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.where(eq(rentalContracts.id, id))
		.limit(1);

	return (contract as ContractWithDetails) || null;
}

/**
 * Check for overlapping contracts for an apartment
 */
export async function checkContractOverlap(
	apartmentId: string,
	startDate: string,
	endDate: string | null,
	excludeContractId?: string
): Promise<{ hasOverlap: boolean; overlappingContract?: string }> {
	// A contract overlaps if:
	// - Its start date is before the new contract's end date (or new has no end)
	// - Its end date is after the new contract's start date (or existing has no end)
	const conditions = [
		eq(rentalContracts.apartmentId, apartmentId),
		or(
			isNull(rentalContracts.endDate),
			gte(rentalContracts.endDate, startDate)
		),
		endDate
			? lte(rentalContracts.startDate, endDate)
			: sql`1=1` // If no end date, any future contract overlaps
	];

	if (excludeContractId) {
		conditions.push(sql`${rentalContracts.id} != ${excludeContractId}`);
	}

	const [overlapping] = await db
		.select({ id: rentalContracts.id })
		.from(rentalContracts)
		.where(and(...conditions))
		.limit(1);

	return {
		hasOverlap: !!overlapping,
		overlappingContract: overlapping?.id
	};
}

/**
 * Get the active contract for an apartment at a specific date
 */
export async function getActiveContract(
	apartmentId: string,
	date: string
): Promise<ContractWithDetails | null> {
	const [contract] = await db
		.select({
			id: rentalContracts.id,
			apartmentId: rentalContracts.apartmentId,
			tenantId: rentalContracts.tenantId,
			startDate: rentalContracts.startDate,
			endDate: rentalContracts.endDate,
			baseRent: rentalContracts.baseRent,
			additionalRent: rentalContracts.additionalRent,
			monthlyAdvancePayment: rentalContracts.monthlyAdvancePayment,
			referenceIndex: rentalContracts.referenceIndex,
			contractPdf: rentalContracts.contractPdf,
			notes: rentalContracts.notes,
			createdAt: rentalContracts.createdAt,
			updatedAt: rentalContracts.updatedAt,
			tenantName: sql<string>`${tenants.firstName} || ' ' || ${tenants.lastName}`,
			tenantEmail: tenants.email,
			apartmentNumber: apartments.number,
			buildingName: buildings.name,
			buildingAddress: buildings.address
		})
		.from(rentalContracts)
		.leftJoin(tenants, eq(rentalContracts.tenantId, tenants.id))
		.leftJoin(apartments, eq(rentalContracts.apartmentId, apartments.id))
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.where(
			and(
				eq(rentalContracts.apartmentId, apartmentId),
				lte(rentalContracts.startDate, date),
				or(isNull(rentalContracts.endDate), gte(rentalContracts.endDate, date))
			)
		)
		.limit(1);

	return (contract as ContractWithDetails) || null;
}

/**
 * Get all contracts for an apartment within a period
 * Used for utility statement generation with prorating
 */
export async function getContractsByPeriod(
	apartmentId: string,
	periodStart: string,
	periodEnd: string
): Promise<ContractWithDetails[]> {
	// A contract is in the period if:
	// - It starts before or during the period AND
	// - It ends during or after the period (or has no end date)
	const contracts = await db
		.select({
			id: rentalContracts.id,
			apartmentId: rentalContracts.apartmentId,
			tenantId: rentalContracts.tenantId,
			startDate: rentalContracts.startDate,
			endDate: rentalContracts.endDate,
			baseRent: rentalContracts.baseRent,
			additionalRent: rentalContracts.additionalRent,
			monthlyAdvancePayment: rentalContracts.monthlyAdvancePayment,
			referenceIndex: rentalContracts.referenceIndex,
			contractPdf: rentalContracts.contractPdf,
			notes: rentalContracts.notes,
			createdAt: rentalContracts.createdAt,
			updatedAt: rentalContracts.updatedAt,
			tenantName: sql<string>`${tenants.firstName} || ' ' || ${tenants.lastName}`,
			tenantEmail: tenants.email,
			apartmentNumber: apartments.number,
			buildingName: buildings.name,
			buildingAddress: buildings.address
		})
		.from(rentalContracts)
		.leftJoin(tenants, eq(rentalContracts.tenantId, tenants.id))
		.leftJoin(apartments, eq(rentalContracts.apartmentId, apartments.id))
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.where(
			and(
				eq(rentalContracts.apartmentId, apartmentId),
				lte(rentalContracts.startDate, periodEnd),
				or(isNull(rentalContracts.endDate), gte(rentalContracts.endDate, periodStart))
			)
		)
		.orderBy(rentalContracts.startDate);

	return contracts as ContractWithDetails[];
}

/**
 * Create a new contract
 */
export async function createContract(data: NewRentalContract): Promise<RentalContract> {
	// Check for overlapping contracts
	const { hasOverlap, overlappingContract } = await checkContractOverlap(
		data.apartmentId,
		data.startDate,
		data.endDate || null
	);

	if (hasOverlap) {
		throw new Error(`Contract overlaps with existing contract ${overlappingContract}`);
	}

	const [contract] = await db.insert(rentalContracts).values(data).returning();


	return contract;
}

/**
 * Update an existing contract
 */
export async function updateContract(
	id: string,
	data: Partial<NewRentalContract>
): Promise<RentalContract | null> {
	// Get current contract to check apartment
	const current = await getContract(id);
	if (!current) return null;

	// If dates are being updated, check for overlaps
	if (data.startDate || data.endDate !== undefined) {
		const startDate = data.startDate || current.startDate;
		const endDate = data.endDate !== undefined ? data.endDate : current.endDate;

		const { hasOverlap, overlappingContract } = await checkContractOverlap(
			current.apartmentId,
			startDate,
			endDate,
			id
		);

		if (hasOverlap) {
			throw new Error(`Contract would overlap with existing contract ${overlappingContract}`);
		}
	}

	const [contract] = await db
		.update(rentalContracts)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(rentalContracts.id, id))
		.returning();


	return contract || null;
}

/**
 * Delete a contract
 * Returns false if contract has associated statements
 */
export async function deleteContract(id: string): Promise<{ success: boolean; error?: string }> {
	// Get contract to find apartment
	const contract = await getContract(id);
	if (!contract) {
		return { success: false, error: 'Contract not found' };
	}

	// Check for statements
	const [statement] = await db
		.select({ id: utilityStatements.id })
		.from(utilityStatements)
		.where(eq(utilityStatements.contractId, id))
		.limit(1);

	if (statement) {
		return {
			success: false,
			error: 'Cannot delete contract with utility statements'
		};
	}

	const result = await db.delete(rentalContracts).where(eq(rentalContracts.id, id)).returning();

	if (result.length === 0) {
		return { success: false, error: 'Contract not found' };
	}


	return { success: true };
}

/**
 * Check if a contract exists
 */
export async function contractExists(id: string): Promise<boolean> {
	const [result] = await db
		.select({ id: rentalContracts.id })
		.from(rentalContracts)
		.where(eq(rentalContracts.id, id))
		.limit(1);

	return !!result;
}
