import { target } from '../screenplay/target';

export const uploadInvoicesButton = target('Rechnungen hochladen', (page) => page.getByTestId('invoice-upload-button'));
export const uploadBuildingSelect = target('Gebäude der Belege', (page) => page.getByTestId('invoice-upload-building-select'));
export const uploadFileInput = target('Dateien der Belege', (page) => page.getByTestId('invoice-upload-file-input'));
export const createInvoicesButton = target('Rechnungen erstellen', (page) => page.getByTestId('invoice-upload-create-button'));
export const uploadPurpose = target('Zweck des Hochladens', (page) => page.getByTestId('invoice-upload-purpose'));
export const uploadResult = target('Ergebnis des Hochladens', (page) => page.getByTestId('invoice-upload-result'));
export const cancelUploadButton = target('Hochladen abbrechen', (page) => page.getByTestId('dialog-cancel'));
export const discardMessage = target('Rückfrage Abbrechen', (page) => page.getByTestId('invoice-upload-discard-message'));
export const discardConfirm = target('Abbrechen bestätigen', (page) => page.getByTestId('invoice-upload-discard-confirm'));

/** Any file's row: the dialog lists the chosen files */
export const anyBelegRow = target('ein Beleg', (page) => page.getByTestId('invoice-upload-row').first());
/** The rows of files the KI still reads: their hints come when the reading ends and push the buttons below down */
export const belegeBeingRead = target('Belege, die noch gelesen werden', (page) =>
	page.getByTestId('invoice-upload-row-status').filter({ hasText: 'Wird gelesen' })
);
/** The row of one file in the dialog, by its file name */
export const belegRow = (fileName: string) =>
	target(`Beleg «${fileName}»`, (page) => page.getByTestId('invoice-upload-row').filter({ hasText: fileName }));
const inRow = (fileName: string, what: string, testid: string) =>
	target(`${what} des Belegs «${fileName}»`, (page) => belegRow(fileName).locate(page).getByTestId(testid));

export const belegMessage = (fileName: string) => inRow(fileName, 'Hinweis', 'invoice-upload-row-message');
export const belegSelected = (fileName: string) => inRow(fileName, 'Auswahl', 'invoice-upload-row-select');
export const belegDetailsToggle = (fileName: string) => inRow(fileName, 'Angaben', 'invoice-upload-row-toggle');
export const belegStatus = (fileName: string) => inRow(fileName, 'Stand', 'invoice-upload-row-status');
export const belegAmount = (fileName: string) => inRow(fileName, 'Betrag', 'invoice-amount-input');
export const belegInvoiceNumber = (fileName: string) =>
	inRow(fileName, 'Rechnungsnummer', 'invoice-upload-invoice-number-input');
export const belegBillingEntity = (fileName: string) =>
	inRow(fileName, 'Rechnungssteller', 'invoice-billing-entity-input');
export const belegCategory = (fileName: string) => inRow(fileName, 'Kategorie', 'invoice-category-select');
export const belegDescription = (fileName: string) => inRow(fileName, 'Beschreibung', 'invoice-description-input');
export const belegInvoiceDate = (fileName: string) => inRow(fileName, 'Rechnungsdatum', 'invoice-date-input');
export const belegUnsure = (fileName: string, field: string) =>
	inRow(fileName, `Hinweis «unsicher» ${field}`, `invoice-upload-unsure-${field}`);

// The Beleg of a saved invoice, on its detail page
export const belegLink = target('Beleg anzeigen', (page) => page.getByTestId('invoice-document-link'));
export const belegFileInput = target('Datei des Belegs', (page) => page.getByTestId('invoice-document-file-input'));
export const belegUploadButton = target('Beleg hochladen', (page) => page.getByTestId('invoice-document-upload-button'));
export const deleteBelegNote = target('Hinweis Beleg beim Löschen', (page) =>
	page.getByTestId('invoice-delete-document-note')
);
// The reminder to keep the paper invoice, in the dialog and at the Beleg of an invoice
export const keepOriginalHint = target('Hinweis Originalrechnung', (page) => page.getByTestId('invoice-keep-original'));
export const belegBilledNote = target('Warnung abgerechneter Beleg', (page) => page.getByTestId('invoice-document-billed'));
export const createdInvoiceLinks = target('Links der erstellten Rechnungen', (page) =>
	page.getByTestId('invoice-upload-created-link')
);
export const recordRestLink = target('Link zum Erfassen des Rests', (page) =>
	page.getByTestId('invoice-upload-record-rest')
);
export const belegHow = target('Anleitung zum Beleg', (page) => page.getByTestId('invoice-document-file-help'));
export const belegUploadHints = target('Hinweise aus dem Hochladen', (page) => page.getByTestId('invoice-document-hints'));
export const deleteBilledNote = target('Rat beim Löschen einer abgerechneten Rechnung', (page) =>
	page.getByTestId('invoice-delete-billed-document-note')
);
export const belegFileLink = (fileName: string) => inRow(fileName, 'Datei gross', 'invoice-upload-file-link');
export const uploadStatus = target('Stand des Hochladens', (page) => page.getByTestId('invoice-upload-progress'));
export const belegRemove = (fileName: string) => inRow(fileName, 'Datei entfernen', 'invoice-upload-row-remove');
export const belegDeductedRule = (fileName: string) =>
	inRow(fileName, 'Regel zu den Akontorechnungen', 'invoice-upload-deducted-rule');
export const uploadFileChoose = target('Dateien auswählen', (page) => page.getByTestId('invoice-upload-file-choose'));
export const belegDistributionKey = (fileName: string) =>
	inRow(fileName, 'Verteilschlüssel', 'invoice-distribution-key-select');
export const deleteBilledText = target('Was beim Löschen einer abgerechneten Rechnung zu tun ist', (page) =>
	page.getByTestId('invoice-delete-billed-text')
);
export const belegSelectedHelp = (fileName: string) => inRow(fileName, 'Grund der Auswahl', 'invoice-upload-row-select-help');
