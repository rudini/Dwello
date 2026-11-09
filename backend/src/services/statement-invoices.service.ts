/**
 * What changed in a statement's invoices since it was created (#96): its positions keep the invoices they billed, so
 * an invoice of the period that no position bills as it is now was recorded or changed since, and a billed one that
 * left the period was deleted or made non-allocable
 */

import { eq, max } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, buildings, distributionKeys, invoices, utilityStatements, type UtilityStatementLineItem } from '../db/schema';
import { CodedError } from './coded-error';
import { invoiceSplitKeys } from './invoice-completeness.service';
import { getInvoicesForStatement } from './invoice.service';
import { agreedIn, uncalculableKeyInvoices } from './held-invoices';
import { getStatement, listStatements } from './statement-query.service';
import { agreedStock, agreedStockOf, recalculation } from './statement-generation.service';
import { apartmentsByBuilding } from './apartment.service';
import { fuelStockChange, periodReadings } from './fuel-stock.service';
import type { StatementWithDetails } from '../api/statement';
import { olderThanFiveYears, swissToday } from './today';
import { counting, isReplaced } from './counting-statements';

type PeriodInvoice = Awaited<ReturnType<typeof getInvoicesForStatement>>[number];
type Positions = Pick<UtilityStatementLineItem, 'categoryId' | 'distributionKeyId' | 'invoices'>[];

// Billed as it is now: in the position of its category and key, with its amount and days in the period
const billedAsIs = (positions: Positions, invoice: PeriodInvoice) =>
	positions.some(
		(position) =>
			position.categoryId === invoice.categoryId &&
			position.distributionKeyId === invoice.distributionKeyId &&
			position.invoices?.some(
				({ id, amount, start, end }) =>
					id === invoice.id && amount === invoice.inPeriod.amount && start === invoice.inPeriod.start && end === invoice.inPeriod.end
			)
	);

// A statement created before #96 keeps no invoices: for it, as before, an invoice recorded after it is missing (V-15)
const known = (positions: Positions) => positions.every((position) => position.invoices);
const recordedAfter = (invoice: { createdAt: Date }, statement: { createdAt: Date }) => invoice.createdAt > statement.createdAt;

type Located = StatementWithDetails & { building: { id: string } };

/**
 * How the changes of a statement get its period's invoices and Tankbestand and, for a correctable one, the statement
 * to recalculate: straight from the database, or once per building and period for a list (#919: the overview checks
 * every statement, one query each took a second for 50 apartments)
 */
type Loaders = {
	invoices: (s: Located) => Promise<PeriodInvoice[]>;
	stock: (s: Located) => Promise<Stock>;
	full: (s: Located) => Promise<StatementWithDetails | null>;
	keys: (s: Located) => Promise<Awaited<ReturnType<typeof uncalculableKeyInvoices>>>;
	valuesChangedAt: (s: Located) => Promise<Date>;
};

// #1328 (PO A'): when an apartment of the building was last changed or deleted (its building's updated_at, PO), and
// when each Verteilschlüssel was
async function apartmentsChangedAt(buildingId: string) {
	const [[apartment], [building]] = await Promise.all([
		db.select({ at: max(apartments.updatedAt) }).from(apartments).where(eq(apartments.buildingId, buildingId)),
		db.select({ at: buildings.updatedAt }).from(buildings).where(eq(buildings.id, buildingId))
	]);
	return new Date(Math.max(apartment?.at?.getTime() ?? 0, building?.at.getTime() ?? 0));
}
const keysChangedAt = async () =>
	new Map((await db.select({ id: distributionKeys.id, at: distributionKeys.updatedAt }).from(distributionKeys)).map(({ id, at }) => [id, at]));

// the last change of an apartment of its building or of a key its positions split by (Code-Review 1328-1 C-2)
function lastValueChange(s: Located, apartmentsAt: Date | null, keysAt: Map<string, Date>) {
	const times = [apartmentsAt, ...s.lineItems.map((item) => keysAt.get(item.distributionKeyId ?? ''))];
	return new Date(Math.max(0, ...times.map((at) => at?.getTime() ?? 0)));
}
const periodOf = (s: Located) => ({ buildingId: s.building.id, periodStart: s.periodStart, periodEnd: s.periodEnd });
const direct: Loaders = {
	invoices: (s) => getInvoicesForStatement(s.building.id, s.periodStart, s.periodEnd),
	stock: (s) => agreedStock(periodOf(s), s.agreedCategoryIds),
	full: async (s) => s,
	keys: (s) => uncalculableKeyInvoices(s.building.id, s.periodStart, s.periodEnd),
	valuesChangedAt: async (s) => lastValueChange(s, await apartmentsChangedAt(s.building.id), await keysChangedAt())
};
function perPeriod(): Loaders {
	const memo = new Map<string, Promise<unknown>>();
	const once = <T>(key: string, load: () => Promise<T>) => {
		if (!memo.has(key)) memo.set(key, load());
		return memo.get(key) as Promise<T>;
	};
	const key = (s: Located) => `${s.building.id} ${s.periodStart} ${s.periodEnd}`;
	const readings = (s: Located) => once(`readings ${key(s)}`, () => periodReadings(s.building.id, s.periodStart, s.periodEnd));
	const invoices = (s: Located) => once(`invoices ${key(s)}`, () => getInvoicesForStatement(s.building.id, s.periodStart, s.periodEnd, readings(s)));
	const change = (s: Located) => once(`change ${key(s)}`, () => fuelStockChange(s.building.id, s.periodStart, s.periodEnd, readings(s)));
	// the key check shares what the list loads anyway, and the apartments once per building (P2, #922)
	const apartments = async (s: Located) => (await once('apartments', apartmentsByBuilding)).get(s.building.id) ?? [];
	return {
		invoices,
		stock: async (s) => agreedStockOf(await change(s), s.agreedCategoryIds),
		full: (s) => getStatement(s.id), // a listed statement lacks what the recalculation reads
		keys: (s) =>
			once(`keys ${key(s)}`, async () =>
				uncalculableKeyInvoices(s.building.id, s.periodStart, s.periodEnd, { bills: await invoices(s), change: await change(s), apartments: () => apartments(s) })
			),
		valuesChangedAt: async (s) =>
			lastValueChange(s, await once(`apartments ${s.building.id}`, () => apartmentsChangedAt(s.building.id)), await once('keys', keysChangedAt))
	};
}

// The invoices of a statement's period recorded, changed or deleted since it was created
async function changedInvoices(statement: Located, load: Loaders): Promise<string[]> {
	const positions = statement.lineItems;
	const now = agreedIn(statement, await load.invoices(statement));
	if (!known(positions)) return now.filter((invoice) => recordedAfter(invoice, statement)).map((invoice) => invoice.id);
	const changed = now.filter((invoice) => !billedAsIs(positions, invoice)).map((invoice) => invoice.id);
	const gone = positions
		.flatMap((position) => position.invoices ?? [])
		.filter((billed) => !billed.fuelStock && !now.some((invoice) => invoice.id === billed.id))
		.map((billed) => billed.id);
	return [...changed, ...gone];
}

type Stock = { categoryId: string; openingDate: string; opening: string; closingDate: string; closing: string } | null;
const sameStock = (a: Stock, b: Stock) =>
	a === b ||
	(!!a &&
		!!b &&
		a.categoryId === b.categoryId &&
		a.openingDate === b.openingDate &&
		a.closingDate === b.closingDate &&
		Number(a.opening) === Number(b.opening) &&
		Number(a.closing) === Number(b.closing));

// #454 (#408 point 8, Fachreview 454-1 E-2, V-3): the readings the statement was created with against those it would
// take now, also for a statement before migration 0014
const fuelStockChanged = async (statement: Located, load: Loaders) => !sameStock(statement.fuelStock, await load.stock(statement));

// #1309 (product owner): the keys of the invoices it bills (and of its Veränderung Tankbestand) that cannot be
// calculated for the building; before #1221 Dwello split them equally (Fachreview 1309-1 V-2, V-3)
async function uncalculableKeys(statement: Located, load: Loaders) {
	const failing = agreedIn(statement, await load.keys(statement));
	// with their invoices, for the hint to name (persona Anna 1309 P-1)
	return [...new Set(failing.map((bill) => bill.distributionKeyName))].map((key) => {
		const held = failing.filter((bill) => bill.distributionKeyName === key);
		const [{ reason, apartment }] = held;
		// a delivery of another period whose key distributes the Veränderung Tankbestand says so (code review 1309-2 C-4)
		const invoices = held.map(({ id, billingEntityName, description, invoiceDate, amount, ...rest }) => ({
			id,
			billingEntityName,
			description,
			invoiceDate,
			amount,
			fuelStock: 'fuelStock' in rest
		}));
		return { key, reason, apartment, invoices };
	});
}

const CORRECTED = ['sent', 'overdue', 'paid', 'settled']; // what a berichtigte Abrechnung replaces (Fachreview 454-2 V-23); overdue: sent, past its Zahlungsfrist

/**
 * What changed in a statement's period since it was created: its invoices (#96) and its Tankbestand (#454); for a
 * statement a berichtigte Abrechnung would replace, whether correcting it is due: only when the hint names a change and
 * recalculating changes the Saldo or a share of the tenant, unless the landlord chose «Nicht berichtigen» for that very
 * result (Fachreview 454-1 E-3, E-6, 454-2 V-18, V-21), and whether he may: only when the raw Saldo does not fall,
 * below CHF 5 too; a Nachzahlung waived under #94 counts as 0 (M-3 B, #1023).
 * Null without the statement
 */
export async function statementChanges(statementId: string) {
	const statement = await getStatement(statementId);
	const changes = await changesOf(statement, direct);
	if (!changes) return null;
	// #528: what «Neu berechnen» would bill in a line of its own, from the invoices as they are (Fachreview 528-1 V-1);
	// only here, not for the lists of the Übersicht (Code-Review 528-1 C-2)
	const period = { start: statement!.periodStart, end: statement!.periodEnd };
	return { ...changes, carryOverChanged: !!statement!.carryChanged, splitKeys: await invoiceSplitKeys(statement!.building!.id, period) }; // #506 C
}

// #1328 (PO A'): a draft, current by its Übertrag, of a building whose apartments or a key changed since it was created
const valuesTouched = async (statement: Located, load: Loaders) =>
	statement.status === 'draft' && !statement.carryChanged && (await load.valuesChangedAt(statement)) > statement.createdAt;

type Check = Awaited<ReturnType<typeof recalculation>>;

// whether correcting a statement the hint names a change of is due, and may be declined
function correctionOf(statement: StatementWithDetails, correctable: boolean, check: Check) {
	// not to be recalculated (e.g. the contract changed since): the hint alone says to correct, as before #454
	const due = correctable && (check ? check.changes && check.result !== statement.correctionDeclined?.result : true);
	return {
		correctionDue: due,
		correctionDeclinable: due && !!check?.raises,
		correctionLowers: due && !!check?.lowers, // the page says why «Nicht berichtigen» is missing (Fachreview 454-3 V-32)
		recalculated: (due && check?.now) || null // #546: the Saldo the recalculation gives, for the hint and «Nicht berichtigen»
	};
}

async function changesOf(statement: StatementWithDetails | null, load: Loaders) {
	if (!statement?.building) return null;
	const located = statement as Located;
	const invoiceIds = await changedInvoices(located, load);
	const fuelStock = await fuelStockChanged(located, load);
	const keys = await uncalculableKeys(located, load);
	const correctable = CORRECTED.includes(statement.status) && (invoiceIds.length > 0 || fuelStock || keys.length > 0);
	const touched = !invoiceIds.length && !fuelStock && !keys.length && (await valuesTouched(located, load));
	// a key that cannot be calculated: recalculating would split equally, so there is no Saldo to show (#1309)
	const full = (correctable || touched) && !keys.length ? await load.full(located) : null;
	const check = full ? await recalculation(full) : null;
	return {
		invoiceIds,
		fuelStockChanged: fuelStock,
		uncalculableKeys: keys,
		valuesChanged: touched && !!check?.changes, // «Neu berechnen» would split it otherwise
		...correctionOf(statement, correctable, check),
		result: check?.result
	};
}

/** «Nicht berichtigen» (#454, E-6): remembers the day and the result; refused when the recalculation lowers the Saldo */
export async function declineCorrection(statementId: string) {
	const changes = await statementChanges(statementId);
	if (!changes) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (!changes.correctionDue) throw new CodedError('STATEMENT_CORRECTION_NOT_DUE', 'No correction is due');
	if (!changes.result) throw new CodedError('STATEMENT_CORRECTION_NOT_RECALCULABLE', 'The statement cannot be recalculated'); // V-31
	if (!changes.correctionDeclinable)
		throw new CodedError('STATEMENT_CORRECTION_LOWERS_BALANCE', 'The recalculation lowers the Saldo: correct the statement');
	await db
		.update(utilityStatements)
		.set({ correctionDeclined: { on: swissToday(), result: changes.result! }, updatedAt: new Date() })
		.where(eq(utilityStatements.id, statementId));
	return (await getStatement(statementId))!;
}

/**
 * #1126: the listed statements whose invoices or Tankbestand changed since they were created, and the drafts whose
 * values did (#1328) («Nicht aktuelle Abrechnung»), and apart from them those that bill a key that cannot be calculated
 * for the building (#1309)
 */
export async function notUpToDate<S extends StatementWithDetails>(statements: S[]) {
	const load = perPeriod();
	const why = async (s: S) => {
		if (!s.building) return null;
		if ((await uncalculableKeys(s as Located, load)).length) return 'key';
		const changed =
			(await changedInvoices(s as Located, load)).length > 0 ||
			(await fuelStockChanged(s as Located, load)) ||
			(s.status === 'draft' && draftOutdated(await changesOf(s, load)));
		return changed ? 'changed' : null;
	};
	const reasons = await Promise.all(statements.map(why));
	return {
		changed: statements.filter((_, i) => reasons[i] === 'changed'),
		keyNotCalculable: statements.filter((_, i) => reasons[i] === 'key')
	};
}

/** A draft outdated by invoices or a Tankbestand changed since its creation (#454, #408 point 8), or by values (#1328) */
export const draftOutdated = (changes: Awaited<ReturnType<typeof changesOf>>) =>
	!!changes && (changes.invoiceIds.length > 0 || changes.fuelStockChanged || changes.uncalculableKeys.length > 0 || changes.valuesChanged);

/** The drafts to send: the current ones (#454); the overview takes the number (H-28, #717) */
export async function draftsToSend() {
	const { statements } = await listStatements({ status: 'draft', limit: null });
	const load = perPeriod();
	// a draft that would count another Übertrag now is not to send either (Fachreview 506-1 V-8)
	const outdated = await Promise.all(statements.map(async (s) => s.carryChanged || draftOutdated(await changesOf(s, load))));
	return outdated.filter((one) => !one).length;
}

/**
 * #454 (#408 point 7): for the Übersicht, the drafts with a change since and the statements due for correcting, with
 * building, period and what changed
 */
export async function outdatedStatements() {
	const { statements } = await listStatements({ limit: null });
	const load = perPeriod();
	const listed = await Promise.all(
		counting(statements)
			.map(async (s) => {
				const changes = await changesOf(s, load);
				// a draft that would count another Übertrag now as well (#981 A, Fachreview 529-1 V-5)
				const outdated = s.status === 'draft' ? s.carryChanged || draftOutdated(changes) : changes?.correctionDue;
				return outdated
					? {
							id: s.id,
							statementNumber: s.statementNumber,
							tenantName: s.tenant ? `${s.tenant.firstName} ${s.tenant.lastName}` : '',
							status: s.status,
							buildingId: s.building!.id,
							building: s.building!.name,
							periodStart: s.periodStart,
							periodEnd: s.periodEnd,
							invoices: changes!.invoiceIds.length,
							fuelStock: changes!.fuelStockChanged,
							uncalculableKeys: changes!.uncalculableKeys.length > 0, // #1309: the task says why
							values: changes!.valuesChanged,
							// PO 2026-10-20 (Fachreview 454-1 E-5): the overview adds the sentence on the Verjährung
							olderThanFiveYears: olderThanFiveYears(s.periodEnd, swissToday())
						}
					: null;
			})
	);
	return listed.filter((one) => one !== null);
}

type Period = { start: string; end: string };
type Statement = { lineItems: Positions; agreedCategoryIds: string[] | null; createdAt: Date };

// Whether a statement bills the invoice, and whether it lacks the invoice as it is now (now: the invoice as the
// statement's period bills it, if at all); missing only where the contract agreed its category (#91, V-2), billed
// stays billed in another category (code review C-1)
function stateIn(statement: Statement, now: PeriodInvoice | undefined, invoiceId: string) {
	const positions = statement.lineItems;
	const billed = known(positions)
		? positions.some((position) => position.invoices?.some((one) => one.id === invoiceId))
		: !!now && !recordedAfter(now, statement);
	const missable = agreedIn(statement, now ? [now] : [])[0];
	const missed = !!missable && (known(positions) ? !billedAsIs(positions, missable) : recordedAfter(missable, statement));
	return { billed, missed };
}

type Billing = { id: string; statementNumber: string; status: string };

/**
 * The periods with statements of the invoice's building that bill it (in any state: billedIn) and that lack it as it
 * is now (missedIn: created before it was recorded or changed; replaced statements excluded, #980); a period can be
 * in both. And each statement that bills it, with its number and status (#455). Null without the invoice
 */
export async function invoiceStatements(
	invoiceId: string
): Promise<{ billedIn: Period[]; missedIn: Period[]; statements: Billing[] } | null> {
	const [invoice] = await db.select({ buildingId: invoices.buildingId }).from(invoices).where(eq(invoices.id, invoiceId));
	if (!invoice) return null;
	const { statements } = await listStatements({ buildingId: invoice.buildingId, limit: null });
	const billedIn = new Map<string, Period>();
	const missedIn = new Map<string, Period>();
	const billing: Billing[] = [];
	const nowIn = new Map<string, PeriodInvoice | undefined>(); // the invoice as each period bills it now, if at all
	for (const statement of statements) {
		const period = { start: statement.periodStart, end: statement.periodEnd };
		const key = `${period.start}/${period.end}`;
		if (!nowIn.has(key))
			nowIn.set(key, (await getInvoicesForStatement(invoice.buildingId, period.start, period.end)).find((one) => one.id === invoiceId));
		const { billed, missed } = stateIn(statement, nowIn.get(key), invoiceId);
		if (billed) billedIn.set(key, period);
		if (billed) billing.push({ id: statement.id, statementNumber: statement.statementNumber, status: statement.status });
		// a replaced statement stays as it was and never gets the invoice: it misses nothing (#980)
		if (missed && !isReplaced(statement)) missedIn.set(key, period);
	}
	return { billedIn: [...billedIn.values()], missedIn: [...missedIn.values()], statements: billing };
}
