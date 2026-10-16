/**
 * What changed in a statement's invoices since it was created (#96): its positions keep the invoices they billed, so
 * an invoice of the period that no position bills as it is now was recorded or changed since, and a billed one that
 * left the period was deleted or made non-allocable
 */

import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices, utilityStatementLineItems, type UtilityStatementLineItem } from '../db/schema';
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

// A statement created before #96 keeps no invoices: nothing is known about them
const known = (positions: Positions) => positions.every((position) => position.invoices);

/** The invoices of a statement's period recorded, changed or deleted since it was created; null without the statement */
export async function changedInvoices(statementId: string): Promise<string[] | null> {
	const statement = await getStatement(statementId);
	if (!statement?.building) return null;
	const positions = statement.lineItems;
	if (!known(positions)) return [];
	const now = await getInvoicesForStatement(statement.building.id, statement.periodStart, statement.periodEnd);
	const changed = now.filter((invoice) => !billedAsIs(positions, invoice)).map((invoice) => invoice.id);
	const gone = positions
		.flatMap((position) => position.invoices ?? [])
		.filter((billed) => !billed.fuelStock && !now.some((invoice) => invoice.id === billed.id))
		.map((billed) => billed.id);
	return [...changed, ...gone];
}

type Period = { start: string; end: string };

/**
 * The periods with statements of the invoice's building that bill it (in any state: billedIn) and that lack it as it
 * is now (missedIn: created before it was recorded or changed); a period can be in both. Null without the invoice
 */
export async function invoiceStatements(invoiceId: string): Promise<{ billedIn: Period[]; missedIn: Period[] } | null> {
	const [invoice] = await db.select({ buildingId: invoices.buildingId }).from(invoices).where(eq(invoices.id, invoiceId));
	if (!invoice) return null;
	const { statements } = await listStatements({ buildingId: invoice.buildingId, limit: 1000 });
	const rows = statements.length
		? await db
				.select()
				.from(utilityStatementLineItems)
				.where(inArray(utilityStatementLineItems.statementId, statements.map((statement) => statement.id)))
		: [];
	const billedIn = new Map<string, Period>();
	const missedIn = new Map<string, Period>();
	const nowIn = new Map<string, PeriodInvoice | undefined>(); // the invoice as each period bills it now, if at all
	for (const statement of statements) {
		const positions = rows.filter((row) => row.statementId === statement.id);
		if (!known(positions)) continue;
		const period = { start: statement.periodStart, end: statement.periodEnd };
		const key = `${period.start}/${period.end}`;
		if (!nowIn.has(key))
			nowIn.set(key, (await getInvoicesForStatement(invoice.buildingId, period.start, period.end)).find((one) => one.id === invoiceId));
		const now = nowIn.get(key);
		if (positions.some((position) => position.invoices?.some((billed) => billed.id === invoiceId))) billedIn.set(key, period);
		if (now && !billedAsIs(positions, now)) missedIn.set(key, period);
	}
	return { billedIn: [...billedIn.values()], missedIn: [...missedIn.values()] };
}
