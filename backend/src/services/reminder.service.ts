/**
 * Reminder Service
 * Payment reminders for unpaid utility statements: Zahlungserinnerung, 2. and 3. Mahnung.
 * Each reminder is stored as a PDF document and goes out through the tenant's correspondence channel:
 * by e-mail, or kept as "to_send" for the property manager to print and post.
 */

import { formatQRReferenceForDisplay, isQRIBAN, statementQRReference } from './qr-bill.service';
import { createMailTransport, MailConfigError } from '../mail';
import { getTypedConfig } from './config.service';
import { CodedError, type ErrorParams } from './coded-error';
import {
	countReminders,
	createDocument,
	DELIVERY_ERRORS,
	getDocument,
	markDocumentSent,
	recordDeliveryError
} from './document.service';
import type { Language } from './pdf.service';
import { reminderLetter } from './reminder-letter';
import { renderReminderPdf, type PostalAddress } from './reminder-pdf';
import { qrBillConfig } from './statement-pdf.service';
import { getStatement, updateStatement } from './statement.service';
import { getTenant } from './tenant.service';
import { formatSwissDate } from './pdf-format';
import { daysAfter, swissToday } from './today';

const MAX_REMINDER_LEVEL = 3;
const PAYMENT_DAYS = 10; // new payment deadline in each reminder

/** The request cannot be fulfilled (shown to the property manager) */
export class ReminderError extends CodedError {
	constructor(
		code: string,
		message: string,
		readonly status = 400,
		params: ErrorParams = {}
	) {
		super(code, message, params);
	}
}

type Document = NonNullable<Awaited<ReturnType<typeof markDocumentSent>>>;
type Statement = NonNullable<Awaited<ReturnType<typeof getStatement>>>;

async function sender(): Promise<PostalAddress & { iban: string }> {
	return {
		name: await getTypedConfig('company_name'),
		address: await getTypedConfig('company_address'),
		postalCode: await getTypedConfig('company_postal_code'),
		city: await getTypedConfig('company_city'),
		iban: await getTypedConfig('iban')
	};
}

async function nextLevel(statement: Statement) {
	if (!['sent', 'overdue'].includes(statement.status)) {
		throw new ReminderError('REMINDER_NOT_SENT', 'Nur versendete Abrechnungen können gemahnt werden.');
	}
	if (statement.status !== 'overdue') throw new ReminderError('REMINDER_NOT_OVERDUE', 'Gemahnt wird erst nach Ablauf der Zahlungsfrist.');
	if (!(Number(statement.balance) > 0)) throw new ReminderError('REMINDER_REFUND', 'Eine Rückerstattung wird nicht gemahnt: Sie schulden dem Mieter den Betrag.');
	const level = (await countReminders(statement.id)) + 1;
	if (level > MAX_REMINDER_LEVEL) throw new ReminderError('REMINDER_LIMIT', 'Es wurden bereits 3 Mahnungen versendet.');
	// the next Mahnstufe from the day after the last reminder's Zahlungsfrist (#107)
	const from = statement.nextReminderFrom;
	if (from && from > swissToday()) {
		throw new ReminderError('REMINDER_TOO_EARLY', `Die nächste Mahnung ist erst ab ${formatSwissDate(from)} möglich.`, 400, {
			date: from,
			deadline: daysAfter(from, -1)
		});
	}
	return level;
}

/** The reminder letter of a level dated `day`, with the Zahlungsfrist it prints */
async function reminderOn(statement: Statement, level: number, day: string) {
	const tenant = (await getTenant(statement.tenantId))!;
	const from = await sender();
	const language = tenant.language as Language;
	const paymentDeadline = daysAfter(day, PAYMENT_DAYS);
	const letter = reminderLetter({
		level,
		statementNumber: statement.statementNumber,
		periodStart: statement.periodStart,
		periodEnd: statement.periodEnd,
		balance: Number(statement.balance),
		deadline: paymentDeadline,
		tenant,
		sender: { name: from.name, iban: from.iban },
		reference: isQRIBAN(from.iban) ? formatQRReferenceForDisplay(statementQRReference(statement.id)) : undefined,
		language
	});
	const recipient = { ...tenant, name: `${tenant.firstName} ${tenant.lastName}` };
	// a statement paid since then gets no payment part, or the tenant pays twice (as on the statement)
	const config = statement.status === 'paid' ? null : await qrBillConfig();
	const payment = config ? { statement: { ...statement, tenant }, config, language } : undefined;
	const pdf = await renderReminderPdf(letter, from, recipient, formatSwissDate(day), payment);
	return { tenant, letter, pdf, paymentDeadline };
}

async function deliverByEmail(document: Document, to: string | null, letter: ReturnType<typeof reminderLetter>, pdf: Buffer) {
	if (!to) {
		const deliveryError = DELIVERY_ERRORS.TENANT_NO_EMAIL;
		return { document: (await recordDeliveryError(document.id, deliveryError))!, deliveryError };
	}
	try {
		await createMailTransport().send({
			to,
			subject: letter.subject,
			text: letter.text,
			attachments: [{ filename: document.fileName, content: pdf, contentType: 'application/pdf' }]
		});
		return { document: (await markDocumentSent(document.id))! };
	} catch (error) {
		if (!(error instanceof MailConfigError)) console.error('Reminder e-mail not delivered:', error);
		const deliveryError =
			error instanceof MailConfigError ? DELIVERY_ERRORS.MAIL_NOT_CONFIGURED : DELIVERY_ERRORS.MAIL_DELIVERY_FAILED;
		return { document: (await recordDeliveryError(document.id, deliveryError))!, deliveryError };
	}
}

export async function sendReminder(statementId: string) {
	const statement = await getStatement(statementId);
	if (!statement) throw new ReminderError('STATEMENT_NOT_FOUND', 'Abrechnung nicht gefunden.', 404);
	const level = await nextLevel(statement);
	const today = swissToday();
	const { tenant, letter, pdf, paymentDeadline } = await reminderOn(statement, level, today);

	const document = await createDocument({
		tenantId: tenant.id,
		statementId,
		type: 'reminder',
		reminderLevel: level,
		title: letter.title,
		fileName: `${letter.title} ${statement.statementNumber}.pdf`.replace(/[\\/:*?"<>|]/g, '_'),
		content: pdf.toString('base64'),
		channel: tenant.correspondenceChannel,
		status: 'to_send',
		paymentDeadline
	});
	await updateStatement(statementId, { reminderSentDate: today });

	if (tenant.correspondenceChannel !== 'email') return { document };
	return deliverByEmail(document, tenant.email, letter, pdf);
}

/**
 * The property manager posts a printed letter. A reminder still to send is remade with today's date and Zahlungsfrist
 * (#193) and goes by letter, also after a failed e-mail (#194)
 */
export async function markDocumentPosted(id: string) {
	const document = await getDocument(id);
	if (document?.type !== 'reminder' || document.status !== 'to_send') return markDocumentSent(id);
	const today = swissToday();
	const statement = (await getStatement(document.statementId!))!;
	const { pdf, paymentDeadline } = await reminderOn(statement, document.reminderLevel!, today);
	await updateStatement(statement.id, { reminderSentDate: today });
	return markDocumentSent(id, { content: pdf.toString('base64'), paymentDeadline });
}
