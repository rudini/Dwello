import { target } from '../screenplay/target';

export const periodStartInput = target('Beginn der Abrechnungsperiode', (page) => page.getByTestId('period-start-input'));
export const periodEndInput = target('Ende der Abrechnungsperiode', (page) => page.getByTestId('period-end-input'));
export const heatingProfileSelect = target('Heizprofil', (page) => page.getByTestId('heating-profile-select'));
export const managementFeeInput = target('Verwaltungspauschale', (page) => page.getByTestId('management-fee-input'));
export const wizardChoices = target('Auswahlfelder des Assistenten', (page) => page.getByRole('combobox'));
export const managementFeeHint = target('Hinweis zur Verwaltungspauschale', (page) =>
	page.getByTestId('management-fee-hint')
);
// What a screen reader announces without moving the focus
export const announcement = (text: string) =>
	target(`Ansage «${text}»`, (page) => page.getByRole('status').filter({ hasText: text }));
export const buildingCheckbox = (buildingId: string) =>
	target(`Gebäude ${buildingId} für die Abrechnungen`, (page) => page.getByTestId(`generate-building-${buildingId}`));
export const generateButton = target('Abrechnungen erstellen', (page) => page.getByTestId('generate-statements-button'));
export const previewCount = target('Anzahl in der Vorschau', (page) => page.getByTestId('preview-count'));
export const previewFee = target('Verwaltungspauschale der Vorschau', (page) => page.getByTestId('preview-fee'));
export const previewRows = target('Zeilen der Vorschau', (page) => page.getByTestId('preview-row'));
export const previewRow = (tenantName: string) =>
	target(`Zeile von «${tenantName}» in der Vorschau`, (page) => previewRows.locate(page).filter({ hasText: tenantName }));
export const previewEmpty = target('Hinweis keine Mietverträge in der Periode', (page) => page.getByTestId('preview-empty'));
export const generationResult = target('Ergebnis der Erstellung', (page) => page.getByTestId('generation-result'));
export const showStatementsButton = target('Abrechnungen anzeigen', (page) => page.getByTestId('show-statements-button'));
// "Abbrechen" in the wizard's first step (after its breadcrumb), or the statement page's breadcrumb to the list
export const backLink = target('Zurück zur Abrechnungsliste', (page) =>
	page
		.getByTestId('form-cancel')
		.or(page.getByTestId('breadcrumb-link').filter({ hasText: 'Nebenkostenabrechnungen' }))
		.last()
);
export const generateMoreButton = target('Weitere Abrechnungen erstellen', (page) =>
	page.getByTestId('generate-more-button')
);
export const missingInvoices = target('Warnung fehlende Rechnungen', (page) => page.getByTestId('missing-invoices'));
export const newInvoiceFromWarning = target('Rechnung erfassen in der Warnung', (page) =>
	missingInvoices.locate(page).getByRole('link', { name: 'Rechnung erfassen' })
);
export const confirmMissingInvoices = target('Bestätigung trotz fehlender Rechnungen', (page) =>
	page.getByTestId('confirm-missing-invoices')
);
export const buildingInvoices = (buildingName: string) =>
	target(`Rechnungen von «${buildingName}» in der Vorschau`, (page) =>
		page.getByTestId('preview-invoices').filter({ hasText: buildingName })
	);
export const categoryFinding = (category: string) =>
	target(`Prüfung der Kategorie «${category}»`, (page) =>
		page.getByTestId('category-finding').filter({ hasText: category })
	);
export const draftsOnlyNote = target('Hinweis nur Entwürfe', (page) => page.getByTestId('generate-drafts-note'));
