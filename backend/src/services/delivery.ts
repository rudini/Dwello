/**
 * The sendings of a statement (#449): its own Dokuments, the first one, again by letter (#534) and a new PDF marked sent
 * (#968), and what counts since the last one
 */

import { and, asc, eq, inArray, sql, type SQLWrapper } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents } from '../db/schema';

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
		.select({ id: documents.id, type: documents.type, status: documents.status, sentAt: documents.sentAt })
		.from(documents)
		.where(and(eq(documents.statementId, statementId), inArray(documents.type, ['statement', 'new_pdf'])))
		.orderBy(asc(documents.sentAt), asc(documents.createdAt));
	const sent = rows.filter((row) => row.status === 'sent');
	return {
		resent: sent.slice(1).map(({ id, type, sentAt }) => ({ id, newPdf: type === 'new_pdf', sentAt })),
		newPdfToSend: rows.find((row) => row.type === 'new_pdf' && row.status === 'to_send')?.id ?? null
	};
}
