/**
 * Document Service
 * Stored letters (payment reminders) per tenant, sent by e-mail or kept for printing
 */

import { and, count, desc, eq, sql, type SQL } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, tenants, utilityStatements, type NewDocument } from '../db/schema';

export interface DocumentFilters {
	tenantId?: string;
	statementId?: string;
	status?: string;
}

// Everything but the PDF itself, plus whom it is for
const summary = {
	id: documents.id,
	tenantId: documents.tenantId,
	statementId: documents.statementId,
	type: documents.type,
	reminderLevel: documents.reminderLevel,
	title: documents.title,
	fileName: documents.fileName,
	channel: documents.channel,
	status: documents.status,
	sentAt: documents.sentAt,
	deliveryError: documents.deliveryError,
	createdAt: documents.createdAt,
	tenantName: sql<string>`${tenants.firstName} || ' ' || ${tenants.lastName}`,
	statementNumber: utilityStatements.statementNumber
};

function selectSummaries(where?: SQL) {
	return db
		.select(summary)
		.from(documents)
		.innerJoin(tenants, eq(documents.tenantId, tenants.id))
		.leftJoin(utilityStatements, eq(documents.statementId, utilityStatements.id))
		.where(where)
		.orderBy(desc(documents.createdAt));
}

export async function listDocuments(filters: DocumentFilters = {}) {
	const conditions = [
		filters.tenantId && eq(documents.tenantId, filters.tenantId),
		filters.statementId && eq(documents.statementId, filters.statementId),
		filters.status && eq(documents.status, filters.status)
	].filter((condition): condition is SQL => Boolean(condition));
	return selectSummaries(and(...conditions));
}

export async function getDocument(id: string) {
	const [document] = await selectSummaries(eq(documents.id, id));
	return document ?? null;
}

export async function getDocumentPdf(id: string) {
	const [document] = await db
		.select({ pdf: documents.pdf, fileName: documents.fileName })
		.from(documents)
		.where(eq(documents.id, id));
	return document ? { fileName: document.fileName, content: Buffer.from(document.pdf, 'base64') } : null;
}

export async function createDocument(document: NewDocument) {
	const [created] = await db.insert(documents).values(document).returning({ id: documents.id });
	return (await getDocument(created.id))!;
}

export async function countReminders(statementId: string) {
	const [result] = await db
		.select({ value: count() })
		.from(documents)
		.where(and(eq(documents.statementId, statementId), eq(documents.type, 'reminder')));
	return result.value;
}

/** E-mailed, or printed and posted by the property manager */
export async function markDocumentSent(id: string) {
	await db
		.update(documents)
		.set({ status: 'sent', sentAt: new Date(), deliveryError: null })
		.where(eq(documents.id, id));
	return getDocument(id);
}

export async function recordDeliveryError(id: string, deliveryError: string) {
	await db.update(documents).set({ deliveryError }).where(eq(documents.id, id));
	return getDocument(id);
}
