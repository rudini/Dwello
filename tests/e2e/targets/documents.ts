import { target } from '../screenplay/target';
import { statementRow } from './statements';

export const reminderButton = target('Mahnung senden', (page) => page.getByTestId('statement-reminder-button'));
export const confirmReminderButton = target('Mahnung bestätigen', (page) => page.getByTestId('statement-reminder-confirm'));
export const reminderDeliveryInfo = target('Versandweg der Mahnung', (page) => page.getByTestId('reminder-delivery-info'));
export const reminderOwed = target('Geschuldeter Betrag der Mahnung', (page) => page.getByTestId('reminder-owed')); // #959
export const nextReminderDate = target('Nächste Mahnung möglich ab', (page) => page.getByTestId('statement-next-reminder'));
export const lastReminderDate = target('Letzte Mahnung', (page) => page.getByTestId('statement-last-reminder'));
// #545: a reminder still «Zu versenden», on the detail page and in a row of the statement list
export const reminderWaitsHint = target('Hinweis Mahnung noch zu versenden', (page) => page.getByTestId('statement-reminder-to-send'));
export const listedReminderWaitsHint = (tenantName: string) =>
	target(`Hinweis Mahnung noch zu versenden bei ${tenantName}`, (page) =>
		statementRow(tenantName).locate(page).getByTestId('statement-reminder-to-send')
	);
export const markedSentNotice = target('Hinweis Brief versendet', (page) => page.getByTestId('document-marked-sent'));
export const markedSentPdf = target('PDF des versendeten Briefs', (page) => page.getByTestId('document-marked-sent-pdf'));
export const reminderFeedback = target('Rückmeldung Mahnung oder Versand', (page) => page.getByTestId('reminder-feedback').or(page.getByTestId('send-feedback')));
export const documentRow = (title: string, tenantName = '') =>
	target(`Dokument «${title}» ${tenantName}`.trim(), (page) =>
		page.getByTestId('document-row').filter({ hasText: title }).filter({ hasText: tenantName })
	);
export const documentStatus = (title: string) =>
	target(`Versandstatus «${title}»`, (page) => documentRow(title).locate(page).getByTestId('document-status'));
export const markSentButton = (title: string, tenantName: string) =>
	target(`«${title}» an ${tenantName} als versendet markieren`, (page) =>
		documentRow(title, tenantName).locate(page).getByTestId('document-mark-sent')
	);
export const documentFileInput = target('Datei des Dokuments', (page) => page.getByTestId('tenant-document-file-input'));
export const documentTitleInput = target('Titel des Dokuments', (page) => page.getByTestId('tenant-document-title-input'));
export const uploadDocumentButton = target('Dokument hochladen', (page) => page.getByTestId('tenant-document-upload-button'));
export const noDocumentsHint = target('Hinweis keine Dokumente', (page) => page.getByTestId('tenant-documents-empty'));
export const openDocumentLink = (title: string, tenantName = '') =>
	target(`«${title}» ${tenantName}`.trim() + ' öffnen', (page) => documentRow(title, tenantName).locate(page).getByTestId('document-pdf-link'));
export const deleteDocumentButton = (title: string) =>
	target(`«${title}» löschen`, (page) => documentRow(title).locate(page).getByTestId('document-delete-button'));
export const deleteTenantMessage = target('Bestätigung Mieter löschen', (page) => page.getByTestId('delete-dialog-message'));
export const deleteDocumentMessage = target('Bestätigung Dokument löschen', (page) =>
	page.getByTestId('document-delete-message')
);
// the confirmation before a letter counts as posted (Persona Dr. Weber 534 P-2)
export const confirmMarkSentButton = target('Als versendet markieren bestätigen', (page) => page.getByTestId('document-mark-sent-confirm'));
