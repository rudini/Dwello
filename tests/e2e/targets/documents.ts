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
// #1262: the button that opens the file choice, what the eye sees of the file field
export const documentFileButton = target('Datei auswählen', (page) => page.getByTestId('tenant-document-file-button'));
export const uploadDocumentButton = target('Dokument hochladen', (page) => page.getByTestId('tenant-document-upload-button'));
// #677 (decision 9): what a busy button says, next to it
export const uploadDocumentStatus = target('Status von «Dokument hochladen»', (page) =>
	page.getByTestId('tenant-document-upload-button-busy-status')
);
export const deleteDocumentConfirm = target('Dokument löschen bestätigen', (page) => page.getByTestId('document-delete-confirm'));
export const deleteDocumentStatus = target('Status von «Dokument löschen»', (page) =>
	page.getByTestId('document-delete-confirm-busy-status')
);
// #1209 (persona Helga P-1, P-2): the progress sign of a busy button and the dialog's cancel beside it
export const uploadDocumentProgress = target('Fortschrittszeichen von «Dokument hochladen»', (page) =>
	page.getByTestId('tenant-document-upload-button-busy-indicator')
);
export const deleteDocumentCancel = target('Löschen abbrechen', (page) => page.getByRole('dialog').getByTestId('dialog-cancel'));
// #1261: why «Abbrechen» does nothing while the dialog works
export const openDialog = target('offener Dialog', (page) => page.getByRole('dialog'));
export const dialogBusyNote = target('Hinweis im arbeitenden Dialog', (page) => page.getByRole('dialog').getByTestId('dialog-busy-note'));
// #1290: why file and title are locked while the upload runs, a live region
export const uploadBusyNote = target('Hinweis beim Hochladen', (page) => page.getByTestId('tenant-document-upload-busy-note'));
export const documentsEmpty = target('Hinweis keine Dokumente in «Dokumente»', (page) => page.getByTestId('documents-empty'));
export const noDocumentsHint = target('Hinweis keine Dokumente', (page) => page.getByTestId('tenant-documents-empty'));
// #677: the caution at the file field when a file of that name is already uploaded to the tenant
export const duplicateFileNote = target('Hinweis Datei schon hochgeladen', (page) => page.getByTestId('tenant-document-file-duplicate'));
// #677: in «Dokumente», the tenant's name in a row leads to the tenant; the filter shows one tenant's documents
export const documentTenantLink = (title: string, tenantName: string) =>
	target(`Mieter ${tenantName} bei «${title}»`, (page) => documentRow(title, tenantName).locate(page).getByTestId('document-tenant-link'));
export const documentsTenantFilter = target('Filter Mieter der Dokumente', (page) => page.getByTestId('documents-tenant-filter'));
export const documentsView = (view: 'Alle' | 'Zu versenden') =>
	target(`Ansicht «${view}» der Dokumente`, (page) =>
		page.getByTestId(view === 'Alle' ? 'documents-filter-all' : 'documents-filter-to-send')
	);
// the file chosen, said beside the button of the file field
export const chosenDocumentFile = target('Gewählte Datei', (page) => page.getByTestId('tenant-document-file-chosen'));
export const openDocumentLink = (title: string, tenantName = '') =>
	target(`«${title}» ${tenantName}`.trim() + ' öffnen', (page) => documentRow(title, tenantName).locate(page).getByTestId('document-pdf-link'));
// #1181: what the download link and the delete button of a row are called for a screen reader
export const documentRowControls = (title: string, tenantName = '') =>
	target(`Schaltflächen von «${title}» ${tenantName}`.trim(), (page) =>
		documentRow(title, tenantName).locate(page).getByTestId(/^document-(pdf-link|delete-button)$/)
	);
export const deleteDocumentButton = (title: string) =>
	target(`«${title}» löschen`, (page) => documentRow(title).locate(page).getByTestId('document-delete-button'));
export const deleteTenantMessage = target('Bestätigung Mieter löschen', (page) => page.getByTestId('delete-dialog-message'));
export const deleteDocumentMessage = target('Bestätigung Dokument löschen', (page) =>
	page.getByTestId('document-delete-message')
);
// the confirmation before a letter counts as posted (Persona Dr. Weber 534 P-2)
export const confirmMarkSentButton = target('Als versendet markieren bestätigen', (page) => page.getByTestId('document-mark-sent-confirm'));
// #736: what an undelivered e-mail says, with the way to the tenant and to «Dokumente»
export const deliveryTenantLink = (title: string, tenantName: string) =>
	target(`E-Mail-Adresse prüfen bei «${title}» an ${tenantName}`, (page) =>
		documentRow(title, tenantName).locate(page).getByTestId('delivery-tenant-link')
	);
export const rowDocumentsLink = (title: string) =>
	target(`Zu den Dokumenten bei «${title}»`, (page) =>
		documentRow(title).locate(page).getByTestId('delivery-documents-link')
	);
export const feedbackDocumentsLink = target('Zu den Dokumenten in der Rückmeldung der Mahnung', (page) =>
	page.getByTestId('reminder-feedback-box').getByTestId('delivery-documents-link')
);
