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
import { CodedError } from './coded-error';

/** Contract with the names of its tenant, apartment and building; selected with those three tables joined */
const contractFields = {
	id: rentalContracts.id,
	apartmentId: rentalContracts.apartmentId,
	tenantId: rentalContracts.tenantId,
	startDate: rentalContracts.startDate,
	endDate: rentalContracts.endDate,
	terminated: rentalContracts.terminated,
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
};

/** Contracts with their tenant, apartment and building, as contractFields */
function selectContracts() {
	return db
		.select(contractFields)
		.from(rentalContracts)
		.leftJoin(tenants, eq(rentalContracts.tenantId, tenants.id))
		.leftJoin(apartments, eq(rentalContracts.apartmentId, apartments.id))
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id));
}

/** Contracts of an apartment running at some point between two dates (open-ended ones included) */
function apartmentContractsBetween(apartmentId: string, from: string, to: string) {
	return and(
		eq(rentalContracts.apartmentId, apartmentId),
		lte(rentalContracts.startDate, to),
		or(isNull(rentalContracts.endDate), gte(rentalContracts.endDate, from))
	);
}

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

	const whereClause = and(...conditions);

	// Query with tenant and apartment info
	const results = await selectContracts()
		.where(whereClause)
		.orderBy(desc(rentalContracts.startDate), desc(rentalContracts.id))
		.limit(limit)
		.offset(offset);

	// Get total count
	const countQuery = db
		.select({ count: sql<number>`count(*)` })
		.from(rentalContracts)
		.leftJoin(tenants, eq(rentalContracts.tenantId, tenants.id))
		.leftJoin(apartments, eq(rentalContracts.apartmentId, apartments.id))
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id));

	const [{ count: total }] = await countQuery.where(whereClause);

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
			...contractFields,
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
async function checkContractOverlap(
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
	const [contract] = await selectContracts()
		.where(apartmentContractsBetween(apartmentId, date, date))
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
	const contracts = await selectContracts()
		.where(apartmentContractsBetween(apartmentId, periodStart, periodEnd))
		.orderBy(rentalContracts.startDate);

	return contracts as ContractWithDetails[];
}

/** A notice is given for a Kündigungstermin: without an end there is nothing to give notice for */
function checkNotice(terminated: boolean | undefined, endDate: string | null | undefined) {
	if (terminated && !endDate) throw new CodedError('CONTRACT_NOTICE_WITHOUT_END', 'A notice needs an end date');
}

/**
 * Create a new contract
 */
export async function createContract(data: NewRentalContract): Promise<RentalContract> {
	checkNotice(data.terminated, data.endDate);
	// Check for overlapping contracts
	const { hasOverlap, overlappingContract } = await checkContractOverlap(
		data.apartmentId,
		data.startDate,
		data.endDate || null
	);

	if (hasOverlap) {
		throw new CodedError('CONTRACT_OVERLAP', `Contract overlaps with existing contract ${overlappingContract}`, {
			contract: overlappingContract!
		});
	}

	const [contract] = await db.insert(rentalContracts).values(data).returning();


	return contract;
}

/** The contract's statements whose billed rent days the new dates would change (fewer or more) */
async function statementsChanged(contractId: string, startDate: string, endDate: string | null) {
	const from = sql`greatest(${utilityStatements.periodStart}, ${startDate}::date)`;
	const to = sql`least(${utilityStatements.periodEnd}, coalesce(${endDate}::date, ${utilityStatements.periodEnd}))`;
	return db
		.select({
			id: utilityStatements.id,
			statementNumber: utilityStatements.statementNumber,
			status: utilityStatements.status,
			periodStart: utilityStatements.periodStart,
			periodEnd: utilityStatements.periodEnd,
			buildingId: apartments.buildingId // to create the statement anew in the wizard (A-10)
		})
		.from(utilityStatements)
		.innerJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
		.where(
			and(
				eq(utilityStatements.contractId, contractId),
				or(sql`${from} <> ${utilityStatements.rentalStart}`, sql`${to} <> ${utilityStatements.rentalEnd}`)
			)
		);
}

/** New contract dates that would change the rent days billed by a stored statement of the contract */
export class BilledDaysError extends Error {
	constructor(readonly statements: Awaited<ReturnType<typeof statementsChanged>>) {
		super('Contract dates change the rent days billed by its utility statements');
	}
}

/** New dates may neither overlap another contract of the apartment nor change the billed Mietstage of a statement */
async function checkNewDates(current: RentalContract, data: Partial<NewRentalContract>) {
	if (!data.startDate && data.endDate === undefined) return;
	const startDate = data.startDate || current.startDate;
	const endDate = data.endDate !== undefined ? data.endDate : current.endDate;
	const { hasOverlap, overlappingContract } = await checkContractOverlap(current.apartmentId, startDate, endDate, current.id);
	if (hasOverlap)
		throw new CodedError('CONTRACT_OVERLAP', `Contract would overlap with existing contract ${overlappingContract}`, {
			contract: overlappingContract!
		});
	const statements = await statementsChanged(current.id, startDate, endDate);
	if (statements.length) throw new BilledDaysError(statements);
}

/**
 * Update an existing contract
 */
export async function updateContract(
	id: string,
	data: Partial<NewRentalContract>
): Promise<RentalContract | null> {
	const current = await getContract(id);
	if (!current) return null;
	// removing the end withdraws the notice (below), whatever flag comes with it
	if (data.endDate !== null) checkNotice(data.terminated, data.endDate ?? current.endDate);
	await checkNewDates(current, data);

	const [contract] = await db
		.update(rentalContracts)
		// without an end there is no notice: withdrawing it makes the contract open-ended again
		.set({ ...data, ...(data.endDate === null && { terminated: false }), updatedAt: new Date() })
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
