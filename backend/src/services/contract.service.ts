/**
 * Contract Service
 * Business logic for rental contract operations
 */

import { eq, and, or, sql, desc, gte, lte, isNull, ilike, ne, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
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
import { alignAdvances, currentAdvance, setAdvance } from './advance-payment.service';
import { setAgreedCategories } from './agreed-category.service';
import { apartmentStatus } from './apartment.service';
import { CodedError, refusal, type Refusal } from './coded-error';
import { oldAddress } from './old-address';
import { daysAfter, swissToday } from './today';

/** The database, or a transaction of it */
type Query = Pick<typeof db, 'select' | 'delete'>;
// the categories the form names as agreed (#91); every other umlagefähige one is not
type AgreedList = { agreedCategoryIds?: string[] };

/** Contract with the names of its tenant, apartment and building; selected with those three tables joined */
const contractFields = {
	id: rentalContracts.id,
	apartmentId: rentalContracts.apartmentId,
	tenantId: rentalContracts.tenantId,
	startDate: rentalContracts.startDate,
	endDate: rentalContracts.endDate,
	terminated: rentalContracts.terminated,
	noticeReceivedOn: rentalContracts.noticeReceivedOn,
	billedUntil: rentalContracts.billedUntil,
	movedOut: rentalContracts.movedOut,
	baseRent: rentalContracts.baseRent,
	additionalRent: rentalContracts.additionalRent,
	monthlyAdvancePayment: currentAdvance, // the Akonto of today, of the Vertragsbeginn or the Vertragsende (#464)
	flatRateUtilityCharge: rentalContracts.flatRateUtilityCharge,
	managementFeeAgreed: rentalContracts.managementFeeAgreed,
	managementFeePercent: rentalContracts.managementFeePercent,
	referenceIndex: rentalContracts.referenceIndex,
	contractPdf: rentalContracts.contractPdf,
	notes: rentalContracts.notes,
	createdAt: rentalContracts.createdAt,
	updatedAt: rentalContracts.updatedAt,
	tenantName: sql<string>`${tenants.firstName} || ' ' || ${tenants.lastName}`,
	tenantEmail: tenants.email,
	apartmentNumber: apartments.number,
	buildingId: buildings.id, // the Übersicht links to its invoices (#454)
	buildingName: buildings.name,
	buildingAddress: buildings.address,
	oldAddress: oldAddress(rentalContracts.id) // A-5: a moved-out tenant still has the building's address
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
	buildingId: string;
	buildingName: string;
	buildingAddress: string;
	oldAddress: boolean;
}

/**
 * List contracts with optional filters
 */
export async function listContracts(filters: ContractFilters = {}): Promise<{
	contracts: ContractWithDetails[];
	total: number;
}> {
	const { apartmentId, tenantId, buildingId, status, search, limit = 50, offset = 0 } = filters;
	const today = swissToday();

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
	excludeContractId?: string,
	q: Query = db
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

	const [overlapping] = await q
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
 * «Abgerechnet bis» (#453, #337): a statement exists only after its period ended, so never after today; before the
 * Vertragsbeginn it has no effect. Checked when the date or the Vertragsbeginn is sent; a stored value stays till then
 */
function checkBilledUntil(startDate: string, billedUntil: string | null | undefined, sent: boolean) {
	if (!billedUntil || !sent) return;
	if (billedUntil > swissToday()) throw new CodedError('BILLED_UNTIL_FUTURE', '«Abgerechnet bis» lies in the future');
	if (billedUntil < startDate)
		throw new CodedError('BILLED_UNTIL_BEFORE_START', '«Abgerechnet bis» lies before the contract start', { date: startDate });
}

// Without an agreed Verwaltungspauschale no own rate is kept: agreeing again later must not bring it back (#89)
const feeRate = <T extends Partial<NewRentalContract>>(data: T, agreed = data.managementFeeAgreed): T =>
	agreed ? data : { ...data, managementFeePercent: null };

/**
 * Create a new contract
 */
export async function createContract({ agreedCategoryIds, ...data }: NewRentalContract & AgreedList): Promise<RentalContract> {
	checkNotice(data.terminated, data.endDate);
	checkBilledUntil(data.startDate, data.billedUntil, true);
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

	// a new contract agrees every umlagefähige category unless the form names the agreed ones (#91)
	return db.transaction(async (tx) => {
		const [contract] = await tx.insert(rentalContracts).values(feeRate(data)).returning();
		await setAgreedCategories(contract.id, agreedCategoryIds, tx);
		await setAdvance(contract.id, data.monthlyAdvancePayment, data.startDate, tx);
		return contract;
	});
}

/**
 * The first day Dwello bills the contract: its Vertragsbeginn, or the day after «Abgerechnet bis» when that is later
 * (#133); the BFF has the same rule in `billsIn` (src/lib/contract-status.ts)
 */
export const billingStart = ({ startDate, billedUntil }: { startDate: string; billedUntil: string | null }) =>
	billedUntil && billedUntil >= startDate ? daysAfter(billedUntil, 1) : startDate;

/** The contract's statements whose billed rent days the new dates would change (fewer or more) */
async function statementsChanged(contractId: string, startDate: string, endDate: string | null, q: Query) {
	const from = sql`greatest(${utilityStatements.periodStart}, ${startDate}::date)`;
	const to = sql`least(${utilityStatements.periodEnd}, coalesce(${endDate}::date, ${utilityStatements.periodEnd}))`;
	return q
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
				ne(utilityStatements.status, 'replaced'), // a replaced statement stays as it was, its days included (#120)
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

/** The dates the change sends; an empty Vertragsbeginn keeps the stored one */
const newDates = ({ startDate, endDate, billedUntil }: Partial<NewRentalContract>) =>
	Object.fromEntries(
		Object.entries({ startDate: startDate || undefined, endDate, billedUntil }).filter(([, value]) => value !== undefined)
	) as Partial<Pick<RentalContract, 'startDate' | 'endDate' | 'billedUntil'>>;

/**
 * New dates may neither overlap another contract of the apartment nor change the billed Mietstage of a statement;
 * `draft`, a draft of the contract, is deleted when it is the only statement they change (#141)
 */
async function checkNewDates(current: RentalContract, data: Partial<NewRentalContract>, q: Query, draft?: string) {
	if (!data.startDate && data.endDate === undefined && data.billedUntil === undefined) return;
	const { startDate, endDate, billedUntil } = { ...current, ...newDates(data) };
	const { hasOverlap, overlappingContract } = await checkContractOverlap(current.apartmentId, startDate, endDate, current.id, q);
	if (hasOverlap)
		throw new CodedError('CONTRACT_OVERLAP', `Contract would overlap with existing contract ${overlappingContract}`, {
			contract: overlappingContract!
		});
	await checkBilledByDwello(current, data.billedUntil, startDate, q);
	const statements = await statementsChanged(current.id, billingStart({ startDate, billedUntil }), endDate, q);
	if (onlyDraft(statements, draft)) await q.delete(utilityStatements).where(eq(utilityStatements.id, draft!));
	else if (statements.length) throw new BilledDaysError(statements);
}

/**
 * #499 (decided 2026-10-19 and 2026-10-20): «Abgerechnet bis» may not cover a day a Dwello statement of the contract
 * bills: a sent, paid or settled one, or a replaced one whose berichtigte Abrechnung is missing or still a draft. Named is the
 * first such statement; the latest day left is the one before its first billed day, unless that is before the
 * Vertragsbeginn. Checked before the offer to delete a draft (fach review 499-1 V-3), only for a new or changed date.
 */
async function checkBilledByDwello(current: RentalContract, billedUntil: string | null | undefined, startDate: string, q: Query) {
	if (!billedUntil || billedUntil === current.billedUntil) return;
	const successor = alias(utilityStatements, 'successor');
	const [first] = await q
		.select({
			number: utilityStatements.statementNumber,
			start: utilityStatements.periodStart,
			end: utilityStatements.periodEnd,
			rentalStart: utilityStatements.rentalStart
		})
		.from(utilityStatements)
		.leftJoin(successor, eq(successor.replacesId, utilityStatements.id))
		.where(
			and(
				eq(utilityStatements.contractId, current.id),
				lte(utilityStatements.rentalStart, billedUntil),
				or(
					inArray(utilityStatements.status, ['sent', 'paid', 'settled']), // settled: sent, its small Saldo carried over (#448)
					and(eq(utilityStatements.status, 'replaced'), or(isNull(successor.id), eq(successor.status, 'draft')))
				)
			)
		)
		.orderBy(utilityStatements.rentalStart, utilityStatements.statementNumber)
		.limit(1);
	if (!first) return;
	const { number, start, end } = first;
	const date = daysAfter(first.rentalStart, -1);
	if (date < startDate)
		throw new CodedError('BILLED_UNTIL_BILLED_START', '«Abgerechnet bis» covers days a statement bills from the contract start', { number, start, end });
	throw new CodedError('BILLED_UNTIL_BILLED', '«Abgerechnet bis» covers days a sent or paid statement bills', { number, start, end, date });
}

/** The changed statements are just the draft named */
const onlyDraft = (statements: { id: string; status: string }[], draft?: string) =>
	statements.length === 1 && statements[0].id === draft && statements[0].status === 'draft';

/**
 * Update an existing contract
 */
export async function updateContract(
	id: string,
	{ agreedCategoryIds, advancePaymentFrom, ...data }: Partial<NewRentalContract> & AgreedList & { advancePaymentFrom?: string },
	deleteDraft?: string
): Promise<RentalContract | null> {
	const current = await getContract(id);
	if (!current) return null;
	// a move or a Mieterwechsel is a new contract: refused rather than silently dropped (#152)
	const moved = (data.apartmentId ?? current.apartmentId) !== current.apartmentId;
	if (moved || (data.tenantId ?? current.tenantId) !== current.tenantId)
		throw new CodedError('CONTRACT_PARTIES_FIXED', 'Tenant and apartment of a contract cannot be changed');
	// removing the end withdraws the notice (below), whatever flag comes with it
	if (data.endDate !== null) checkNotice(data.terminated, data.endDate ?? current.endDate);
	const { startDate, billedUntil } = { ...current, ...newDates(data) };
	checkBilledUntil(startDate, billedUntil, data.billedUntil !== undefined || !!data.startDate);
	// the draft delete and the change in one transaction: a refused change keeps the draft (#141)
	const [contract] = await db.transaction(async (tx) => {
		await checkNewDates(current, data, tx, deleteDraft);
		if (agreedCategoryIds) await setAgreedCategories(id, agreedCategoryIds, tx, { answeredOnly: true });
		const updated = await tx
			.update(rentalContracts)
			// without an end there is no notice: withdrawing it makes the contract open-ended again; without a notice
			// there is no day it arrived; a move-out belongs to the end it was confirmed for (A-6)
			.set({
				...(data.endDate !== undefined && data.endDate !== current.endDate && { movedOut: false }),
				...feeRate(data, data.managementFeeAgreed ?? current.managementFeeAgreed),
				...(data.endDate === null && { terminated: false }),
				...((data.endDate === null || data.terminated === false) && { noticeReceivedOn: null }),
				updatedAt: new Date()
			})
			.where(eq(rentalContracts.id, id))
			.returning();
		// after the new dates: a new Akonto applies within them (#464)
		if (data.monthlyAdvancePayment !== undefined) await setAdvance(id, data.monthlyAdvancePayment, advancePaymentFrom, tx);
		await alignAdvances(id, tx);
		return updated;
	});

	return contract || null;
}

/**
 * Delete a contract: never one a statement bills (draft, sent or paid), one that has started only when the landlord
 * confirms it was entered by mistake (A-7, #116)
 */
export async function deleteContract(id: string, confirmMistake = false): Promise<{ success: boolean } & Partial<Refusal>> {
	const contract = await getContract(id);
	if (!contract) return { success: false, error: 'Contract not found' };

	const [statement] = await db
		.select({ id: utilityStatements.id })
		.from(utilityStatements)
		.where(eq(utilityStatements.contractId, id))
		.limit(1);
	if (statement)
		return { success: false, ...refusal('CONTRACT_HAS_STATEMENTS', 'Cannot delete contract with utility statements') };
	if (contract.startDate <= swissToday() && !confirmMistake)
		return { success: false, ...refusal('CONTRACT_STARTED', 'A started contract is deleted only when confirmed as entered by mistake') };

	await db.delete(rentalContracts).where(eq(rentalContracts.id, id));
	return { success: true };
}
