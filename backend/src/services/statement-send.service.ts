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
import { statementMail } from './reminder-letter';
import { changeStatementStatus, generateStatementPdf } from './statement-pdf.service';
import { getStatement } from './statement.service';
import { getTenant } from './tenant.service';

export async function sendStatement(id: string, byLetter = false) {
	const statement = await getStatement(id);
	if (!statement) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (statement.status !== 'draft') throw new CodedError('STATEMENT_ALREADY_SENT', 'Only a draft can be sent');
	const tenant = (await getTenant(statement.tenantId))!;
	if (byLetter || tenant.correspondenceChannel !== 'email') return { statement: await changeStatementStatus(id, 'sent') };
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
	const fileName = `${mail.title} ${statement.statementNumber}.pdf`.replace(/[\\/:*?"<>|]/g, '_');
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
		status: 'sent',
		sentAt: new Date()
	});
	return { statement: sent, document };
}
