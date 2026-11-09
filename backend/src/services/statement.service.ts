/**
 * Statement Service
 * Business logic for utility statement operations
 */
import { eq, sql, and, gte, isNull } from 'drizzle-orm';
import { db } from '../db/connection';
import { recordAudit, recordStatementCorrection } from './audit-log.service';
import {
	utilityStatements,
	utilityStatementLineItems,
	documents,
	type NewUtilityStatement,
	type UtilityStatementLineItem,
	type NewUtilityStatementLineItem
} from '../db/schema';
import { roundToRappen } from './pdf-format';
import { getTypedConfig } from './config.service';
import { keepPdfBeforeChange, toldDeadline } from './delivery';
import { CodedError, refusal, type Refusal } from './coded-error';
import type { Tx } from './advance-payment.service';
import { belowMinimum } from './pdf-format';
import { isReplaced } from './counting-statements';
import { daysAfter, swissToday } from './today';
import { checkPaidDate, paidAmountOf } from './payment-entry';
import { carriable, countedBy } from './carry-over';
import type { PdfChange, StatementWithDetails } from '../api/statement';
import { getStatement } from './statement-query.service';
import { refuseUncalculableKeys } from './statement-refusals';

/**
 * Update an existing statement
 */
export async function updateStatement(
	id: string,
	data: Partial<NewUtilityStatement>
): Promise<(StatementWithDetails & { pdfChange: PdfChange | null }) | null> {
	// Check if statement exists
	const existing = await getStatement(id);
	if (!existing) return null;

	// A replaced statement stays as it was (#120)
	if (isReplaced(existing)) throw new CodedError('STATEMENT_REPLACED', 'A replaced statement cannot be changed');
	// Once sent, the amounts stay as the tenant received them
	if (existing.status !== 'draft') {
		const protectedFields = ['totalCosts', 'totalAdvancePayments', 'managementFeePercent', 'managementFee', 'balance'];
		for (const field of protectedFields) {
			if (field in data) {
				throw new Error(`Cannot modify ${field} for a statement that is no longer a draft`);
			}
		}
	}

	await refuseEarlierDeadline(id, data.paymentDeadline, existing.balance);

	// The PDF prints date, payment deadline and remark (#448); a change discards it, it is made again. Once paid, the PDF as sent stays
	const pdfOutdated = changesPdf(data, existing);
	// the only copy of a PDF sent without a Dokument stays (#969; also «Zahlung zurücksetzen», Fachreview 969-1 V-3)
	if (pdfOutdated || data.pdfBlob === null) await keepPdfBeforeChange(id);

	// Update the statement
	const [updated] = await db
		.update(utilityStatements)
		.set({ ...data, ...(pdfOutdated && { pdfBlob: null, pdfGeneratedAt: null }), updatedAt: new Date() })
		.where(eq(utilityStatements.id, id))
		.returning();

	if (!updated) return null;

	return { ...(await getStatement(id))!, pdfChange: pdfOutdated ? pdfChangeOf(data, existing) : null };
}

/**
 * #966 (A): a Nachzahlung's Zahlungsfrist not before the one in the PDF the tenant got; without a sent Dokument nothing
 * to compare with (#969). A refund may come earlier: the landlord owes it (Fachreview 966-1 M-1)
 */
async function refuseEarlierDeadline(id: string, deadline: string | null | undefined, balance: string) {
	if (!deadline || Number(balance) <= 0) return;
	const told = await toldDeadline(id);
	if (told && deadline < told)
		throw new CodedError('STATEMENT_DEADLINE_BEFORE_SENT', 'The payment deadline cannot be before the one sent', { date: told });
}

/** After sending, what only the new PDF prints: the tenant learns it once it is sent to him (#524, Fachreview 524-1 V-1) */
function pdfChangeOf(data: Partial<NewUtilityStatement>, existing: StatementWithDetails): PdfChange | null {
	if (existing.status === 'draft') return null;
	if ((data.paymentDeadline ?? existing.paymentDeadline) === existing.paymentDeadline) return 'notes';
	return Number(existing.balance) < 0 ? 'refund_by' : 'deadline';
}

// A field the PDF prints, changed; the edit page sends no remark as ''
const changesPdf = (data: Partial<NewUtilityStatement>, existing: StatementWithDetails) =>
	(['paymentDeadline', 'statementDate', 'notes'] as const).some(
		(field) => data[field] !== undefined && (data[field] ?? '') !== (existing[field] ?? '')
	);

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
	status: 'draft' | 'sent' | 'paid',
	additionalData?: {
		paidDate?: string;
		paidAmount?: string;
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

	if (status === 'sent') await refuseUncalculableKeys(existing.building!.id, existing.periodStart, existing.periodEnd, 'STATEMENT_KEY_THEN_RECALCULATE', existing); // #1333
	if (status === 'paid' && additionalData?.paidDate !== undefined) checkPaidDate(additionalData.paidDate, existing.periodEnd);
	const sentToday = status === 'sent' && (await datedToday(existing.paymentDeadline));
	// A Saldo of 0.00, or one below CHF 5 carried over, is «Erledigt» once sent: no payment (#448); a Schlussabrechnung
	// claims or pays out every other Saldo
	const balance = parseFloat(existing.balance);
	const waived = belowMinimum(balance) && !existing.final;
	const settled = sentToday && (balance === 0 || waived) && { status: 'settled' as const };
	const updateData: Partial<NewUtilityStatement> = {
		status,
		...additionalData,
		...sentToday,
		...settled,
		// the PDF as sent is made anew after sending, with the tenant and settings then, not a draft's of earlier (review C-9)
		...(sentToday && { pdfBlob: null, pdfGeneratedAt: null })
	};
	if (updateData.status === 'paid') Object.assign(updateData, recordPayment(existing, waived, additionalData));

	return updateStatement(id, updateData);
}

// paid without an amount: the open amount, as the tenant pays it or gets it back (#93); below CHF 5 no money moves (#94: a
// statement settled under #94 whose payment was reset). A smaller amount is a part payment (#959, Art. 69, 85 OR): the
// payments add up, and the statement stays open with the rest until they reach the Saldo
function recordPayment(existing: StatementWithDetails, waived: boolean, { paidDate, paidAmount: entered }: { paidDate?: string; paidAmount?: string } = {}) {
	if (waived) return { paidAmount: entered ?? '0.00', paymentRecordedAt: new Date() };
	const before = Number(existing.paidAmount ?? 0);
	const rest = roundToRappen(Number(existing.balance) - before);
	const amount = paidAmountOf(entered, rest);
	// recorded now: a PDF made after it names it, so resetting it discards that PDF (#1015); each payment keeps its own
	// time for the reset of the one before (Datenprüfung 999-1 D-1)
	const paymentRecordedAt = new Date();
	const payments = [...existing.payments, { date: paidDate ?? swissToday(), amount: amount.toFixed(2), recordedAt: paymentRecordedAt.toISOString() }];
	const paidAmount = roundToRappen(before + amount).toFixed(2);
	if (amount !== rest) return { status: 'sent' as const, paidDate: null, paidAmount, payments, paymentRecordedAt };
	// paid on the day of the latest payment, one without a date of today (Copilot review PR #1006)
	return { paidAmount, payments, paidDate: payments.map((p) => p.date).sort().at(-1), paymentRecordedAt };
}

const dropNewPdfSince = (id: string, since: Date) =>
	db
		.delete(documents)
		.where(and(eq(documents.statementId, id), eq(documents.type, 'new_pdf'), eq(documents.status, 'to_send'), gte(documents.createdAt, since)));

/**
 * Take back a recorded payment (#92): back to sent (overdue once the payment deadline has passed), paid date and amount
 * cleared, the reset kept for the Verlauf; a PDF made after the payment was recorded confirms it: it is discarded and made again as sent
 */
export async function resetPayment(id: string): Promise<StatementWithDetails> {
	const existing = await getStatement(id);
	if (!existing) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	// the last recorded payment, a part payment too; the parts before stay (#959); a statement paid before #959 has no list
	const last = existing.payments.at(-1);
	if (existing.status !== 'paid' && !(last && ['sent', 'overdue'].includes(existing.status)))
		throw new CodedError('STATEMENT_NOT_PAID', 'Statement is not paid');
	const kept = existing.payments.slice(0, -1);
	const stays = kept.at(-1);
	// a part payment did not reach the Saldo: the Verlauf names it as one (#999)
	const reset = { resetOn: swissToday(), paidDate: last?.date ?? existing.paidDate, paidAmount: last?.amount ?? existing.paidAmount, part: existing.status !== 'paid' };
	const paidAmount = kept.length ? roundToRappen(kept.reduce((sum, p) => sum + Number(p.amount), 0)).toFixed(2) : null;
	// only a PDF made after the payment was recorded says so; the one made before stays, with its row in the Verlauf
	const { pdfGeneratedAt, paymentRecordedAt } = existing;
	const paidPdf = pdfGeneratedAt && paymentRecordedAt && pdfGeneratedAt >= paymentRecordedAt;
	const updated = (await updateStatement(id, {
		status: 'sent',
		paidDate: null,
		paidAmount,
		payments: kept,
		// the part that stays is now the last recorded one (D-1); one recorded before #999 has no time of its own: any PDF
		// may name it, so its reset drops them all (fallback review of #1049)
		paymentRecordedAt: stays ? new Date(stays.recordedAt ?? 0) : null,
		carrySettledOn: null, // a refund settled under #94 is carried over again (Fachreview 506-1 V-9)
		paymentResets: [...existing.paymentResets, reset],
		...(paidPdf && { pdfBlob: null, pdfGeneratedAt: null })
	}))!;
	// a new PDF still to send made after it names the payment as well (#1015)
	if (paymentRecordedAt) await dropNewPdfSince(id, paymentRecordedAt);
	await recordAudit('payment_reset', { statementId: id, number: existing.statementNumber, paidDate: reset.paidDate, paidAmount: reset.paidAmount }); // #357, #999
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
	// Fachreview 1309-1 V-1: else it would stay «Ersetzt» without a berichtigte Abrechnung until the key is fixed
	await refuseUncalculableKeys(existing.building!.id, existing.periodStart, existing.periodEnd);
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
	await dropFromDrafts(statement, tx);
	// settled by hand: paid, as a counted one (#506, Fachreview 506-1 V-2)
	return row.countedBy || statement.carrySettledOn ? { paidAmount: statement.balance } : {};
}

// A draft that counts the statement's Saldo as its Übertrag loses it
const dropFromDrafts = (statement: { id: string; balance: string }, tx: Tx) =>
	tx
		.update(utilityStatements)
		.set({ carriedFromId: null, balance: sql`${utilityStatements.balance} - ${statement.balance}` })
		.where(and(eq(utilityStatements.carriedFromId, statement.id), eq(utilityStatements.status, 'draft')));

/**
 * #506: «Als ausgeglichen markieren»: the landlord paid out, claimed or waived an Übertrag himself; no statement counts it
 * after, and a draft that counts it loses it (Fachreview 506-1 V-1)
 */
export async function settleCarryOver(id: string): Promise<StatementWithDetails> {
	const existing = await getStatement(id);
	if (!existing) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	// checked in the update itself, so a replacement or a send that committed before it leaves nothing to settle; one
	// that commits while it runs is not locked out (no row lock: a single landlord, PR #941 review, code review 506-5 C-2)
	await db.transaction(async (tx) => {
		const settled = await tx
			.update(utilityStatements)
			.set({ carrySettledOn: swissToday(), updatedAt: new Date() })
			.where(and(eq(utilityStatements.id, id), carriable, isNull(utilityStatements.carrySettledOn), sql`${countedBy} is null`))
			.returning({ id: utilityStatements.id, balance: utilityStatements.balance });
		if (!settled.length) throw new CodedError('STATEMENT_NO_CARRY_OVER', 'The statement has no open Übertrag');
		await dropFromDrafts(settled[0], tx);
	});
	return (await getStatement(id))!;
}

// «Bereits bezahlt» of a sent or overdue statement, in francs and Rappen
function paidOn(statement: StatementWithDetails, amount: string) {
	if (!['sent', 'overdue'].includes(statement.status))
		throw new CodedError('STATEMENT_PAID_AMOUNT_NOT_OPEN', 'Only a sent or overdue statement takes what was already paid');
	if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) throw new CodedError('STATEMENT_PAID_AMOUNT_INVALID', 'Invalid amount already paid', { amount });
	const paid = Number(amount);
	return (Number(statement.balance) < 0 ? -paid : paid).toFixed(2);
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
