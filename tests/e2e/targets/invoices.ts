import { target } from '../screenplay/target';

export const invoiceRow = (supplier: string) =>
	target(`Rechnung von ${supplier} in der Liste`, (page) =>
		page.getByTestId(/^invoice-row-/).filter({ hasText: supplier })
	);
// #454: the filter «Abrechnungsperiode», named above the list
export const invoicePeriodFilter = target('Filter Abrechnungsperiode', (page) => page.getByTestId('invoice-period-filter'));
export const invoiceRows = target('Rechnungen in der Liste', (page) => page.getByTestId(/^invoice-row-/));
export const invoiceSearchInput = target('Suche Rechnungen', (page) => page.getByTestId('invoice-search-input'));
export const invoiceSearchButton = target('Suchen', (page) => page.getByTestId('invoice-search-submit'));
export const invoiceBuildingFilter = target('Filter Gebäude', (page) => page.getByTestId('invoice-building-filter'));
export const invoiceYearFilter = target('Filter Jahr', (page) => page.getByTestId('invoice-year-filter'));
export const invoiceValidityFilter = target('Filter Umlagefähigkeit', (page) =>
	page.getByTestId('invoice-validity-filter')
);
export const newInvoiceButton = target('Neue Rechnung', (page) => page.getByTestId('invoice-new-button'));
export const viewInvoiceButton = (supplier: string) =>
	target(`Rechnung von ${supplier} ansehen`, (page) =>
		invoiceRow(supplier).locate(page).getByTestId('invoice-view-button')
	);
export const editInvoiceButton = (supplier: string) =>
	target(`Rechnung von ${supplier} bearbeiten`, (page) =>
		invoiceRow(supplier).locate(page).getByTestId('invoice-edit-button')
	);
export const rowAmount = (supplier: string) =>
	target(`Betrag der Rechnung von ${supplier}`, (page) => invoiceRow(supplier).locate(page).getByTestId('invoice-amount'));
export const rowCategory = (supplier: string) =>
	target(`Kategorie der Rechnung von ${supplier}`, (page) =>
		invoiceRow(supplier).locate(page).getByTestId('invoice-category')
	);
export const rowStatus = (supplier: string) =>
	target(`Status der Rechnung von ${supplier}`, (page) => invoiceRow(supplier).locate(page).getByTestId('invoice-status'));
export const invoicesEmptyNotice = target('Hinweis keine Rechnungen', (page) => page.getByTestId('invoices-empty'));
