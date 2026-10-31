import { question } from '../screenplay/actor';
import { Count, MailsTo, Text } from '../screenplay/questions';
import {
	documentRow,
	documentStatus,
	lastReminderDate,
	listedReminderWaitsHint,
	markedSentNotice,
	markedSentPdf,
	nextReminderDate,
	reminderButton,
	reminderFeedback,
	reminderWaitsHint
} from '../targets/documents';
import { paymentSummary } from '../targets/statement-detail';
import { statementRow } from '../targets/statements';
import { reminderDeliveryInfo } from '../targets/documents';

export const reminderOutcome = Text.of(reminderFeedback);
export const reminderOffers = Count.of(reminderButton);
export const nextReminder = Text.of(nextReminderDate);
export const lastReminder = Text.of(lastReminderDate);
// on the loaded panel «Zahlung»: whether it names a last reminder, a next one and a reminder still to send (#545)
export const reminderDatesShown = question('the reminder dates of the statement', async (actor) => {
	await actor.answer(Text.of(paymentSummary));
	return {
		last: await actor.answer(Count.of(lastReminderDate)),
		next: await actor.answer(Count.of(nextReminderDate)),
		toSend: await actor.answer(Count.of(reminderWaitsHint))
	};
});
// the same in the row of the statement list: its texts on «Gemahnt am» and «Nächste Mahnung», and the hint
export const listedReminderDates = (tenantName: string) =>
	question(`the reminder dates of the statement of ${tenantName} in the list`, async (actor) => {
		const text = (await actor.answer(Text.of(statementRow(tenantName)))) ?? '';
		return {
			dates: text.match(/(?:Gemahnt am|Nächste Mahnung möglich ab) [\d.]+/g) ?? [],
			toSend: await actor.answer(Count.of(listedReminderWaitsHint(tenantName)))
		};
	});
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
