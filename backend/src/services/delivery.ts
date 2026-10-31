/**
 * The sendings of a statement (#449): its own Dokuments, the first one, again by letter (#534) and a new PDF marked sent
 * (#968), and what counts since the last one
 */

import { and, asc, desc, eq, inArray, sql, type SQLWrapper } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, tenants, utilityStatements } from '../db/schema';
import { pdfBeforeChangeTitle } from './reminder-letter';

/**
 * #969 (A): a statement sent without a Dokument of its sending (before #449, or marked sent through the status route)
 * has its stored PDF as the only copy; before a change discards it, it stays as a Dokument «PDF vor der Änderung»,
 * dated when it was made, without channel and Versandstatus: whether the tenant got it is not known (Fachreview
 * 969-1 V-4: every copy discarded, so also the PDF made after a first change)
 * TODO(fachlich prüfen, #994): «PDF vor der Änderung» has no glossary row yet
 */
/** A Dokument's file name: title and statement number, without characters a file system refuses */
export const fileNameOf = (title: string, statementNumber: string) => `${title} ${statementNumber}.pdf`.replace(/[\\/:*?"<>|]/g, '_');

export async function keepPdfBeforeChange(statementId: string) {
	const [statement] = await db
		.select({
			tenantId: utilityStatements.tenantId,
			number: utilityStatements.statementNumber,
			status: utilityStatements.status,
			pdf: utilityStatements.pdfBlob,
			madeAt: utilityStatements.pdfGeneratedAt,
			language: tenants.language
		})
		.from(utilityStatements)
		.innerJoin(tenants, eq(tenants.id, utilityStatements.tenantId))
		.where(eq(utilityStatements.id, statementId));
	if (!statement?.pdf || statement.status === 'draft') return;
	const [sent] = await db
		.select({ id: documents.id })
		.from(documents)
		.where(and(eq(documents.statementId, statementId), eq(documents.type, 'statement')))
		.limit(1);
	if (sent) return;
	const title = pdfBeforeChangeTitle(statement.language);
	const [kept] = await db.insert(documents).values({
		tenantId: statement.tenantId,
		statementId,
		type: 'pdf_before_change',
		title,
		fileName: fileNameOf(title, statement.number),
		content: statement.pdf,
		...(statement.madeAt && { createdAt: statement.madeAt })
	}).returning({ id: documents.id });
	return kept.id;
}

// #534 (Fachreview 534-1 M-1): only reminders made since the statement's last sending count (both by the database's
// clock); one before it was delivered
// again by letter went to a tenant who had not received it
export const sinceDelivery = (statementId: SQLWrapper | string) => sql`${documents.createdAt} >= coalesce((
	select max(delivery.created_at) from documents delivery
	where delivery.statement_id = ${statementId} and delivery.type = 'statement' and delivery.status = 'sent'
), '-infinity'::timestamp)`;

/** Every sending after the first, oldest first, and the new PDF still to send (#968), for the Verlauf */
export async function sendingsOf(statementId: string) {
	const rows = await db
		.select({ id: documents.id, type: documents.type, status: documents.status, sentAt: documents.sentAt, createdAt: documents.createdAt })
		.from(documents)
		.where(and(eq(documents.statementId, statementId), inArray(documents.type, ['statement', 'new_pdf', 'pdf_before_change'])))
		.orderBy(asc(documents.sentAt), asc(documents.createdAt));
	const sent = rows.filter((row) => row.status === 'sent');
	const before = rows.filter((row) => row.type === 'pdf_before_change'); // #969, oldest first
	const pending = rows.find((row) => row.type === 'new_pdf' && row.status === 'to_send');
	// a new PDF is made when the change is saved: the Verlauf names that time too (Persona Dr. Weber 534-2 P-1)
	return {
		resent: sent.slice(1).map(({ id, type, sentAt, createdAt }) => ({ id, newPdf: type === 'new_pdf', sentAt, createdAt })),
		newPdfToSend: pending?.id ?? null,
		newPdfMadeAt: pending?.createdAt ?? null,
		pdfBeforeChange: before.map(({ id, createdAt }) => ({ id, madeAt: createdAt }))
	};
}

/** The Zahlungsfrist in the PDF the tenant got last: the statement or a new PDF marked sent (#966, Fachreview 966-1 V-1) */
export async function toldDeadline(statementId: string) {
	const [last] = await db
		.select({ paymentDeadline: documents.paymentDeadline })
		.from(documents)
		.where(and(eq(documents.statementId, statementId), inArray(documents.type, ['statement', 'new_pdf']), eq(documents.status, 'sent')))
		.orderBy(desc(documents.sentAt), desc(documents.createdAt))
		.limit(1);
	return last?.paymentDeadline ?? null;
}
