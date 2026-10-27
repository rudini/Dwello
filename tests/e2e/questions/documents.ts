import { question } from '../screenplay/actor';
import { Count, MailsTo, Text } from '../screenplay/questions';
import {
	documentRow,
	documentStatus,
	markedSentNotice,
	markedSentPdf,
	nextReminderDate,
	reminderButton,
	reminderFeedback
} from '../targets/documents';
import { reminderDeliveryInfo } from '../targets/documents';

export const reminderOutcome = Text.of(reminderFeedback);
export const reminderOffers = Count.of(reminderButton);
export const nextReminder = Text.of(nextReminderDate);
export const justMarkedSent = Text.of(markedSentNotice);
export const printOffers = Count.of(markedSentPdf);
export const deliveryOf = (title: string) => Text.of(documentStatus(title));
export const documentFor = (title: string, tenantName: string) => Text.of(documentRow(title, tenantName));
export const documentsFor = (title: string, tenantName: string) => Count.of(documentRow(title, tenantName));

// Per mail to the address its subject before « – » and whether each attachment is a PDF
export const mailsTo = (address: string) =>
	question(`the mails to ${address}`, async (actor) =>
		(await actor.answer(MailsTo(address))).map((mail) => [mail.subject.split(' – ')[0], mail.attachments.map((name) => /\.pdf$/.test(name))])
	);
export const reminderDelivery = Text.of(reminderDeliveryInfo);
