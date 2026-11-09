/**
 * Statements as they are read: the list with its filters and counts, one statement with its details
 */
import { eq, sql, desc, and, gte, lte, lt, ilike, or, inArray, getTableColumns } from 'drizzle-orm';
import { containing, db, paged } from '../db/connection';
import {
	utilityStatements,
	utilityStatementLineItems,
	tenants,
	apartments,
	buildings,
	documents,
	heatingProfiles,
	type UtilityStatementLineItem,
	type StoredStatementStatus,
	categories,
	rentalContracts
} from '../db/schema';
import { getTypedConfig } from './config.service';
import { splitKeysOf } from './split-keys';
import { sendingsOf, sinceDelivery } from './delivery';
import { oldAddress } from './old-address';
import { isReplaced } from './counting-statements';
import { daysAfter, swissToday } from './today';
import { advanceChanged, paymentOf } from './statement-payment';
import { carryChanged, countedBy, openCarry } from './carry-over';
import type { StatementWithDetails } from '../api/statement';

export interface StatementFilters {
	search?: string;
	contractId?: string;
	buildingId?: string;
	apartmentId?: string;
	tenantId?: string;
	status?: string;
	periodStart?: string;
	periodEnd?: string;
	limit?: number | null; // null: every statement (#705)
	offset?: number;
}

// The base64 PDF is only served by the /pdf routes, never with list or detail data
const { pdfBlob: _pdfBlob, ...tableColumns } = getTableColumns(utilityStatements);

// The day after the last sent reminder's Zahlungsfrist, from which the next Mahnstufe is possible (#107); none after the 3rd
// and none once paid
const nextReminderFrom = sql<string | null>`(
	select case when count(*) < 3 and ${utilityStatements.status} = 'sent' then (max(${documents.paymentDeadline}) + 1)::text end
	from ${documents}
	where ${documents.statementId} = ${utilityStatements.id} and ${documents.type} = 'reminder' and ${documents.status} = 'sent'
		and ${sinceDelivery(utilityStatements.id)}
)`;

// The Swiss day the last reminder went out (sent_at holds UTC): a letter counts once marked sent, not when it was made (#545)
const reminderSentDate = sql<string | null>`(
	select (max(${documents.sentAt}) at time zone 'UTC' at time zone 'Europe/Zurich')::date::text
	from ${documents}
	where ${documents.statementId} = ${utilityStatements.id} and ${documents.type} = 'reminder' and ${documents.status} = 'sent'
		and ${sinceDelivery(utilityStatements.id)}
)`;

// The reminders that count for the next Mahnstufe: those since the last sending (#534, Code-Review 534-1 C-1)
const remindersCounted = sql<number>`(
	select count(*)::int from ${documents}
	where ${documents.statementId} = ${utilityStatements.id} and ${documents.type} = 'reminder' and ${sinceDelivery(utilityStatements.id)}
)`;

// A reminder still «Zu versenden»: the next Mahnstufe waits until it is marked sent (#449, decided in #404, point 2)
const reminderToSend = sql<boolean>`exists (
	select 1 from ${documents}
	where ${documents.statementId} = ${utilityStatements.id} and ${documents.type} = 'reminder' and ${documents.status} = 'to_send'
		and ${sinceDelivery(utilityStatements.id)}
)`;

// the Schlussabrechnung: the Mietvertrag ends within the period; it has no Mindestbetrag and carries nothing over (#448)
const final = sql<boolean>`exists (
	select 1 from ${rentalContracts}
	where ${rentalContracts.id} = ${utilityStatements.contractId}
		and ${rentalContracts.endDate} between ${utilityStatements.periodStart} and ${utilityStatements.periodEnd}
)`;

/**
 * An overdue statement whose Mahnung waits: one still «Zu versenden» holds the next (#449), the next one comes after the
 * last one's Zahlungsfrist (#107), the first after the Mahnfrist (#64); a Rückerstattung is due at once (Fachreview V-1)
 */
const reminderWaits = (
	s: { reminderToSend: boolean; nextReminderFrom: string | null; balance: string; paymentDeadline: string | null },
	today: string,
	mahnfrist: number
) =>
	s.reminderToSend ||
	(s.nextReminderFrom ? s.nextReminderFrom > today : Number(s.balance) >= 0 && s.paymentDeadline! >= daysAfter(today, -mahnfrist));

const statementColumns = { ...tableColumns, reminderSentDate, nextReminderFrom, reminderToSend, remindersCounted, final, oldAddress: oldAddress(utilityStatements.contractId), openCarry, carryChanged };

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
	// a status the list does not know finds nothing
	return eq(utilityStatements.status, status as StoredStatementStatus);
}

/**
 * Where conditions for listStatements; tenant and building columns come from its joins
 */
function statementFilterConditions(filters: StatementFilters) {
	const { search, contractId, buildingId, apartmentId, tenantId, status, periodStart, periodEnd } = filters;
	return [
		search &&
			or(
				ilike(utilityStatements.statementNumber, containing(search)),
				ilike(sql`${tenants.firstName} || ' ' || ${tenants.lastName}`, containing(search))
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
	const ordered = db
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
		.$dynamic();
	const results = await paged(ordered, limit, offset);

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
	const mahnfrist = await getTypedConfig('reminder_after_days');
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
			...paymentOf({ ...row.statement, status: effectiveStatus }, today),
			asksPayment: !isReplaced(row.statement), // the row names the rest of a part payment by it (#959)
			reminderDue: effectiveStatus === 'overdue' ? !reminderWaits(row.statement, today, mahnfrist) : null,
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

// Whether a position of the statement is a heating cost
async function billsHeating(lineItems: { categoryId: string | null }[]) {
	const ids = lineItems.flatMap((item) => item.categoryId ?? []);
	if (!ids.length) return false;
	const [heating] = await db.select({ id: categories.id }).from(categories).where(and(inArray(categories.id, ids), eq(categories.isHeatingCost, true))).limit(1);
	return !!heating;
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
				nameEN: heatingProfiles.nameEN,
				type: heatingProfiles.type,
				sourceDE: heatingProfiles.sourceDE,
				sourceFR: heatingProfiles.sourceFR,
				sourceIT: heatingProfiles.sourceIT,
				sourceEN: heatingProfiles.sourceEN
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
		...paymentOf({ ...result.statement, status: effectiveStatus }, today),
		tenant: result.tenant,
		apartment: result.apartment,
		building: result.building,
		// without a heating cost position the chosen profile was not applied: it names none (#280, #451 point 8)
		heatingProfile: (await billsHeating(lineItems)) ? result.heatingProfile : null,
		...withOtherKeys(lineItems),
		...(await correctionsOf(result.statement)),
		carriedFrom: await carriedFromOf(result.statement.carriedFromId),
		...allowed(result.statement.status),
		refund: Number(result.statement.balance) < 0,
		...(await laterSendings(id, result.statement.status))
	};
}

// #528: a line of a Kategorie with several Verteilschlüssel whose key is not the Kategorie's: the PDF names its invoices
function withOtherKeys<T extends UtilityStatementLineItem>(lineItems: T[]) {
	const parts = lineItems.map((item) => ({ ...item, amount: Number(item.totalAmount), invoices: item.invoices ?? [] }));
	const split = splitKeysOf(parts);
	const differs = (item: T) => split.some((other) => other.categoryId === item.categoryId && other.keyId === item.distributionKeyId);
	// the draft's hint names those of a Kategorie (Persona Dr. Weber 528 P-1; without one «Neu berechnen» refuses, V-6)
	return { lineItems: lineItems.map((item) => ({ ...item, otherKey: differs(item) })), splitKeys: split.filter((other) => other.categoryId) };
}

// #534, #968: the later sendings for the Verlauf; a new PDF goes out only while the statement is sent (V-3)
async function laterSendings(id: string, status: string) {
	const { resent, newPdfToSend, newPdfMadeAt, pdfBeforeChange } = await sendingsOf(id);
	return { resent, pdfBeforeChange, ...(status === 'sent' ? { newPdfToSend, newPdfMadeAt } : { newPdfToSend: null, newPdfMadeAt: null }) };
}

/**
 * What the statement allows (#788): the frontend shows buttons and hints by it and only labels the status. A replaced
 * one stays as sent and asks for nothing, its berichtigte Abrechnung does (#120); a draft is calculated again or
 * deleted, a sent one corrected (#358)
 */
function allowed(status: string) {
	const current = !isReplaced({ status });
	return { editable: current, correctable: current && status !== 'draft', asksPayment: current, superseded: !current, redeliverable: current && status === 'sent' };
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
async function correctionsOf(statement: { id: string; replacesId: string | null; status: string; totalAdvancePayments: string }) {
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
	return { replaces, replacedBy: replacedBy ?? null, priorPaidOn, offsetWith, advanceChanged: advanceChanged(statement, replaces) };
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
