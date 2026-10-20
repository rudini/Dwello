import { type Target, target } from '../screenplay/target';

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
// shown once step 2 has its answers on the building's invoices and its billed contracts, together (BuildingStep.svelte)
export const buildingInvoiceCount = (buildingId: string) =>
	target(`Rechnungen von Gebäude ${buildingId} in der Wahl`, (page) => page.getByTestId(`generate-building-invoices-${buildingId}`));
export const existingStatements = target('Hinweis «Es gibt schon Abrechnungen»', (page) => page.getByTestId('existing-statements'));
export const stepLabel = target('Name des Schritts', (page) => page.getByTestId('statement-step-label'));
export const allBuildingsCheckbox = target('Alle Gebäude', (page) => page.getByTestId('generate-all-buildings'));
// Next to the counter: the buildings «Alle Gebäude» leaves out
export const allBuildingsNote = target('Hinweis zu «Alle Gebäude»', (page) => page.getByTestId('generate-all-buildings-note'));
// #199, #408 point 2: a way out of a period that overlaps the building's statements, by the first day of the period it opens
export const offeredPeriodLink = (buildingId: string, periodStart: string) =>
	target(`Abrechnungsperiode ab ${periodStart} für Gebäude ${buildingId}`, (page) =>
		page.getByTestId(`generate-building-period-${buildingId}-${periodStart}`)
	);
// Mietverträge of the building that already have a statement for the period (step 2)
export const buildingBilled = (buildingId: string) =>
	target(`Schon abgerechnet im Gebäude ${buildingId}`, (page) => page.getByTestId(`generate-building-billed-${buildingId}`));
export const generateButton = target('Abrechnungen erstellen', (page) => page.getByTestId('generate-statements-button'));
export const previewCount = target('Anzahl in der Vorschau', (page) => page.getByTestId('preview-count'));
export const previewFee = target('Verwaltungspauschale der Vorschau', (page) => page.getByTestId('preview-fee'));
export const previewRows = target('Zeilen der Vorschau', (page) => page.getByTestId('preview-row'));
export const previewRow = (tenantName: string) =>
	target(`Zeile von «${tenantName}» in der Vorschau`, (page) => previewRows.locate(page).filter({ hasText: tenantName }));
export const previewAkontoHint = (tenantName: string) =>
	target(`Akonto-Hinweis von «${tenantName}» in der Vorschau`, (page) =>
		previewRow(tenantName).locate(page).getByTestId('preview-akonto-hint')
	);
export const previewEmpty = target('Hinweis keine Mietverträge in der Periode', (page) => page.getByTestId('preview-empty'));
export const generationResult = target('Ergebnis der Erstellung', (page) => page.getByTestId('generation-result'));
export const showStatementsButton = target('Abrechnungen anzeigen', (page) => page.getByTestId('show-statements-button'));
export const downloadZipButton = target('Alle als ZIP herunterladen', (page) => page.getByTestId('download-zip-button'));
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
export const partialInvoices = target('Hinweis auf Monate ohne Rechnung', (page) => page.getByTestId('partial-invoices'));
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
export const periodRunningWarning = target('Warnung laufende Periode', (page) => page.getByTestId('preview-period-warning'));
export const tankQuestion = target('Frage nach dem Heizmaterial', (page) => page.getByTestId('tank-question'));
export const noTankLink = (buildingId: string) =>
	target(`Kein Tank festhalten für ${buildingId}`, (page) => page.getByTestId(`tank-question-no-tank-${buildingId}`));
export const draftsOnlyNote = target('Hinweis nur Entwürfe', (page) => page.getByTestId('generate-drafts-note'));
// The contracts of the run without an agreed Verwaltungspauschale, each a link to it (#89, step «Einstellungen»)
export const feeNotAgreed = target('Mietverträge ohne vereinbarte Verwaltungspauschale', (page) =>
	page.getByTestId('management-fee-not-agreed')
);
export const feeNotAgreedLink = (contractId: string) =>
	target(`Mietvertrag ${contractId} ohne vereinbarte Verwaltungspauschale`, (page) =>
		page.getByTestId(`management-fee-not-agreed-link-${contractId}`)
	);
// What the link that opened the wizard chose, and where its settings come from (A-10)
export const wizardPresetNotice = target('Vorgaben aus dem Link', (page) => page.getByTestId('wizard-preset'));
// Invoices the preview names because their Leistungszeitraum is missing: dated shortly after the period, or counted
// in full in a period under a year
export const lateInvoices = target('Hinweis auf Rechnungen nach der Abrechnungsperiode', (page) => page.getByTestId('late-invoices'));
export const invoicesWithoutServicePeriod = target('Hinweis auf Rechnungen ohne Leistungszeitraum', (page) =>
	page.getByTestId('invoices-without-service-period')
);
// Heating invoices without Leistungszeitraum next to ones with one, at a tenant change with a Heizprofil (#339)
export const heatingWithoutServicePeriod = target('Hinweis auf Rechnungen der Heizkosten ohne Leistungszeitraum', (page) =>
	page.getByTestId('heating-without-service-period')
);
export const hintedInvoice = (hint: Target, date: string) =>
	target(`Rechnung vom ${date} in «${hint}»`, (page) => hint.locate(page).getByTestId('hinted-invoice').filter({ hasText: date }));
// the date names the invoice in either hint
export const hintedInvoiceLink = (date: string) =>
	target(`Rechnung vom ${date} in einem Hinweis bearbeiten`, (page) =>
		page.getByTestId('hinted-invoice').filter({ hasText: date }).getByRole('link')
	);
// Per statement in the preview's hint on existing statements: what changed since or differs (#132)
export const existingStatementNotes = (statementId: string) =>
	target(`Hinweis zur Abrechnung ${statementId}`, (page) => page.getByTestId(`existing-statement-notes-${statementId}`));
export const existingStatementLink = (statementId: string) =>
	target(`Abrechnung ${statementId} in der Vorschau`, (page) => page.getByTestId(`existing-statement-${statementId}`));
// #91, step «Einstellungen»: per contract of the run, whether a category with costs in the period is agreed
export const agreementQuestions = target('Fragen nach vereinbarten Nebenkosten', (page) => page.getByTestId('agreement-questions'));
export const agreementsOf = (contractId: string) =>
	target(`Fragen zum Mietvertrag ${contractId}`, (page) => page.getByTestId(`agreement-contract-${contractId}`));
export const agreementChoice = (contractId: string, categoryId: string, agreed: boolean) =>
	target(`Antwort ${agreed ? 'vereinbart' : 'nicht vereinbart'} für ${categoryId} im Mietvertrag ${contractId}`, (page) =>
		page.getByTestId(`agreement-${contractId}-${categoryId}-${agreed ? 'yes' : 'no'}`)
	);
// the answer stored («Beim Mietvertrag gespeichert.») or refused (the question's error)
export const agreementAnswered = (contractId: string, categoryId: string) =>
	target(`Antwort für ${categoryId} im Mietvertrag ${contractId} gespeichert oder abgelehnt`, (page) =>
		page
			.getByTestId(`agreement-saved-${contractId}-${categoryId}`)
			.filter({ hasText: /./ })
			.or(page.getByTestId(`agreement-${contractId}-${categoryId}`).getByTestId('form-error'))
	);
// the run's contracts with categories answered «nicht vereinbart» and costs in the period, each a link to it
export const notAgreedCostsLink = (contractId: string) =>
	target(`Mietvertrag ${contractId} mit nicht vereinbarten Nebenkosten`, (page) =>
		page.getByTestId(`not-agreed-costs-link-${contractId}`)
	);
export const oldAddress = target('Warnung vor der alten Adresse', (page) => page.getByTestId('preview-old-address'));
// while the questions load, and when they cannot be loaded
export const agreementsLoading = target('Vereinbarte Nebenkosten werden geprüft', (page) => page.getByTestId('agreements-loading'));
export const agreementsFailed = target('Vereinbarte Nebenkosten nicht geprüft', (page) => page.getByTestId('agreements-failed'));
export const agreementsRetry = target('Erneut versuchen', (page) => page.getByTestId('agreements-retry'));
export const agreementsWait = target('Warten auf die Prüfung der Mietverträge', (page) => page.getByTestId('agreements-wait'));
// #453 (#327): the note on the total, a contract «Abgerechnet bis» covers in full, and a building all of whose are
export const previewVacancyNote = target('Notiz zum Total der Vorschau', (page) => page.getByTestId('preview-vacancy-note'));
export const previewSkipped = (contractId: string) =>
	target('übergangener Mietvertrag in der Vorschau', (page) => page.getByTestId(`preview-skipped-${contractId}`));
export const previewSkippedLink = (contractId: string) =>
	target('Link zum übergangenen Mietvertrag', (page) => previewSkipped(contractId).locate(page).getByRole('link'));
export const previewAllSkipped = (buildingId: string) =>
	target('Hinweis alle Mietverträge ausserhalb von Dwello abgerechnet', (page) =>
		page.getByTestId(`preview-all-skipped-${buildingId}`)
	);
