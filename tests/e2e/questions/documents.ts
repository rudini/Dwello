import { question } from '../screenplay/actor';
import { Count, Text } from '../screenplay/questions';
import { documentRow, documentStatus, reminderButton, reminderFeedback } from '../targets/documents';

type Mail = { to: string; subject: string; attachments: string[] };

export const reminderOutcome = Text.of(reminderFeedback);
export const reminderOffers = Count.of(reminderButton);
export const deliveryOf = (title: string) => Text.of(documentStatus(title));
export const documentFor = (title: string, tenantName: string) => Text.of(documentRow(title, tenantName));
export const documentsFor = (title: string, tenantName: string) => Count.of(documentRow(title, tenantName));

// Mail received by the mail catcher the backend sends to in E2E runs (playwright.config.ts): per mail its subject
// before « – » and whether each attachment is a PDF
export const mailsTo = (address: string) =>
	question(`the mails to ${address}`, async () =>
		((await (await fetch('http://localhost:2526/messages')).json()) as Mail[])
			.filter((mail) => mail.to === address)
			.map((mail) => [mail.subject.split(' – ')[0], mail.attachments.map((name) => /\.pdf$/.test(name))])
	);
