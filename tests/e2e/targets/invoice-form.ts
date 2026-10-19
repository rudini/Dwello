import { target } from '../screenplay/target';

export const buildingSelect = target('Gebäudeauswahl', (page) => page.getByTestId('invoice-building-select'));
export const amountInput = target('Betrag', (page) => page.getByTestId('invoice-amount-input'));
export const invoiceDateInput = target('Rechnungsdatum', (page) => page.getByTestId('invoice-date-input'));
export const invoiceDateWords = target('Rechnungsdatum in Worten', (page) => page.getByTestId('invoice-date-input-words'));
export const periodWarning = target('Warnung Abrechnungsperiode', (page) => page.getByTestId('invoice-period-warning'));
export const billedWarning = target('Warnung schon abgerechnet', (page) => page.getByTestId('invoice-billed-warning'));
export const supplierInput = target('Rechnungssteller', (page) => page.getByTestId('invoice-billing-entity-input'));
export const descriptionInput = target('Beschreibung', (page) => page.getByTestId('invoice-description-input'));
export const categorySelect = target('Kategorieauswahl', (page) => page.getByTestId('invoice-category-select'));
export const utilityCostCheckbox = target('Umlagefähig', (page) => page.getByTestId('invoice-utility-cost-checkbox'));
export const categoryWarning = target('Warnung nicht umlagefähige Kategorie', (page) =>
	page.getByTestId('invoice-category-warning')
);
export const overrideReasonInput = target('Grund der Änderung', (page) => page.getByTestId('invoice-override-reason-input'));
export const invoiceSubmitButton = target('Rechnung speichern', (page) => page.getByTestId('submit-button'));
export const invoiceNumberInput = target('Rechnungsnummer', (page) => page.getByTestId('invoice-number-input'));
export const servicePeriodHelp = target('Hilfe zum Leistungszeitraum', (page) => page.getByTestId('invoice-service-period-help'));
export const utilityCostHelp = target('Hilfe zu Umlagefähig', (page) => page.getByTestId('invoice-utility-cost-checkbox-help'));
export const keySelect = target('Verteilschlüssel', (page) => page.getByTestId('invoice-distribution-key-select'));
export const keyHelp = target('Hilfe zum Verteilschlüssel', (page) => page.getByTestId('invoice-distribution-key-help'));
