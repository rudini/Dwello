import { target } from '../screenplay/target';

export const statementRow = (tenantName: string) =>
	target(`Abrechnung von ${tenantName} in der Liste`, (page) =>
		page.getByTestId(/^statement-row-/).filter({ hasText: tenantName })
	);
export const statementRowForYear = (tenantName: string, year: number) =>
	target(`Abrechnung ${year} von ${tenantName} in der Liste`, (page) =>
		statementRow(tenantName).locate(page).filter({ hasText: `31.12.${year}` })
	);
export const statementRows = target('Abrechnungen in der Liste', (page) => page.getByTestId(/^statement-row-/));
export const statementSearchInput = target('Suche Abrechnungen', (page) => page.getByTestId('statement-search-input'));
export const statementBuildingFilter = target('Filter Gebäude', (page) => page.getByTestId('statement-building-filter'));
export const statementSearchButton = target('Suchen', (page) => page.getByTestId('statement-search-submit'));
export const draftFilter = target('Filter Entwürfe', (page) => page.getByTestId('filter-draft'));
export const nextPageLink = target('Nächste Seite', (page) => page.getByTestId('pagination-next'));
export const generateStatementsButton = target('Abrechnungen erstellen', (page) =>
	page.getByTestId('statements-generate-button')
);
export const openStatementLink = (tenantName: string, year: number) =>
	target(`Abrechnung ${year} von ${tenantName} ansehen`, (page) =>
		statementRowForYear(tenantName, year).locate(page).getByTestId('statement-view-link')
	);
export const statementPdfLink = (tenantName: string, year: number) =>
	target(`PDF der Abrechnung ${year} von ${tenantName}`, (page) =>
		statementRowForYear(tenantName, year).locate(page).getByTestId('statement-pdf-link')
	);
export const statementsEmptyNotice = target('Hinweis keine Abrechnungen', (page) => page.getByTestId('statements-empty'));
export const statementsScope = target('Auswahl der Abrechnungsliste', (page) => page.getByTestId('statements-scope'));
