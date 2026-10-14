/**
 * Reminder Service
 * Payment reminders for unpaid utility statements: Zahlungserinnerung, 2. and 3. Mahnung.
 * Each reminder is stored as a PDF document and goes out through the tenant's correspondence channel:
 * by e-mail, or kept as "to_send" for the property manager to print and post.
 */

import { formatQRReferenceForDisplay, isQRIBAN, statementQRReference } from './qr-bill.service';
import { createMailTransport, MailConfigError } from '../mail';
import { getTypedConfig } from './config.service';
import { CodedError } from './coded-error';
import { countReminders, createDocument, DELIVERY_ERRORS, markDocumentSent, recordDeliveryError } from './document.service';
import { reminderLetter } from './reminder-letter';
import { renderReminderPdf, type PostalAddress } from './reminder-pdf';
import { getStatement, updateStatement } from './statement.service';
import { getTenant } from './tenant.service';

const MAX_REMINDER_LEVEL = 3;
const PAYMENT_DAYS = 10; // new payment deadline in each reminder

/** The request cannot be fulfilled (shown to the property manager) */
export class ReminderError extends CodedError {
	constructor(
		code: string,
		message: string,
		readonly status = 400
	) {
		super(code, message);
	}
}

type Document = NonNullable<Awaited<ReturnType<typeof markDocumentSent>>>;

const isoDate = (date: Date) => date.toISOString().split('T')[0];

async function sender(): Promise<PostalAddress & { iban: string }> {
	return {
		name: await getTypedConfig('company_name'),
		address: await getTypedConfig('company_address'),
		postalCode: await getTypedConfig('company_postal_code'),
		city: await getTypedConfig('company_city'),
		iban: await getTypedConfig('iban')
	};
}

async function nextLevel(statementId: string, status: string, balance: number) {
	if (!['sent', 'overdue'].includes(status)) {
		throw new ReminderError('REMINDER_NOT_SENT', 'Nur versendete Abrechnungen können gemahnt werden.');
	}
	if (status !== 'overdue') throw new ReminderError('REMINDER_NOT_OVERDUE', 'Gemahnt wird erst nach Ablauf der Zahlungsfrist.');
	if (!(balance > 0)) throw new ReminderError('REMINDER_REFUND', 'Eine Rückerstattung wird nicht gemahnt: Sie schulden dem Mieter den Betrag.');
	const level = (await countReminders(statementId)) + 1;
	if (level > MAX_REMINDER_LEVEL) throw new ReminderError('REMINDER_LIMIT', 'Es wurden bereits 3 Mahnungen versendet.');
	return level;
}

async function deliverByEmail(document: Document, to: string | null, letter: ReturnType<typeof reminderLetter>, pdf: Buffer) {
	try {
		if (!to) throw new Error(DELIVERY_ERRORS.TENANT_NO_EMAIL);
		await createMailTransport().send({
			to,
			subject: letter.subject,
			text: letter.text,
			attachments: [{ filename: document.fileName, content: pdf, contentType: 'application/pdf' }]
		});
		return { document: (await markDocumentSent(document.id))! };
	} catch (error) {
		const deliveryError =
			error instanceof MailConfigError
				? DELIVERY_ERRORS.MAIL_NOT_CONFIGURED
				: (error as Error).message;
		return { document: (await recordDeliveryError(document.id, deliveryError))!, deliveryError };
	}
}

export async function sendReminder(statementId: string) {
	const statement = await getStatement(statementId);
	if (!statement) throw new ReminderError('STATEMENT_NOT_FOUND', 'Abrechnung nicht gefunden.', 404);
	const level = await nextLevel(statementId, statement.status, Number(statement.balance));
	const tenant = (await getTenant(statement.tenantId))!;
	const from = await sender();
	const today = new Date();

	const letter = reminderLetter({
		level,
		statementNumber: statement.statementNumber,
		periodStart: statement.periodStart,
		periodEnd: statement.periodEnd,
		balance: Number(statement.balance),
		deadline: isoDate(new Date(today.getTime() + PAYMENT_DAYS * 86_400_000)),
		tenant,
		sender: { name: from.name, iban: from.iban },
		reference: isQRIBAN(from.iban) ? formatQRReferenceForDisplay(statementQRReference(statementId)) : undefined
	});
	const recipient = { ...tenant, name: `${tenant.firstName} ${tenant.lastName}` };
	const pdf = await renderReminderPdf(letter, from, recipient, today.toLocaleDateString('de-CH'));

	const document = await createDocument({
		tenantId: tenant.id,
		statementId,
		type: 'reminder',
		reminderLevel: level,
		title: letter.title,
		fileName: `${letter.title} ${statement.statementNumber}.pdf`.replace(/[^\w. -]/g, '_'),
		content: pdf.toString('base64'),
		channel: tenant.correspondenceChannel,
		status: 'to_send'
	});
	await updateStatement(statementId, { reminderSentDate: isoDate(today) });

	if (tenant.correspondenceChannel !== 'email') return { document };
	return deliverByEmail(document, tenant.email, letter, pdf);
}
