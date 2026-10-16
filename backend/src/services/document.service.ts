/**
 * Document Service
 * Stored letters (payment reminders) per tenant, sent by e-mail or kept for printing
 */

import { and, count, desc, eq, ne, sql, type SQL } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, tenants, utilityStatements, type NewDocument } from '../db/schema';
import { CodedError } from './coded-error';
import { tenantExists } from './tenant.service';

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
	mimeType: documents.mimeType,
	channel: documents.channel,
	status: documents.status,
	sentAt: documents.sentAt,
	deliveryError: documents.deliveryError,
	paymentDeadline: documents.paymentDeadline,
	createdAt: documents.createdAt,
	tenantName: sql<string>`${tenants.firstName} || ' ' || ${tenants.lastName}`,
	statementNumber: utilityStatements.statementNumber
};

/** The delivery errors the backend writes itself, by their code for the UI; any other failure is MAIL_DELIVERY_FAILED */
export const DELIVERY_ERRORS = {
	TENANT_NO_EMAIL: 'Der Mieter hat keine E-Mail-Adresse.',
	MAIL_NOT_CONFIGURED: 'Der E-Mail-Versand ist nicht eingerichtet.',
	MAIL_DELIVERY_FAILED: 'Die E-Mail konnte nicht zugestellt werden.'
} as const;

// An error stored before every failure had a code (the mail server's own text) reads as MAIL_DELIVERY_FAILED
const deliveryErrorCode = (deliveryError: string | null) =>
	deliveryError === null
		? null
		: (Object.entries(DELIVERY_ERRORS).find(([, text]) => text === deliveryError)?.[0] ?? 'MAIL_DELIVERY_FAILED');

async function selectSummaries(where?: SQL) {
	const rows = await db
		.select(summary)
		.from(documents)
		.innerJoin(tenants, eq(documents.tenantId, tenants.id))
		.leftJoin(utilityStatements, eq(documents.statementId, utilityStatements.id))
		.where(where)
		.orderBy(desc(documents.createdAt), desc(documents.id));
	return rows.map((row) => ({ ...row, deliveryErrorCode: deliveryErrorCode(row.deliveryError) }));
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
		.select({ content: documents.content, fileName: documents.fileName, mimeType: documents.mimeType })
		.from(documents)
		.where(eq(documents.id, id));
	return document && { ...document, content: Buffer.from(document.content, 'base64') };
}

export async function createDocument(document: NewDocument) {
	const [created] = await db.insert(documents).values(document).returning({ id: documents.id });
	return (await getDocument(created.id))!;
}

// The kinds of file a tenant's document may be, told by their first bytes, not by the file name
const KINDS = [
	{ mimeType: 'application/pdf', start: '%PDF-' },
	{ mimeType: 'image/jpeg', start: '\xff\xd8\xff' },
	{ mimeType: 'image/png', start: '\x89PNG\r\n\x1a\n' }
];

const MAX_NAME = 255; // the columns title and file_name
const MAX_MEGABYTES = 10; // 10 × 1024 × 1024 bytes, as Windows counts a megabyte

/** An uploaded file as Dwello keeps it: at most 10 MB, a PDF, JPG or PNG by its first bytes, its name cut to the column */
export function checkedFile(upload: { fileName: string; content: string }) {
	const file = Buffer.from(upload.content, 'base64');
	if (file.length > MAX_MEGABYTES * 1024 * 1024)
		throw new CodedError('DOCUMENT_TOO_LARGE', `The file is larger than ${MAX_MEGABYTES} MB`, { megabytes: MAX_MEGABYTES });
	const kind = KINDS.find(({ start }) => file.subarray(0, start.length).toString('latin1') === start);
	if (!kind) throw new CodedError('DOCUMENT_TYPE_NOT_ALLOWED', 'Only PDF, JPG and PNG files are accepted');
	const fileName = [...upload.fileName].slice(-MAX_NAME).join(''); // in characters; the end keeps the extension
	return { fileName, mimeType: kind.mimeType, content: upload.content };
}

/** A file the property manager adds to a tenant: no channel, no Versandstatus */
export async function uploadDocument(tenantId: string, upload: { title: string; fileName: string; content: string }) {
	const { fileName, mimeType, content } = checkedFile(upload);
	if (upload.title.trim().length > MAX_NAME)
		throw new CodedError('DOCUMENT_TITLE_TOO_LONG', `The title is longer than ${MAX_NAME} characters`, { max: MAX_NAME });
	if (!(await tenantExists(tenantId))) throw new CodedError('TENANT_NOT_FOUND', 'Tenant not found');
	// without a title it is named like its file
	const title = upload.title.trim() || fileName.replace(/\.[^.]*$/, '');
	return createDocument({ tenantId, type: 'upload', title, fileName, content, mimeType });
}

/** Only an upload: a Mahnung stays as proof that the tenant was reminded */
export async function deleteDocument(id: string) {
	const [deleted] = await db
		.delete(documents)
		.where(and(eq(documents.id, id), eq(documents.type, 'upload')))
		.returning({ id: documents.id });
	if (!deleted && (await getDocument(id)))
		throw new CodedError('DOCUMENT_NOT_DELETABLE', 'Payment reminders cannot be deleted');
	return deleted ?? null;
}

export async function countReminders(statementId: string) {
	const [result] = await db
		.select({ value: count() })
		.from(documents)
		.where(and(eq(documents.statementId, statementId), eq(documents.type, 'reminder')));
	return result.value;
}

/**
 * E-mailed, or printed and posted by the property manager with the letter remade on that day; an upload has no
 * Versandstatus: null
 */
export async function markDocumentSent(id: string, posted?: { content: string; paymentDeadline: string }) {
	const [sent] = await db
		.update(documents)
		.set({ status: 'sent', sentAt: new Date(), deliveryError: null, ...(posted && { ...posted, channel: 'letter' }) })
		.where(and(eq(documents.id, id), ne(documents.type, 'upload')))
		.returning({ id: documents.id });
	return sent ? getDocument(id) : null;
}

export async function recordDeliveryError(id: string, deliveryError: string) {
	await db.update(documents).set({ deliveryError }).where(eq(documents.id, id));
	return getDocument(id);
}
