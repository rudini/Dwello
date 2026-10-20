/**
 * Statement Service
 * Business logic for utility statement operations
 */

import { eq, sql, desc, and, gte, lte, lt, ilike, or, inArray, isNull, getTableColumns } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db } from '../db/connection';
import { recordAudit, recordStatementCorrection } from './audit-log.service';
import {
	utilityStatements,
	utilityStatementLineItems,
	tenants,
	apartments,
	buildings,
	documents,
	heatingProfiles,
	type UtilityStatement,
	type NewUtilityStatement,
	type UtilityStatementLineItem,
	type NewUtilityStatementLineItem,
	type KeyValues,
	categories,
	rentalContracts
} from '../db/schema';
import { agreementsInPeriod } from './agreed-category.service';
import { calculateBalance, calculateStatementForContract, generateStatementNumber } from './calculation.service';
import { formatCHF, formatSwissDate, roundToRappen } from './pdf-format';
import { getTypedConfig } from './config.service';
import { fuelStockChange } from './fuel-stock.service';
import { listApartments } from './apartment.service';
import { CodedError, refusal, type Refusal } from './coded-error';
import type { Tx } from './advance-payment.service';
import { belowMinimum } from './pdf-format';
import { isRealDate } from './real-date';
import { oldAddress } from './old-address';
import { daysAfter, swissToday } from './today';

export interface StatementFilters {
	search?: string;
	contractId?: string;
	buildingId?: string;
	apartmentId?: string;
	tenantId?: string;
	status?: string;
	periodStart?: string;
	periodEnd?: string;
	limit?: number;
	offset?: number;
}

// The base64 PDF is only served by the /pdf routes, never with list or detail data
const { pdfBlob: _pdfBlob, ...tableColumns } = getTableColumns(utilityStatements);
// The day after the last reminder's Zahlungsfrist, from which the next Mahnstufe is possible (#107); none after the 3rd
// and none once paid
const nextReminderFrom = sql<string | null>`(
	select case when count(*) < 3 and ${utilityStatements.status} = 'sent' then (max(${documents.paymentDeadline}) + 1)::text end
	from ${documents}
	where ${documents.statementId} = ${utilityStatements.id} and ${documents.type} = 'reminder'
)`;
// the Schlussabrechnung: the Mietvertrag ends within the period; it has no Mindestbetrag and carries nothing over (#448)
const final = sql<boolean>`exists (
	select 1 from ${rentalContracts}
	where ${rentalContracts.id} = ${utilityStatements.contractId}
		and ${rentalContracts.endDate} between ${utilityStatements.periodStart} and ${utilityStatements.periodEnd}
)`;
const statementColumns = { ...tableColumns, nextReminderFrom, final, oldAddress: oldAddress(utilityStatements.contractId) };

export interface StatementWithDetails extends Omit<UtilityStatement, 'pdfBlob'> {
	nextReminderFrom: string | null;
	final: boolean; // a Schlussabrechnung (#448)
	oldAddress: boolean; // A-5: a moved-out tenant still has the building's address
	tenant: {
		id: string;
		firstName: string;
		lastName: string;
		email: string | null;
		language?: string;
		address?: string | null;
		postalCode?: string | null;
		city?: string | null;
	} | null;
	apartment: { id: string; number: string; floor: number; area: string } | null;
	building: { id: string; name: string; address: string; postalCode?: string; city?: string } | null;
	lineItems: UtilityStatementLineItem[];
	// a berichtigte Abrechnung and the statement it replaces, and the replaced ones of its chain paid on (#120); only
	// in the detail
	replaces?: { id: string; statementNumber: string; statementDate: string; totalAdvancePayments: string } | null;
	replacedBy?: { id: string; statementNumber: string } | null;
	priorPaidOn?: string[];
	offsetWith?: { statementNumber: string; amount: string }[]; // «Bereits verrechnet mit NK-…» (#448)
	carriedFrom?: { id: string; statementNumber: string; balance: string } | null; // the Übertrag (#448); only in the detail
	heatingProfile?: {
		id: string;
		name: string;
		nameDE: string | null;
		nameFR: string | null;
		nameIT: string | null;
		nameEN: string | null;
	} | null;
}

/**
 * Status filter; 'overdue' is computed as sent with a past payment deadline,
 * 'open' covers all sent statements that are not paid yet (overdue included)
 */
export function statusCondition(status: string) {
	const today = swissToday();
	if (status === 'open') return eq(utilityStatements.status, 'sent');
	if (status === 'overdue') {
		return and(eq(utilityStatements.status, 'sent'), lt(utilityStatements.paymentDeadline, today));
	}
	if (status === 'sent') {
		// 'sent' excludes overdue (sent with past deadline)
		return and(
			eq(utilityStatements.status, 'sent'),
			or(gte(utilityStatements.paymentDeadline, today), sql`${utilityStatements.paymentDeadline} IS NULL`)
		);
	}
	return eq(utilityStatements.status, status);
}

/**
 * Where conditions for listStatements; tenant and building columns come from its joins
 */
function statementFilterConditions(filters: StatementFilters) {
	const { search, contractId, buildingId, apartmentId, tenantId, status, periodStart, periodEnd } = filters;
	return [
		search &&
			or(
				ilike(utilityStatements.statementNumber, `%${search}%`),
				ilike(sql`${tenants.firstName} || ' ' || ${tenants.lastName}`, `%${search}%`)
			),
		contractId && eq(utilityStatements.contractId, contractId),
		apartmentId && eq(utilityStatements.apartmentId, apartmentId),
		tenantId && eq(utilityStatements.tenantId, tenantId),
		buildingId && eq(apartments.buildingId, buildingId),
		status && statusCondition(status),
		periodStart && gte(utilityStatements.periodStart, periodStart),
		periodEnd && lte(utilityStatements.periodEnd, periodEnd)
	].filter((condition) => !!condition);
}

/**
 * List statements with optional filters and pagination
 */
export async function listStatements(filters: StatementFilters = {}): Promise<{
	statements: StatementWithDetails[];
	total: number;
}> {
	const { limit = 20, offset = 0 } = filters;

	const conditions = statementFilterConditions(filters);

	const whereClause = and(...conditions);

	// Build the query with joins
	const results = await db
		.select({
			statement: statementColumns,
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
		.where(whereClause)
		.orderBy(desc(utilityStatements.statementDate), desc(utilityStatements.createdAt), desc(utilityStatements.id))
		.limit(limit)
		.offset(offset);

	// Batch load all line items for the fetched statements (avoids N+1 query)
	const statementIds = results.map((r) => r.statement.id);
	const allLineItems =
		statementIds.length > 0
			? await db
					.select()
					.from(utilityStatementLineItems)
					.where(inArray(utilityStatementLineItems.statementId, statementIds))
					.orderBy(utilityStatementLineItems.statementId, utilityStatementLineItems.sortOrder)
			: [];

	// Group line items by statement ID for quick lookup
	const lineItemsByStatementId = new Map<string, typeof allLineItems>();
	for (const item of allLineItems) {
		const existing = lineItemsByStatementId.get(item.statementId) || [];
		existing.push(item);
		lineItemsByStatementId.set(item.statementId, existing);
	}

	// Build results with line items and compute effective status
	const today = swissToday();
	const statementsWithLineItems: StatementWithDetails[] = results.map((row) => {
		// Compute effective status: if sent and past deadline, show as overdue
		const effectiveStatus =
			row.statement.status === 'sent' &&
			row.statement.paymentDeadline &&
			row.statement.paymentDeadline < today
				? 'overdue'
				: row.statement.status;

		return {
			...row.statement,
			status: effectiveStatus,
			tenant: row.tenant,
			apartment: row.apartment,
			building: row.building,
			lineItems: lineItemsByStatementId.get(row.statement.id) || []
		};
	});

	// Get total count
	const [{ count: total }] = await db
		.select({ count: sql<number>`count(*)` })
		.from(utilityStatements)
		.leftJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
		.leftJoin(tenants, eq(utilityStatements.tenantId, tenants.id))
		.where(whereClause);

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
			statement: statementColumns,
			tenant: {
				id: tenants.id,
				firstName: tenants.firstName,
				lastName: tenants.lastName,
				email: tenants.email,
				correspondenceChannel: tenants.correspondenceChannel,
				language: tenants.language,
				address: tenants.address,
				postalCode: tenants.postalCode,
				city: tenants.city,
				country: tenants.country
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
				address: buildings.address,
				postalCode: buildings.postalCode,
				city: buildings.city
			},
			// the profile the heating costs were spread with, named in the UI language (A-10)
			heatingProfile: {
				id: heatingProfiles.id,
				name: heatingProfiles.name,
				nameDE: heatingProfiles.nameDE,
				nameFR: heatingProfiles.nameFR,
				nameIT: heatingProfiles.nameIT,
				nameEN: heatingProfiles.nameEN
			}
		})
		.from(utilityStatements)
		.leftJoin(tenants, eq(utilityStatements.tenantId, tenants.id))
		.leftJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
		.leftJoin(buildings, eq(apartments.buildingId, buildings.id))
		.leftJoin(heatingProfiles, eq(utilityStatements.heatingProfileId, heatingProfiles.id))
		.where(eq(utilityStatements.id, id))
		.limit(1);

	if (!result) return null;

	// Get line items
	const lineItems = await db
		.select()
		.from(utilityStatementLineItems)
		.where(eq(utilityStatementLineItems.statementId, id))
		.orderBy(utilityStatementLineItems.sortOrder);

	// Compute effective status: if sent and past deadline, show as overdue
	const today = swissToday();
	const effectiveStatus =
		result.statement.status === 'sent' &&
		result.statement.paymentDeadline &&
		result.statement.paymentDeadline < today
			? 'overdue'
			: result.statement.status;

	return {
		...result.statement,
		status: effectiveStatus,
		tenant: result.tenant,
		apartment: result.apartment,
		building: result.building,
		heatingProfile: result.heatingProfile,
		lineItems,
		...(await correctionsOf(result.statement)),
		carriedFrom: await carriedFromOf(result.statement.carriedFromId)
	};
}

async function carriedFromOf(id: string | null) {
	if (!id) return null;
	const [from] = await db
		.select({ id: utilityStatements.id, statementNumber: utilityStatements.statementNumber, balance: utilityStatements.balance })
		.from(utilityStatements)
		.where(eq(utilityStatements.id, id));
	return from ?? null;
}

/** The statement a berichtigte Abrechnung replaces, the replaced ones of its chain paid on, and its own replacement */
async function correctionsOf(statement: { id: string; replacesId: string | null }) {
	const columns = { id: utilityStatements.id, statementNumber: utilityStatements.statementNumber };
	const chain = [];
	for (let next = statement.replacesId; next; ) {
		const [replaced] = await db
			.select({ ...columns, statementDate: utilityStatements.statementDate, paidAmount: utilityStatements.paidAmount, replacesId: utilityStatements.replacesId, totalAdvancePayments: utilityStatements.totalAdvancePayments, countedBy })
			.from(utilityStatements)
			.where(eq(utilityStatements.id, next));
		chain.push(replaced);
		next = replaced.replacesId;
	}
	const [replacedBy] = await db.select(columns).from(utilityStatements).where(eq(utilityStatements.replacesId, statement.id));
	const [first] = chain;
	// its Akonto, so the page can say when the correction deducts another (#464, product owner on F-4)
	const replaces = first
		? { id: first.id, statementNumber: first.statementNumber, statementDate: first.statementDate, totalAdvancePayments: first.totalAdvancePayments }
		: null;
	const paidOn = chain.filter((s) => Number(s.paidAmount ?? 0) !== 0);
	const priorPaidOn = paidOn.filter((s) => !s.countedBy).map((s) => s.statementNumber).reverse();
	// #448 (Fachreview 448-1 V-2): its Saldo is in the next statement as the Übertrag
	const offsetWith = paidOn.filter((s) => s.countedBy).map((s) => ({ statementNumber: s.countedBy!, amount: s.paidAmount! }));
	return { replaces, replacedBy: replacedBy ?? null, priorPaidOn, offsetWith };
}

/** Parameters of a statement calculation; the management fee overrides the configured default */
export interface StatementInput {
	contractId: string;
	periodStart: string;
	periodEnd: string;
	heatingProfileId?: string;
	managementFeePercent?: number;
}

/**
 * Calculate a contract's statement for a period without storing it; a statement of the contract and the same period
 * replaced without a berichtigte Abrechnung yet is replaced by it, which offsets what was paid on it (#120)
 */
export async function calculateStatement(input: StatementInput) {
	const calculation = await calculateStatementForContract(
		input.contractId,
		new Date(input.periodStart),
		new Date(input.periodEnd),
		input.heatingProfileId,
		input.managementFeePercent
	);
	const replaced = await openReplaced(input);
	const priorPayments = replaced ? paidSoFar(replaced) : 0;
	const carried = await carriedOver(input);
	const carryOver = carried ? Number(carried.balance) : 0;
	const balance = calculateBalance(calculation.totalCosts + carryOver, calculation.totalAdvancePayments + priorPayments);
	return { ...calculation, balance, priorPayments, carryOver, carriedFromId: carried?.id ?? null, replacesId: replaced?.id ?? null };
}

// The number of the sent statement of another period that counts this statement's Saldo as its Übertrag (#448); a
// berichtigte Abrechnung of the same period counts it again; a draft may still change (Fachreview 448-2 V-14)
const countedBy = sql<string | null>`(
	select counting.statement_number from utility_statements counting
	where counting.carried_from_id = utility_statements.id and counting.status <> 'draft'
		and (counting.period_start <> utility_statements.period_start or counting.period_end <> utility_statements.period_end)
	limit 1
)`; // the outer table by its name: drizzle writes a column of a single-table select without it
// A Saldo carried over: settled with a Saldo other than 0.00, or a refund below CHF 5 settled under #94, which the
// tenant is still owed (PO 2026-10-19); a Nachzahlung waived under #94 stays waived
const carriable = or(
	and(eq(utilityStatements.status, 'settled'), sql`${utilityStatements.balance} <> 0`),
	and(eq(utilityStatements.status, 'paid'), sql`${utilityStatements.paidAmount} = 0 and ${utilityStatements.balance} < 0 and ${utilityStatements.balance} > -5`)
);

/**
 * The Übertrag (#448): the latest earlier statement of the Mietvertrag with a Saldo carried over that no statement of
 * another period counts yet
 */
async function carriedOver({ contractId, periodStart, periodEnd }: StatementInput) {
	const [carried] = await db
		.select({ id: utilityStatements.id, balance: utilityStatements.balance })
		.from(utilityStatements)
		.where(
			and(
				eq(utilityStatements.contractId, contractId),
				carriable,
				lt(utilityStatements.periodEnd, periodStart),
				sql`not exists (
					select 1 from utility_statements counting
					where counting.carried_from_id = utility_statements.id
						and (counting.period_start <> ${periodStart} or counting.period_end <> ${periodEnd})
				)`
			)
		)
		.orderBy(desc(utilityStatements.periodEnd))
		.limit(1);
	return carried;
}

/** What was paid on a replaced statement and on the ones it replaced itself; a refund paid to the tenant counts negative */
const paidSoFar = (replaced: { paidAmount: string | null; priorPayments: string }) =>
	roundToRappen(Number(replaced.paidAmount ?? 0) + Number(replaced.priorPayments));

async function openReplaced({ contractId, periodStart, periodEnd }: StatementInput) {
	const successor = alias(utilityStatements, 'successor');
	const [replaced] = await db
		.select({ id: utilityStatements.id, paidAmount: utilityStatements.paidAmount, priorPayments: utilityStatements.priorPayments })
		.from(utilityStatements)
		.leftJoin(successor, eq(successor.replacesId, utilityStatements.id))
		.where(
			and(
				eq(utilityStatements.contractId, contractId),
				eq(utilityStatements.status, 'replaced'),
				eq(utilityStatements.periodStart, periodStart),
				eq(utilityStatements.periodEnd, periodEnd),
				isNull(successor.id)
			)
		)
		.limit(1);
	return replaced;
}

// The Tankbestand readings the statement bills by, only when the contract agrees the tank's category (#91, V-3); a
// statement from before #91 (agreed: null) billed every category
export const agreedStock = async (input: { buildingId: string; periodStart: string; periodEnd: string }, agreedCategoryIds: string[] | null) => {
	const [change] = await fuelStockChange(input.buildingId, input.periodStart, input.periodEnd);
	return change && (!agreedCategoryIds || agreedCategoryIds.includes(change.categoryId)) ? change.stock : null;
};

// The columns and positions a calculation gives a statement: shared by a new draft and a recalculated one (#338)
async function calculatedRows(input: StatementInput & { buildingId: string }) {
	const calculation = await calculateStatement(input);
	const values = {
		tenantId: calculation.tenantId,
		apartmentId: calculation.apartmentId,
		contractId: input.contractId,
		periodStart: input.periodStart,
		periodEnd: input.periodEnd,
		rentalDays: calculation.rentalDays,
		rentalStart: calculation.rentalStart,
		rentalEnd: calculation.rentalEnd,
		totalCosts: String(calculation.totalCosts),
		totalAdvancePayments: String(calculation.totalAdvancePayments),
		advanceLines: calculation.advanceLines,
		managementFee: String(calculation.managementFee),
		managementFeePercent: String(calculation.managementFeePercent),
		heatingProfileId: input.heatingProfileId || null,
		heatingShare: calculation.heating,
		fuelStock: await agreedStock(input, calculation.agreedCategoryIds),
		agreedCategoryIds: calculation.agreedCategoryIds,
		keyValues: await keyValuesOf(input.buildingId, calculation.apartmentId),
		balance: String(calculation.balance),
		replacesId: calculation.replacesId,
		priorPayments: String(calculation.priorPayments),
		carriedFromId: calculation.carriedFromId
	};
	const lineItems = calculation.lineItems.map((item, index) => ({
		categoryId: item.categoryId,
		distributionKeyId: item.distributionKeyId,
		description: item.description,
		totalAmount: String(item.totalBuildingAmount),
		tenantShare: String(item.tenantShare),
		// Share column next to building total and tenant share: the tenant's share of the building total
		sharePercentage: item.totalBuildingAmount ? String((item.tenantShare / item.totalBuildingAmount) * 100) : '0',
		apartmentShare: String(item.apartmentShare),
		periodShare: String(item.periodShare),
		positionRentalDays: item.positionRentalDays,
		billedDays: item.billedDays,
		invoiceParts: item.invoiceParts,
		invoices: item.invoices,
		sortOrder: index
	}));
	return { values, lineItems, carryOver: calculation.carryOver };
}

/**
 * #199, #408 point 2: one Abrechnungsperiode per day and building. A new statement whose period overlaps one of the
 * building's without being equal would share an invoice out a second time over the same days (above 100 %); the
 * statements made before stay as they are and may overlap: a period equal to one of theirs is allowed (product owner,
 * Fachreview 199-1 V-1); a replaced one's period stays the building's for its berichtigte Abrechnung (#120, code
 * review 199-1 C-1, 199-2 C-8)
 */
async function refuseOverlappingPeriod({ buildingId, periodStart, periodEnd }: StatementInput & { buildingId: string }) {
	const overlapping = await db
		.select({
			building: buildings.name,
			periodStart: utilityStatements.periodStart,
			periodEnd: utilityStatements.periodEnd
		})
		.from(utilityStatements)
		.innerJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
		.innerJoin(buildings, eq(apartments.buildingId, buildings.id))
		.where(and(eq(apartments.buildingId, buildingId), lte(utilityStatements.periodStart, periodEnd), gte(utilityStatements.periodEnd, periodStart)))
		.orderBy(utilityStatements.periodStart);
	if (!overlapping.length || overlapping.some((s) => s.periodStart === periodStart && s.periodEnd === periodEnd)) return;
	// every overlapped period, so the landlord's next choice does not overlap another one (code review 199-1 C-3)
	const periods = [...new Set(overlapping.map((s) => `${formatSwissDate(s.periodStart)} – ${formatSwissDate(s.periodEnd)}`))];
	throw new CodedError('STATEMENT_PERIOD_OVERLAPS', 'The period overlaps a statement period of the building', {
		building: overlapping[0].building,
		periods: periods.join(', ')
	});
}

/** Calculate a contract's statement and store it as a draft with its line items */
export async function generateStatement(
	input: StatementInput & { buildingId: string }
): Promise<StatementWithDetails> {
	await refuseOverlappingPeriod(input);
	const { values, lineItems } = await calculatedRows(input);
	const statementNumber = await generateStatementNumber(
		input.buildingId,
		new Date(input.periodEnd)
	);

	const paymentDeadlineDays = await getTypedConfig('payment_deadline_days');
	const statementDate = swissToday();

	return createStatement(
		{ ...values, statementNumber, statementDate, status: 'draft', paymentDeadline: daysAfter(statementDate, paymentDeadlineDays) },
		lineItems
	);
}

// What «Neu berechnen» gives a statement now (#338): its Heizprofil and Verwaltungspauschale, what was paid on the
// statement it replaces
async function recalculated(statement: StatementWithDetails) {
	const { contractId, periodStart, periodEnd, heatingProfileId, managementFeePercent } = statement;
	const rows = await calculatedRows({
		contractId,
		buildingId: statement.building!.id,
		periodStart,
		periodEnd,
		heatingProfileId: heatingProfileId ?? undefined,
		managementFeePercent: managementFeePercent === null ? undefined : Number(managementFeePercent)
	});
	const { totalCosts, totalAdvancePayments } = rows.values;
	const balance = calculateBalance(Number(totalCosts) + rows.carryOver, Number(totalAdvancePayments) + Number(statement.priorPayments));
	return { ...rows, balance: String(balance) };
}

// The tenant's share per position, as a key to compare (#454, Fachreview 454-1 E-3)
const sharesOf = (items: { categoryId: string | null; distributionKeyId: string | null; tenantShare: string }[]) =>
	JSON.stringify(
		items
			.filter((item) => Number(item.tenantShare) !== 0)
			.map((item) => `${item.categoryId}/${item.distributionKeyId}/${Number(item.tenantShare).toFixed(2)}`)
			.sort()
	);

/**
 * #454 (Fachreview 454-1 E-3): whether recalculating a sent statement would change its Saldo or the tenant's share of a
 * position, and the result (to remember a «Nicht berichtigen», E-6); null when it cannot be recalculated
 */
export async function recalculation(statement: StatementWithDetails) {
	const now = await recalculated(statement).catch(() => null);
	if (!now) return null;
	const result = JSON.stringify([now.balance, sharesOf(now.lineItems)]);
	const changes = result !== JSON.stringify([String(Number(statement.balance)), sharesOf(statement.lineItems)]);
	// as claimed: a Saldo below CHF 5 is neither claimed nor paid out, but in a Schlussabrechnung (PO 2026-10-20, V-30 A)
	const claimed = (balance: string) => (!statement.final && belowMinimum(Number(balance)) ? 0 : Number(balance));
	const [before, after] = [claimed(statement.balance), claimed(now.balance)];
	return { changes, result, raises: after >= before, lowers: after < before };
}

/**
 * Calculate a draft again from the invoices as they are now (#338): same number, Heizprofil and Verwaltungspauschale,
 * new amounts and positions; a sent or paid statement is corrected by a berichtigte Abrechnung instead (#120)
 */
export async function recalculateStatement(id: string): Promise<StatementWithDetails> {
	const draft = await getStatement(id);
	if (!draft) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (draft.status !== 'draft') throw new CodedError('STATEMENT_NOT_RECALCULABLE', 'Only a draft can be recalculated');
	// the wizard asks only for contracts without a statement: the landlord deletes the draft first (review 338-1 C-3)
	await refuseOpenAgreements(draft.contractId, draft.building!.id, draft.periodStart, draft.periodEnd, 'STATEMENT_RECALCULATION_AGREEMENTS_OPEN');
	const { values, lineItems, balance } = await recalculated(draft);
	// a berichtigte Abrechnung keeps the statement it replaces and what was paid on it (review 338-1 C-1)
	const kept = { replacesId: draft.replacesId, priorPayments: draft.priorPayments, balance };
	await db.transaction(async (tx) => {
		await tx.delete(utilityStatementLineItems).where(eq(utilityStatementLineItems.statementId, id));
		await tx
			.update(utilityStatements)
			.set({ ...values, ...kept, pdfBlob: null, pdfGeneratedAt: null, updatedAt: new Date() })
			.where(eq(utilityStatements.id, id));
		if (lineItems.length) await tx.insert(utilityStatementLineItems).values(lineItems.map((item) => ({ ...item, statementId: id })));
	});
	return (await getStatement(id))!;
}

/**
 * Create a new statement
 */
export async function createStatement(
	data: NewUtilityStatement,
	lineItems: Omit<NewUtilityStatementLineItem, 'statementId'>[] = []
): Promise<StatementWithDetails> {
	// Statement and line items are written together or not at all
	const statement = await db.transaction(async (tx) => {
		const [statement] = await tx.insert(utilityStatements).values(data).returning();
		if (lineItems.length > 0) {
			await tx.insert(utilityStatementLineItems).values(
				lineItems.map((item, index) => ({
					...item,
					statementId: statement.id,
					sortOrder: item.sortOrder ?? index
				}))
			);
		}
		return statement;
	});

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

	// A replaced statement stays as it was (#120)
	if (existing.status === 'replaced') throw new CodedError('STATEMENT_REPLACED', 'A replaced statement cannot be changed');
	// Once sent, the amounts stay as the tenant received them
	if (existing.status !== 'draft') {
		const protectedFields = ['totalCosts', 'totalAdvancePayments', 'managementFeePercent', 'managementFee', 'balance'];
		for (const field of protectedFields) {
			if (field in data) {
				throw new Error(`Cannot modify ${field} for a statement that is no longer a draft`);
			}
		}
	}

	// The PDF prints date, payment deadline and remark (#448); a change discards it, it is made again. Once paid, the PDF as sent stays
	const pdfOutdated = changesPdf(data, existing);

	// Update the statement
	const [updated] = await db
		.update(utilityStatements)
		.set({ ...data, ...(pdfOutdated && { pdfBlob: null, pdfGeneratedAt: null }), updatedAt: new Date() })
		.where(eq(utilityStatements.id, id))
		.returning();

	if (!updated) return null;

	return await getStatement(id);
}

// A field the PDF prints, changed; the edit page sends no remark as ''
const changesPdf = (data: Partial<NewUtilityStatement>, existing: StatementWithDetails) =>
	(['paymentDeadline', 'statementDate', 'notes'] as const).some(
		(field) => data[field] !== undefined && (data[field] ?? '') !== (existing[field] ?? '')
	);

/** The apartment's and the building's area, apartments and rooms: what a simple distribution key divides by */
export async function keyValuesOf(buildingId: string, apartmentId: string): Promise<KeyValues | null> {
	const { apartments: all } = await listApartments({ buildingId, limit: 1000 });
	const own = all.find((apartment) => apartment.id === apartmentId);
	if (!own) return null;
	const pair = (value: (apartment: (typeof all)[number]) => number): [number, number] => [value(own), all.reduce((sum, apartment) => sum + value(apartment), 0)];
	return { area: pair((a) => parseFloat(a.area)), units: pair(() => 1), rooms: pair((a) => parseFloat(a.rooms)) };
}

/** A statement goes out dated on the day it is sent (Swiss time), with the full payment deadline, never a shorter one */
export async function datedToday(paymentDeadline: string | null) {
	const statementDate = swissToday();
	const due = daysAfter(statementDate, await getTypedConfig('payment_deadline_days'));
	return { statementDate, paymentDeadline: paymentDeadline && paymentDeadline > due ? paymentDeadline : due };
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

	// Validate status transitions; overdue is not set, it follows from the passed payment deadline
	const validTransitions: Record<string, string[]> = {
		draft: ['sent'],
		sent: ['paid'],
		overdue: ['paid'],
		paid: [],
		settled: []
	};

	if (!validTransitions[existing.status]?.includes(status)) {
		throw new Error(`Invalid status transition from ${existing.status} to ${status}`);
	}

	if (status === 'paid' && additionalData?.paidDate !== undefined) checkPaidDate(additionalData.paidDate, existing.periodEnd);
	const sentToday = status === 'sent' && (await datedToday(existing.paymentDeadline));
	// A Saldo of 0.00, or one below CHF 5 carried over, is «Erledigt» once sent: no payment (#448); a Schlussabrechnung
	// claims or pays out every other Saldo
	const balance = parseFloat(existing.balance);
	const waived = belowMinimum(balance) && !existing.final;
	const settled = sentToday && (balance === 0 || waived) && { status: 'settled' };
	const updateData: Partial<NewUtilityStatement> = {
		status,
		...additionalData,
		...sentToday,
		...settled,
		// the PDF as sent is made anew after sending, with the tenant and settings then, not a draft's of earlier (review C-9)
		...(sentToday && { pdfBlob: null, pdfGeneratedAt: null })
	};
	// paid without an amount: the Saldo, as the tenant pays it or gets it back (#93); below CHF 5 no money moves (#94: a
	// statement settled under #94 whose payment was reset)
	const moved = waived ? '0.00' : existing.balance;
	if (updateData.status === 'paid') Object.assign(updateData, { paidAmount: updateData.paidAmount ?? moved, paymentRecordedAt: new Date() });

	return updateStatement(id, updateData);
}

// #138: a day that exists, up to today; from the end of the Abrechnungsperiode: a tenant may pay before the
// Abrechnungsdatum, which the UI confirms first (#448)
function checkPaidDate(paidDate: string, periodEnd: string) {
	if (!isRealDate(paidDate)) throw new CodedError('PAID_DATE_INVALID', 'Invalid payment date', { date: paidDate });
	if (paidDate < periodEnd) throw new CodedError('PAID_DATE_BEFORE_PERIOD_END', 'Payment date before the end of the period', { date: periodEnd });
	const today = swissToday();
	if (paidDate > today) throw new CodedError('PAID_DATE_IN_FUTURE', 'Payment date in the future', { date: today });
}

/**
 * Take back a recorded payment (#92): back to sent (overdue once the payment deadline has passed), paid date and amount
 * cleared, the reset kept for the Verlauf; a PDF made after the payment was recorded confirms it: it is discarded and made again as sent
 */
export async function resetPayment(id: string): Promise<StatementWithDetails> {
	const existing = await getStatement(id);
	if (!existing) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (existing.status !== 'paid') throw new CodedError('STATEMENT_NOT_PAID', 'Statement is not paid');
	const reset = { resetOn: swissToday(), paidDate: existing.paidDate, paidAmount: existing.paidAmount };
	// only a PDF made after the payment was recorded says so; the one made before stays, with its row in the Verlauf
	const { pdfGeneratedAt, paymentRecordedAt } = existing;
	const paidPdf = pdfGeneratedAt && paymentRecordedAt && pdfGeneratedAt >= paymentRecordedAt;
	const updated = (await updateStatement(id, {
		status: 'sent',
		paidDate: null,
		paidAmount: null,
		paymentRecordedAt: null,
		paymentResets: [...existing.paymentResets, reset],
		...(paidPdf && { pdfBlob: null, pdfGeneratedAt: null })
	}))!;
	await recordAudit('payment_reset', { statementId: id, number: existing.statementNumber, paidDate: existing.paidDate }); // #357
	return updated;
}

/**
 * Replace a sent, overdue, paid or settled (#448) statement (#120): it gets the status «Ersetzt» and stays as it was, its Zahlungsdatum
 * and Saldo included; it is no longer gemahnt and no longer blocks contract dates that change its Mietstage. On a sent
 * or overdue one, `paidAmount` is what was already paid on it, also a part (#448): by the tenant on a Nachzahlung, by
 * the landlord on a refund, which counts negative
 */
export async function replaceStatement(id: string, paidAmount?: string): Promise<StatementWithDetails> {
	const existing = await getStatement(id);
	if (!existing) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (!['sent', 'overdue', 'paid', 'settled'].includes(existing.status))
		throw new CodedError('STATEMENT_NOT_REPLACEABLE', 'Only a sent or paid statement can be replaced');
	const entered = paidAmount === undefined ? undefined : { paidAmount: paidOn(existing, paidAmount) };
	await db.transaction(async (tx) => {
		const paid = entered ?? (await offsetOf(existing, tx));
		await tx.update(utilityStatements).set({ status: 'replaced', ...paid, updatedAt: new Date() }).where(eq(utilityStatements.id, id));
		await recordStatementCorrection(existing, tx); // the Protokoll (#357)
	});
	return (await getStatement(id))!;
}

// A Saldo carried over that a sent next statement counts: the berichtigte Abrechnung offsets it as «Bereits
// verrechnet» (#448, Fachreview 448-1 V-2, 448-2 M-5); a draft that counts it loses it, and once replaced the Saldo
// is no longer carried over: the next statement takes the berichtigte Abrechnung's (448-2 V-14)
async function offsetOf(statement: StatementWithDetails, tx: Tx) {
	const [row] = await tx
		.select({ countedBy })
		.from(utilityStatements)
		.where(and(eq(utilityStatements.id, statement.id), carriable));
	if (!row) return {};
	await tx
		.update(utilityStatements)
		.set({ carriedFromId: null, balance: sql`${utilityStatements.balance} - ${statement.balance}` })
		.where(and(eq(utilityStatements.carriedFromId, statement.id), eq(utilityStatements.status, 'draft')));
	return row.countedBy ? { paidAmount: statement.balance } : {};
}

// «Bereits bezahlt» of a sent or overdue statement, in francs and Rappen
function paidOn(statement: StatementWithDetails, amount: string) {
	if (!['sent', 'overdue'].includes(statement.status))
		throw new CodedError('STATEMENT_PAID_AMOUNT_NOT_OPEN', 'Only a sent or overdue statement takes what was already paid');
	if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) throw new CodedError('STATEMENT_PAID_AMOUNT_INVALID', 'Invalid amount already paid', { amount });
	const paid = Number(amount);
	return (Number(statement.balance) < 0 ? -paid : paid).toFixed(2);
}

// The correction is made without the wizard, which asks whether a category with costs and no answer is agreed (#91):
// it would drop out unasked, so the landlord answers in the wizard first (merge review W10c-2 C-1)
async function refuseOpenAgreements(
	contractId: string,
	buildingId: string,
	periodStart: string,
	periodEnd: string,
	code = 'STATEMENT_AGREEMENTS_OPEN'
) {
	const [contract] = await db
		.select({ id: rentalContracts.id, startDate: rentalContracts.startDate, endDate: rentalContracts.endDate })
		.from(rentalContracts)
		.where(eq(rentalContracts.id, contractId));
	const open = (await agreementsInPeriod({ ...contract, buildingId }, periodStart, periodEnd)).filter((answer) => answer.agreed === null);
	if (!open.length) return;
	const named = await db
		.select({ name: categories.name, nameDE: categories.nameDE })
		.from(categories)
		.where(inArray(categories.id, open.map((answer) => answer.categoryId)));
	throw new CodedError(code, 'Whether the contract agrees these categories is not answered', {
		categories: named.map((category) => category.nameDE || category.name).join(', ')
	});
}

/**
 * The berichtigte Abrechnung of a replaced statement: a draft of the same Mietvertrag and Abrechnungsperiode with the
 * same Heizprofil and Verwaltungspauschale, from today's data, with a new number; none without Mietstage in the period
 */
export async function correctStatement(id: string): Promise<StatementWithDetails> {
	const replaced = await getStatement(id);
	if (!replaced) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (replaced.status !== 'replaced') throw new CodedError('STATEMENT_NOT_REPLACED', 'Statement is not replaced');
	if (replaced.replacedBy)
		throw new CodedError('STATEMENT_ALREADY_CORRECTED', 'Statement already has a berichtigte Abrechnung', {
			number: replaced.replacedBy.statementNumber
		});
	await refuseOpenAgreements(replaced.contractId, replaced.building!.id, replaced.periodStart, replaced.periodEnd);
	try {
		return await generateStatement({
			contractId: replaced.contractId,
			buildingId: replaced.building!.id,
			periodStart: replaced.periodStart,
			periodEnd: replaced.periodEnd,
			heatingProfileId: replaced.heatingProfileId ?? undefined,
			managementFeePercent: replaced.managementFeePercent === null ? undefined : Number(replaced.managementFeePercent)
		});
	} catch (error) {
		if (!(error instanceof CodedError && error.code === 'CONTRACT_NOT_IN_PERIOD')) throw error;
		// what the tenant paid comes back to him, a refund paid to him goes back to the landlord; only sent: nothing
		const paid = paidSoFar(replaced);
		const params = { number: replaced.statementNumber, amount: formatCHF(Math.abs(paid)) };
		const message = 'The contract has no rent days in the period';
		if (paid > 0) throw new CodedError('STATEMENT_NO_RENTAL_DAYS_PAID', message, params);
		if (paid < 0) throw new CodedError('STATEMENT_NO_RENTAL_DAYS_REFUNDED', message, params);
		throw new CodedError('STATEMENT_NO_RENTAL_DAYS_SENT', message, params);
	}
}

/**
 * Delete a statement
 */
export async function deleteStatement(id: string): Promise<{ success: boolean } & Partial<Refusal>> {
	const existing = await getStatement(id);
	if (!existing) {
		return { success: false, ...refusal('STATEMENT_NOT_FOUND', 'Statement not found') };
	}

	// Only a draft may be deleted; once sent, the statement stays as the tenant received it
	if (existing.status !== 'draft') {
		return { success: false, ...refusal('STATEMENT_NOT_DRAFT', 'Cannot delete a statement that is no longer a draft') };
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

	if (statement.status !== 'draft') {
		throw new Error('Cannot add line items to a statement that is no longer a draft');
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
 * Statements per status, over the same filters as the list (all but the status itself),
 * so the status tabs count what the list can show
 */
export async function getStatementCountsByStatus(filters: Omit<StatementFilters, 'status'> = {}): Promise<{
	draft: number;
	sent: number;
	paid: number;
	settled: number;
	overdue: number;
	total: number;
}> {
	const counted = (status: string) => sql<number>`count(*) filter (where ${statusCondition(status)})`;
	const [row] = await db
		.select({
			draft: counted('draft'),
			sent: counted('sent'),
			paid: counted('paid'),
			settled: counted('settled'),
			overdue: counted('overdue'),
			total: sql<number>`count(*)`
		})
		.from(utilityStatements)
		.leftJoin(tenants, eq(utilityStatements.tenantId, tenants.id))
		.leftJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
		.where(and(...statementFilterConditions(filters)));

	return {
		draft: Number(row.draft),
		sent: Number(row.sent),
		paid: Number(row.paid),
		settled: Number(row.settled),
		overdue: Number(row.overdue),
		total: Number(row.total)
	};
}

