/**
 * Apartment Service
 * Business logic for apartment operations
 */

import { eq, and, sql, desc } from 'drizzle-orm';
import { db, paged } from '../db/connection';
import {
	apartments,
	buildings,
	rentalContracts,
	tenants,
	type Apartment,
	type NewApartment
} from '../db/schema';
import { everyWordIn, withoutApartmentWord } from './word-search';
import { daysAfter, sqlToday, swissToday } from './today';
import type { ApartmentStatus, ApartmentWithDetails } from '../api/apartment';
import { CodedError, refusal, type Refusal } from './coded-error';

/** First day of the next rental contract that has not started yet */
export const nextContractStart = sql<string | null>`(
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

/** Last day of the apartment's latest rental contract: an empty apartment is empty from the day after (#145) */
const lastContractEnd = sql<string | null>`(
	select max(c.end_date)::text from rental_contracts c
	where c.apartment_id = "apartments"."id" and c.end_date < ${sqlToday}
)`;

/** An open-ended rental contract: no new contract can be recorded for the apartment (#815, the contract wizard) */
const blocked = sql<boolean>`exists (
	select 1 from rental_contracts c where c.apartment_id = "apartments"."id" and c.end_date is null
)`;

/** The day after the apartment's latest Vertragsende while that day is still to come; null when free now (#815) */
const availableFrom = sql<string | null>`(
	select (max(c.end_date) + 1)::text from rental_contracts c
	where c.apartment_id = "apartments"."id"
	having max(c.end_date) + 1 > ${sqlToday} and bool_and(c.end_date is not null)
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

/** An apartment with its Mietstatus, the dates it is shown with, and its building's name, as list and detail read it */
const apartmentFields = {
	id: apartments.id,
	buildingId: apartments.buildingId,
	number: apartments.number,
	floor: apartments.floor,
	area: apartments.area,
	rooms: apartments.rooms,
	discontinuedFrom: apartments.discontinuedFrom,
	earlierSizes: apartments.earlierSizes,
	status: apartmentStatus,
	nextContractStart,
	currentContractEnd,
	lastContractEnd,
	blocked,
	availableFrom,
	createdAt: apartments.createdAt,
	updatedAt: apartments.updatedAt,
	buildingName: buildings.name
};

export interface ApartmentFilters {
	search?: string;
	buildingId?: string;
	status?: ApartmentStatus;
	floor?: number;
	limit?: number | null; // null: every apartment (#1229)
	offset?: number;
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
		conditions.push(everyWordIn(withoutApartmentWord(search), [apartments.number, buildings.name, buildings.address, buildings.city]));
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
	const results = await paged(
		db
			.select(apartmentFields)
			.from(apartments)
			.innerJoin(buildings, eq(apartments.buildingId, buildings.id))
			.where(whereClause)
			.orderBy(buildings.name, apartments.floor, apartments.number)
			.$dynamic(),
		limit,
		offset
	);

	// Get total count
	const [{ count: total }] = await db
		.select({ count: sql<number>`count(*)` })
		.from(apartments)
		.innerJoin(buildings, eq(apartments.buildingId, buildings.id))
		.where(whereClause);

	return {
		apartments: results,
		total: Number(total)
	};
}

/**
 * Get a single apartment with current tenant info
 */
export async function getApartment(id: string): Promise<ApartmentWithDetails | null> {
	const [apartment] = await db
		.select({
			...apartmentFields,
			buildingAddress: buildings.address,
			buildingPostalCode: buildings.postalCode,
			buildingCity: buildings.city
		})
		.from(apartments)
		.innerJoin(buildings, eq(apartments.buildingId, buildings.id))
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
	// the contract the next tenant moves in with (H-28, #717)
	const [next] = await db
		.select({ id: rentalContracts.id })
		.from(rentalContracts)
		.where(and(eq(rentalContracts.apartmentId, id), sql`${rentalContracts.startDate} > ${sqlToday}`))
		.orderBy(rentalContracts.startDate)
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
		currentContractId: currentContract?.contractId,
		nextContractId: next?.id ?? null
	};
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
	{ sizeFrom, ...data }: Partial<NewApartment> & { sizeFrom?: string }
): Promise<Apartment | null> {
	if (data.discontinuedFrom) await checkNoContractOn(id, data.discontinuedFrom);
	const earlier = sizeFrom ? await earlierSizesWith(id, sizeFrom, data) : undefined;
	const [apartment] = await db
		.update(apartments)
		.set({ ...data, ...(earlier && { earlierSizes: earlier }), updatedAt: new Date() })
		.where(eq(apartments.id, id))
		.returning();

	return apartment || null;
}

// #1301: new values from a day keep the ones before as earlier values up to the day before; only after the last change,
// not after today and before «Aufgehoben ab» (Fachreview 1301-1 V-3, V-8)
async function earlierSizesWith(id: string, sizeFrom: string, data: Partial<NewApartment>) {
	const [current] = await db.select().from(apartments).where(eq(apartments.id, id));
	if (!current) return undefined;
	checkSizeFrom(sizeFrom, data, current);
	return [...current.earlierSizes, { until: daysAfter(sizeFrom, -1), area: current.area, rooms: current.rooms }];
}

const same = (value: string | undefined, saved: string) => value === undefined || parseFloat(value) === parseFloat(saved);

function checkSizeFrom(sizeFrom: string, data: Partial<NewApartment>, current: Apartment) {
	if (same(data.area, current.area) && same(data.rooms, current.rooms)) throw new CodedError('APARTMENT_SIZE_UNCHANGED', 'Area and rooms are unchanged');
	if (sizeFrom > swissToday()) throw new CodedError('APARTMENT_SIZE_FROM_FUTURE', 'New values cannot apply from a day after today');
	const gone = data.discontinuedFrom === undefined ? current.discontinuedFrom : data.discontinuedFrom;
	if (gone && sizeFrom >= gone) throw new CodedError('APARTMENT_SIZE_AFTER_DISCONTINUED', 'The apartment no longer exists from that day', { date: gone });
	const lastChange = current.earlierSizes.length ? daysAfter(current.earlierSizes.at(-1)!.until, 1) : null;
	if (lastChange && sizeFrom <= lastChange) throw new CodedError('APARTMENT_SIZE_FROM_TOO_EARLY', 'New values only after the last change', { date: lastChange });
}

/** #1301 (Fachreview 1301-1 V-1): the last change of Fläche and Zimmeranzahl removed, its earlier values apply again */
export async function removeSizeChange(id: string): Promise<Apartment | null> {
	const [current] = await db.select().from(apartments).where(eq(apartments.id, id));
	const last = current?.earlierSizes.at(-1);
	if (!last) return current ?? null;
	const [apartment] = await db
		.update(apartments)
		.set({ area: last.area, rooms: last.rooms, earlierSizes: current.earlierSizes.slice(0, -1), updatedAt: new Date() })
		.where(eq(apartments.id, id))
		.returning();
	return apartment;
}

// #1284: an apartment no longer exists from a day only when no contract of it still runs on that day or later
async function checkNoContractOn(id: string, date: string) {
	const [contract] = await db
		.select({ tenant: sql<string>`${tenants.firstName} || ' ' || ${tenants.lastName}` })
		.from(rentalContracts)
		.innerJoin(tenants, eq(rentalContracts.tenantId, tenants.id))
		.where(and(eq(rentalContracts.apartmentId, id), sql`(${rentalContracts.endDate} IS NULL OR ${rentalContracts.endDate} >= ${date})`))
		.limit(1);
	if (contract) throw new CodedError('APARTMENT_CONTRACT_RUNS', 'A contract still runs on that day', { date, tenant: contract.tenant });
}

// #1284: a contract of an apartment that no longer exists from a day ends at the latest the day before
export async function checkDiscontinued(apartmentId: string, endDate: string | null, q: Pick<typeof db, 'select'> = db) {
	const [apartment] = await q
		.select({ number: apartments.number, date: apartments.discontinuedFrom })
		.from(apartments)
		.where(eq(apartments.id, apartmentId));
	if (!apartment?.date || (endDate && endDate < apartment.date)) return;
	const { number, date } = apartment;
	throw new CodedError('CONTRACT_APARTMENT_DISCONTINUED', 'The apartment no longer exists from that day', { number, date, dayBefore: daysAfter(date, -1) });
}

/**
 * Delete an apartment
 * #1257: refused while it has a rental contract, an ended one included: it stays as the apartment's history
 */
export async function deleteApartment(id: string): Promise<{ success: boolean } & Partial<Refusal>> {
	// the apartment's row locked first: a contract recorded meanwhile waits, then fails, or is seen (fallback review #1286)
	return db.transaction(async (tx) => {
		const [apartment] = await tx.select({ id: apartments.id }).from(apartments).where(eq(apartments.id, id)).for('update');
		if (!apartment) return { success: false, error: 'Apartment not found' };
		const [contract] = await tx
			.select({ id: rentalContracts.id })
			.from(rentalContracts)
			.where(eq(rentalContracts.apartmentId, id))
			.limit(1);
		if (contract) {
			return {
				success: false,
				...refusal('APARTMENT_HAS_CONTRACTS', 'The apartment has rental contracts: it stays as their history')
			};
		}
		await tx.delete(apartments).where(eq(apartments.id, id));
		return { success: true };
	});
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

/** The building's apartments with the values a Verteilschlüssel reads, from when they no longer count (#1284) and their
 * earlier values (#1301) */
export async function apartmentsOf(buildingId: string) {
	const { apartments } = await listApartments({ buildingId, limit: null });
	return apartments.map(keyValues);
}

const values = <T extends { area: string; rooms: string }>(row: T) => ({ ...row, area: parseFloat(row.area), rooms: parseFloat(row.rooms) });
const keyValues = ({ id, number, area, rooms, discontinuedFrom, earlierSizes }: { id: string; number: string; area: string; rooms: string; discontinuedFrom: string | null; earlierSizes: { until: string; area: string; rooms: string }[] }) =>
	({ ...values({ id, number, area, rooms }), discontinuedFrom, earlierSizes: earlierSizes.map(values) });

/** As apartmentsOf, for every building in one query: a list of statements checks their keys without a query per row (#922) */
export async function apartmentsByBuilding() {
	const { id, buildingId, number, area, rooms, discontinuedFrom, earlierSizes } = apartments;
	const rows = await db.select({ id, buildingId, number, area, rooms, discontinuedFrom, earlierSizes }).from(apartments);
	const byBuilding = new Map<string, ReturnType<typeof keyValues>[]>();
	for (const row of rows) byBuilding.set(row.buildingId, [...(byBuilding.get(row.buildingId) ?? []), keyValues(row)]);
	return byBuilding;
}
