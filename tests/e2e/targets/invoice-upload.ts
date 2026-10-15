import { target } from '../screenplay/target';

export const uploadInvoicesButton = target('Rechnungen hochladen', (page) => page.getByTestId('invoice-upload-button'));
export const uploadBuildingSelect = target('Gebäude der Belege', (page) => page.getByTestId('invoice-upload-building-select'));
export const uploadFileInput = target('Dateien der Belege', (page) => page.getByTestId('invoice-upload-file-input'));
export const createInvoicesButton = target('Rechnungen erstellen', (page) => page.getByTestId('invoice-upload-create-button'));
export const uploadResult = target('Ergebnis des Hochladens', (page) => page.getByTestId('invoice-upload-result'));
export const cancelUploadButton = target('Hochladen abbrechen', (page) => page.getByTestId('invoice-upload-cancel-button'));
export const discardMessage = target('Rückfrage Abbrechen', (page) => page.getByTestId('invoice-upload-discard-message'));
export const discardConfirm = target('Abbrechen bestätigen', (page) => page.getByTestId('invoice-upload-discard-confirm'));

/** The row of one file in the dialog, by its file name */
export const belegRow = (fileName: string) =>
	target(`Beleg «${fileName}»`, (page) => page.getByTestId('invoice-upload-row').filter({ hasText: fileName }));
const inRow = (fileName: string, what: string, testid: string) =>
	target(`${what} des Belegs «${fileName}»`, (page) => belegRow(fileName).locate(page).getByTestId(testid));

export const belegMessage = (fileName: string) => inRow(fileName, 'Hinweis', 'invoice-upload-row-message');
export const belegSelected = (fileName: string) => inRow(fileName, 'Auswahl', 'invoice-upload-row-select');
export const belegDetailsToggle = (fileName: string) => inRow(fileName, 'Angaben', 'invoice-upload-row-toggle');
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
export const belegLink = target('Beleg anzeigen', (page) => page.getByTestId('invoice-beleg-link'));
export const belegFileInput = target('Datei des Belegs', (page) => page.getByTestId('invoice-beleg-file-input'));
export const belegUploadButton = target('Beleg hochladen', (page) => page.getByTestId('invoice-beleg-upload-button'));
export const deleteBelegNote = target('Hinweis Beleg beim Löschen', (page) =>
	page.getByTestId('invoice-delete-beleg-note')
);
// The reminder to keep the paper invoice, in the dialog and at the Beleg of an invoice
export const keepOriginalHint = target('Hinweis Originalrechnung', (page) => page.getByTestId('invoice-keep-original'));
export const belegBilledNote = target('Warnung abgerechneter Beleg', (page) => page.getByTestId('invoice-beleg-billed'));
