/**
 * What changed in a statement's invoices since it was created (#96): its positions keep the invoices they billed, so
 * an invoice of the period that no position bills as it is now was recorded or changed since, and a billed one that
 * left the period was deleted or made non-allocable
 */

import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices, utilityStatements, type UtilityStatementLineItem } from '../db/schema';
import { CodedError } from './coded-error';
import { getInvoicesForStatement } from './invoice.service';
import { agreedStock, getStatement, listStatements, recalculation, type StatementWithDetails } from './statement.service';
import { swissToday } from './today';

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

// The invoices of the categories its contract agreed when it was created; a statement before #91 billed every one
const agreedIn = <T extends { categoryId: string | null }>(statement: { agreedCategoryIds: string[] | null }, list: T[]) =>
	list.filter((invoice) => !statement.agreedCategoryIds || !invoice.categoryId || statement.agreedCategoryIds.includes(invoice.categoryId));

// A statement created before #96 keeps no invoices: for it, as before, an invoice recorded after it is missing (V-15)
const known = (positions: Positions) => positions.every((position) => position.invoices);
const recordedAfter = (invoice: { createdAt: Date }, statement: { createdAt: Date }) => invoice.createdAt > statement.createdAt;

// The invoices of a statement's period recorded, changed or deleted since it was created
async function changedInvoices(statement: StatementWithDetails & { building: { id: string } }): Promise<string[]> {
	const positions = statement.lineItems;
	const now = agreedIn(statement, await getInvoicesForStatement(statement.building.id, statement.periodStart, statement.periodEnd));
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
const fuelStockChanged = async (statement: StatementWithDetails & { building: { id: string } }) =>
	!sameStock(statement.fuelStock, await agreedStock({ buildingId: statement.building.id, periodStart: statement.periodStart, periodEnd: statement.periodEnd }, statement.agreedCategoryIds));

const CORRECTED = ['sent', 'overdue', 'paid', 'settled']; // what a berichtigte Abrechnung replaces (Fachreview 454-2 V-23); overdue: sent, past its Zahlungsfrist

/**
 * What changed in a statement's period since it was created: its invoices (#96) and its Tankbestand (#454); for a
 * statement a berichtigte Abrechnung would replace, whether correcting it is due: only when the hint names a change and
 * recalculating changes the Saldo or a share of the tenant, unless the landlord chose «Nicht berichtigen» for that very
 * result (Fachreview 454-1 E-3, E-6, 454-2 V-18, V-21), and whether he may: only when the Saldo as claimed does not
 * fall (M-3 B, 454-3 V-30 A).
 * Null without the statement
 */
export async function statementChanges(statementId: string) {
	const statement = await getStatement(statementId);
	if (!statement?.building) return null;
	const building = statement as typeof statement & { building: { id: string } };
	const invoiceIds = await changedInvoices(building);
	const fuelStock = await fuelStockChanged(building);
	const correctable = CORRECTED.includes(statement.status) && (invoiceIds.length > 0 || fuelStock);
	const check = correctable ? await recalculation(statement) : null;
	// not to be recalculated (e.g. the contract changed since): the hint alone says to correct, as before #454
	const due = check ? check.changes && check.result !== statement.correctionDeclined?.result : correctable;
	return {
		invoiceIds,
		fuelStockChanged: fuelStock,
		correctionDue: due,
		correctionDeclinable: due && !!check?.raises,
		correctionLowers: due && !!check?.lowers, // the page says why «Nicht berichtigen» is missing (Fachreview 454-3 V-32)
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
 * #454 (#408 point 7): for the Übersicht, the drafts with a change since and the statements due for correcting, with
 * building, period and what changed
 */
/** A draft outdated by invoices or a Tankbestand changed since its creation (#454, #408 point 8) */
export const draftOutdated = (changes: Awaited<ReturnType<typeof statementChanges>>) =>
	!!changes && (changes.invoiceIds.length > 0 || changes.fuelStockChanged);

/** The drafts to send: the current ones (#454); the overview takes the number (H-28, #717) */
export async function draftsToSend() {
	const { statements } = await listStatements({ status: 'draft', limit: 1000 });
	const outdated = await Promise.all(statements.map(async (s) => draftOutdated(await statementChanges(s.id))));
	return outdated.filter((one) => !one).length;
}

export async function outdatedStatements() {
	const { statements } = await listStatements({ limit: 1000 });
	const listed = await Promise.all(
		statements
			.filter((s) => s.status !== 'replaced')
			.map(async (s) => {
				const changes = await statementChanges(s.id);
				const outdated = s.status === 'draft' ? draftOutdated(changes) : changes?.correctionDue;
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
							fuelStock: changes!.fuelStockChanged
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
 * is now (missedIn: created before it was recorded or changed); a period can be in both. And each statement that bills
 * it, with its number and status (#455). Null without the invoice
 */
export async function invoiceStatements(
	invoiceId: string
): Promise<{ billedIn: Period[]; missedIn: Period[]; statements: Billing[] } | null> {
	const [invoice] = await db.select({ buildingId: invoices.buildingId }).from(invoices).where(eq(invoices.id, invoiceId));
	if (!invoice) return null;
	const { statements } = await listStatements({ buildingId: invoice.buildingId, limit: 1000 });
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
		if (missed) missedIn.set(key, period);
	}
	return { billedIn: [...billedIn.values()], missedIn: [...missedIn.values()], statements: billing };
}
