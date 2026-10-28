/**
 * Protokoll under «Einstellungen» (#357, decided in #111): logins and changes that affect statements, each with its
 * time. The details are a snapshot of what the entry names, so it stays readable after the record changed or was
 * deleted; the UI words them in its language. Entries stay until the landlord deletes one.
 */

import { desc, eq, type SQL } from 'drizzle-orm';
import { db } from '../db/connection';
import { auditLog } from '../db/schema';

type Writer = Pick<typeof db, 'insert'>;

/** Writes one entry, inside the transaction of the change when one is given; now, unless it happened earlier */
export async function recordAudit(action: string, details: Record<string, unknown>, tx: Writer = db, occurredAt?: SQL) {
	await tx.insert(auditLog).values({ action, details, occurredAt });
}

/** All entries, newest first */
export const listAuditLog = () => db.select().from(auditLog).orderBy(desc(auditLog.occurredAt));

/** False when there is no such entry */
export async function deleteAuditEntry(id: string) {
	return (await db.delete(auditLog).where(eq(auditLog.id, id)).returning()).length > 0;
}

/** #120: a sent statement replaced by a berichtigte Abrechnung («Abrechnung berichtigen», #358) */
export const recordStatementCorrection = (replaced: { id: string; statementNumber: string }, tx?: Writer) =>
	recordAudit('statement_corrected', { statementId: replaced.id, number: replaced.statementNumber }, tx);
