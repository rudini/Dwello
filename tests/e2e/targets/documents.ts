import { target } from '../screenplay/target';

export const reminderButton = target('Mahnung senden', (page) => page.getByTestId('statement-reminder-button'));
export const confirmReminderButton = target('Mahnung bestätigen', (page) => page.getByTestId('statement-reminder-confirm'));
export const nextReminderDate = target('Nächste Mahnung möglich ab', (page) => page.getByTestId('statement-next-reminder'));
export const reminderFeedback = target('Rückmeldung Mahnung', (page) => page.getByTestId('reminder-feedback'));
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
export const openDocumentLink = (title: string) =>
	target(`«${title}» öffnen`, (page) => documentRow(title).locate(page).getByTestId('document-pdf-link'));
export const deleteDocumentButton = (title: string) =>
	target(`«${title}» löschen`, (page) => documentRow(title).locate(page).getByTestId('document-delete-button'));
export const deleteTenantMessage = target('Bestätigung Mieter löschen', (page) => page.getByTestId('delete-dialog-message'));
export const deleteDocumentMessage = target('Bestätigung Dokument löschen', (page) =>
	page.getByTestId('document-delete-message')
);
