import { target } from '../screenplay/target';

export const amount = target('Betrag', (page) => page.getByTestId('invoice-amount'));
export const category = target('Kategorie', (page) => page.getByTestId('invoice-category'));
export const distributionKey = target('Verteilschlüssel', (page) => page.getByTestId('invoice-distribution-key'));
export const utilityCost = target('Umlagefähigkeit', (page) => page.getByTestId('invoice-utility-cost'));
export const legalNote = target('Hinweis Mietrecht', (page) => page.getByTestId('invoice-legal-note'));
export const editButton = target('Rechnung bearbeiten', (page) => page.getByTestId('invoice-edit-button'));
export const deleteButton = target('Rechnung löschen', (page) => page.getByTestId('invoice-delete-button'));
export const deleteConfirm = target('Löschen der Rechnung bestätigen', (page) => page.getByTestId('invoice-delete-confirm'));
export const buildingLink = target('Gebäude der Rechnung', (page) => page.getByTestId('invoice-building-link'));
export const recategorizeButton = target('Neu kategorisieren', (page) => page.getByTestId('invoice-recategorize-button'));
export const recategorizeError = target('Fehler beim Kategorisieren', (page) =>
	page.getByTestId('invoice-recategorize-error')
);
export const overrideReason = target('Grund der Änderung der KI-Kategorie', (page) =>
	page.getByTestId('invoice-override-reason')
);
export const invoiceNumber = target('Rechnungsnummer', (page) => page.getByTestId('invoice-number'));
export const missedWarning = target('Warnung nicht in den Abrechnungen', (page) => page.getByTestId('invoice-missed-warning'));
export const missedStatementsLink = target('Abrechnungen ohne diese Rechnung', (page) =>
	page.getByTestId('invoice-missed-statements-link')
);
