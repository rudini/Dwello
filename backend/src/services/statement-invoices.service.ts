/**
 * What changed in a statement's invoices since it was created (#96): its positions keep the invoices they billed, so
 * an invoice of the period that no position bills as it is now was recorded or changed since, and a billed one that
 * left the period was deleted or made non-allocable
 */

import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices, type UtilityStatementLineItem } from '../db/schema';
import { getInvoicesForStatement } from './invoice.service';
import { getStatement, listStatements } from './statement.service';

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

/** The invoices of a statement's period recorded, changed or deleted since it was created; null without the statement */
export async function changedInvoices(statementId: string): Promise<string[] | null> {
	const statement = await getStatement(statementId);
	if (!statement?.building) return null;
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
