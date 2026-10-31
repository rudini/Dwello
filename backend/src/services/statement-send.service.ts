/**
 * Sending a statement (#86): to a tenant who wants e-mail, its PDF goes by e-mail and is stored as a Dokument; for a
 * letter, or a letter instead of a failed e-mail, the property manager delivers the PDF and Dwello records it as sent.
 * Either way it is dated, and its Zahlungsfrist counted, from the day it goes out; a failed e-mail leaves it a draft.
 */

import { createMailTransport, MailConfigError } from '../mail';
import { CodedError } from './coded-error';
import { getTypedConfig } from './config.service';
import { createDocument } from './document.service';
import { balanceText } from './pdf.service';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, utilityStatements, type Language } from '../db/schema';
import { newPdfTitle, statementMail, statementTitle } from './reminder-letter';
import { changeStatementStatus, generateStatementPdf, qrBillConfig } from './statement-pdf.service';
import { datedToday, getStatement } from './statement.service';
import { getTenant } from './tenant.service';

export async function sendStatement(id: string, byLetter = false) {
	const statement = await getStatement(id);
	if (!statement) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (statement.status !== 'draft') throw new CodedError('STATEMENT_ALREADY_SENT', 'Only a draft can be sent');
	const tenant = (await getTenant(statement.tenantId))!;
	if (byLetter || tenant.correspondenceChannel !== 'email') return sendByLetter(id, statement.statementNumber, tenant);
	if (!tenant.email) throw new CodedError('STATEMENT_TENANT_NO_EMAIL', 'The tenant has no e-mail address');

	// the PDF dated today, as it goes out and stays in the Dokument
	const made = await generateStatementPdf(id);
	if (made === 'not-found') throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (made === 'no-iban') throw new CodedError('IBAN_MISSING', 'IBAN not configured');
	const mail = statementMail({
		...statement,
		tenant,
		sender: await getTypedConfig('company_name'),
		balance: balanceText(made.data, made.language),
		language: made.language
	});
	const fileName = fileNameOf(mail.title, statement.statementNumber);
	try {
		await createMailTransport().send({
			to: tenant.email,
			subject: mail.subject,
			text: mail.text,
			attachments: [{ filename: fileName, content: Buffer.from(made.pdf, 'base64'), contentType: 'application/pdf' }]
		});
	} catch (error) {
		if (error instanceof MailConfigError) throw new CodedError('STATEMENT_MAIL_NOT_CONFIGURED', error.message);
		console.error('Statement e-mail not delivered:', error);
		throw new CodedError('STATEMENT_MAIL_FAILED', 'The e-mail was not delivered');
	}

	const sent = await changeStatementStatus(id, 'sent');
	const document = await createDocument({
		tenantId: tenant.id,
		statementId: id,
		type: 'statement',
		title: mail.title,
		fileName,
		content: made.pdf,
		channel: 'email',
		recipient: tenant.email,
		paymentDeadline: sent?.paymentDeadline, // as the PDF prints it, for a later change (#966)
		status: 'sent',
		sentAt: new Date()
	});
	return { statement: sent, document };
}

const fileNameOf = (title: string, statementNumber: string) => `${title} ${statementNumber}.pdf`.replace(/[\\/:*?"<>|]/g, '_');

/**
 * The landlord delivers the PDF: Dwello records the statement as sent and keeps the PDF as sent as a Dokument by letter
 * (#449, decided in #404, point 7)
 */
async function sendByLetter(id: string, statementNumber: string, tenant: { id: string }) {
	// no letter without its PDF, refused as the e-mail is; a refusal of the PDF itself passes as it is (#491)
	const made = await pdfOf(id);
	const sent = await changeStatementStatus(id, 'sent');
	return { statement: sent, document: await storeLetter(id, { tenantId: tenant.id, statementNumber }, made.language) };
}

async function pdfOf(id: string) {
	const made = await generateStatementPdf(id);
	if (made === 'not-found') throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (made === 'no-iban') throw new CodedError('IBAN_MISSING', 'IBAN not configured');
	return made;
}

/**
 * The statement's PDF as it keeps it, as a Dokument by letter: a sending (sent today), or the new PDF after a change
 * still to send (#968); with the Zahlungsfrist it prints, so a later one is measured against it (Fachreview 534-1 V-5)
 */
async function storeLetter(
	id: string,
	{ tenantId, statementNumber }: { tenantId: string; statementNumber: string },
	language: Language,
	type: 'statement' | 'new_pdf' = 'statement'
) {
	// the PDF as sent, as the statement keeps it; the one made before when making it again failed (code review C-4)
	const [{ pdf, paymentDeadline }] = await db
		.select({ pdf: utilityStatements.pdfBlob, paymentDeadline: utilityStatements.paymentDeadline })
		.from(utilityStatements)
		.where(eq(utilityStatements.id, id));
	const title = type === 'statement' ? statementTitle(language) : newPdfTitle(language);
	const sending = type === 'statement' ? { status: 'sent' as const, sentAt: new Date() } : { status: 'to_send' as const };
	return createDocument({
		tenantId,
		statementId: id,
		type,
		title,
		fileName: fileNameOf(title, statementNumber),
		content: pdf!,
		channel: 'letter',
		paymentDeadline,
		...sending
	});
}

// a new PDF still to send gives way to a later one, and to the statement delivered again (#968, Fachreview 534-1)
const dropPendingNewPdf = (id: string) =>
	db.delete(documents).where(and(eq(documents.statementId, id), eq(documents.type, 'new_pdf'), eq(documents.status, 'to_send')));

/**
 * #534: a sent statement that did not reach the tenant (an e-mail come back undeliverable) goes again by letter: dated
 * today, the Zahlungsfrist as at the first sending (a later one stays, Fachreview 534-1 V-2), the PDF made anew and
 * kept as a Dokument by letter, sent today; reminders before it count no more (M-1, `sinceDelivery`)
 */
export async function redeliverByLetter(id: string) {
	const statement = await getStatement(id);
	if (!statement) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (!statement.redeliverable) throw new CodedError('STATEMENT_NOT_REDELIVERABLE', 'Only a sent statement can be delivered again');
	// without its PDF nothing changes: the statement keeps its date, Zahlungsfrist and PDF (Code-Review 534-1 C-2)
	if (!(await qrBillConfig())) throw new CodedError('IBAN_MISSING', 'IBAN not configured');
	const [before] = await db
		.select({ statementDate: utilityStatements.statementDate, paymentDeadline: utilityStatements.paymentDeadline, pdfBlob: utilityStatements.pdfBlob, pdfGeneratedAt: utilityStatements.pdfGeneratedAt })
		.from(utilityStatements)
		.where(eq(utilityStatements.id, id));
	const dated = { ...(await datedToday(statement.paymentDeadline)), pdfBlob: null, pdfGeneratedAt: null, updatedAt: new Date() };
	await db.update(utilityStatements).set(dated).where(eq(utilityStatements.id, id));
	const made = await pdfOf(id).catch(async (error) => {
		await db.update(utilityStatements).set(before).where(eq(utilityStatements.id, id));
		throw error;
	});
	await dropPendingNewPdf(id);
	const document = await storeLetter(id, statement, made.language);
	return { statement: (await getStatement(id))!, document };
}

/**
 * #968: a change that makes a new PDF of a statement whose PDF went out (a statement Dokument, #449) keeps the new one as
 * a Dokument by letter «Zu versenden»; marking it sent records it without dating the statement anew. Sent before #449:
 * nothing to compare with (#969). Without an IBAN no PDF now: none
 */
export async function keepNewPdf(id: string) {
	const statement = await getStatement(id);
	const [sent] = await db
		.select({ id: documents.id })
		.from(documents)
		.where(and(eq(documents.statementId, id), eq(documents.type, 'statement'), eq(documents.status, 'sent')))
		.limit(1);
	// a paid or replaced statement's new PDF never goes out (Code-Review 534-1 C-5)
	if (!statement?.redeliverable || !sent) return;
	const made = await generateStatementPdf(id);
	if (typeof made === 'string') return;
	await dropPendingNewPdf(id);
	await storeLetter(id, statement, made.language, 'new_pdf');
	// the statement itself stays as a change leaves it, without a PDF until one is requested (#524)
	await db.update(utilityStatements).set({ pdfBlob: null, pdfGeneratedAt: null }).where(eq(utilityStatements.id, id));
}
