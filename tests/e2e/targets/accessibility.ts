import { target } from '../screenplay/target';

// What the axe check and the language check use to bring a screen into a state (tests/a11y/screens.json)
const byTestId = (description: string, testId: string) => target(description, (page) => page.getByTestId(testId));
const bySelector = (description: string, selector: string) =>
	target(description, (page) => page.locator(selector).first());

export const emptyHint = bySelector('Hinweis auf leere Liste', '[data-testid$="-empty"]');
export const loginError = bySelector('Anmeldefehler', '[data-testid="login-error"]');
export const text = (shown: string) => target(`Text «${shown}»`, (page) => page.getByText(shown));
export const link = (name: string) => target(`Link «${name}»`, (page) => page.getByRole('link', { name }));
// the save button closes a form
export const saveButton = target('Speichern', (page) => page.locator('main [type=submit]').last());
export const requiredFields = target('Pflichtfelder', (page) =>
	page.locator('main :is(input, textarea)[aria-required="true"]:not([type=radio], [type=checkbox])')
);
export const formProblem = bySelector('Fehlermeldung im Formular', '[data-testid="form-error"], [aria-invalid="true"]');
export const savedToast = bySelector('Erfolgsmeldung', '[data-testid="toast-success"]');
export const frenchOption = bySelector('Sprache Français', '[data-testid="language-option"][lang="fr"]');
export const frenchPage = bySelector('Seite auf Französisch', 'html[lang="fr"] body[data-hydrated]');
// by its value, so the language rows find it in every language
export const notAllowedOption = byTestId('Nicht umlagefähig', 'category-allowance-false');
export const allowedOption = byTestId('Umlagefähig', 'category-allowance-true');
export const proposalChecking = byTestId('Die KI prüft', 'category-proposal-checking');
export const firstDeleteButton = bySelector('Erstes Löschen', '[data-testid$="-delete-button"]');
export const firstFuelStockDelete = bySelector('Ersten Tankbestand löschen', '[data-testid^="fuel-stock-delete-"]');
// Confirmation dialogs end with a button whose test id ends in -confirm
export const dialogConfirm = bySelector('Bestätigen im Dialog', '[data-testid$="-confirm"]');
export const galleryDialogButton = byTestId('Dialog öffnen', 'gallery-open-dialog');
export const galleryBusyDialogButton = byTestId('Dialog mit Ladezustand öffnen', 'gallery-open-busy-dialog');
export const dialog = bySelector('Dialog', '[role="dialog"]');
export const labelledDialog = bySelector('Dialog mit Titel', '[role="dialog"][aria-labelledby]');
export const dialogError = target('Fehlermeldung im Dialog', (page) => page.getByRole('dialog').getByTestId('form-error'));
export const invalidPastEndConfirm = target('Unbestätigtes Vertragsende in der Vergangenheit', (page) =>
	page.getByTestId('contract-end-past-confirm').and(page.locator('[aria-invalid="true"]'))
);
export const refusedStatements = byTestId('Abgelehnte Abrechnungen', 'refused-statements');
export const wizardPreset = byTestId('Vorgaben aus dem Link', 'wizard-preset');
export const listScope = byTestId('Auswahl der Liste', 'statements-scope');
export const sendButton = byTestId('Abrechnung versenden', 'statement-send-button');
export const recalculateButton = byTestId('Neu berechnen', 'statement-recalculate-button');
export const reminderButton = byTestId('Mahnung senden', 'statement-reminder-button');
export const resetPaymentButton = byTestId('Zahlung zurücksetzen', 'statement-reset-payment-button');
export const correctButton = byTestId('Abrechnung berichtigen', 'statement-correct-button');
export const declineCorrectionButton = byTestId('Nicht berichtigen', 'statement-decline-correction-button');
export const paidDateInput = byTestId('Bezahlt am', 'paid-date-input');
export const markPaidConfirm = byTestId('Bezahlt bestätigen', 'statement-mark-paid-confirm');
export const earlyPaidWarning = byTestId('Zahlungsdatum vor dem Abrechnungsdatum', 'paid-date-early-warning');
// the detail page's button, or the first one in the list
export const markPaidButton = bySelector(
	'Als bezahlt markieren',
	'[data-testid="statement-mark-paid-button"], [data-testid="statement-row-mark-paid"]'
);
export const formulaInput = byTestId('Formel', 'distribution-key-formula-input');
export const formulaTestButton = byTestId('Formel testen', 'distribution-key-test-button');
export const formulaTestOutcome = bySelector(
	'Ergebnis des Formeltests',
	'[data-testid="formula-test-result"], [data-testid="formula-test-error"]'
);
export const januaryShare = byTestId('Anteil Januar', 'heating-profile-month-january');
export const invalidProfileTotal = bySelector('Ungültige Summe', '[data-testid="heating-profile-form-total"].text-critical');
export const mobileMenuButton = byTestId('Menü', 'mobile-menu-button');
export const mainNavigationDialog = (label: string) =>
	bySelector(`Dialog «${label}»`, `[role="dialog"][aria-label="${label}"]`);
export const languageOptions = bySelector('Sprachauswahl', '[data-testid="language-option"]');
export const userMenuSettings = byTestId('Einstellungen im Benutzermenü', 'user-menu-settings');
export const overlapWarning = byTestId('Überschneidung', 'overlap-warning');
export const periodStartInput = byTestId('Periodenbeginn', 'period-start-input');
export const periodEndInput = byTestId('Periodenende', 'period-end-input');
export const periodFutureWarning = byTestId('Periode nicht vorbei', 'period-future-warning');
export const generateBuilding = (buildingId: string) =>
	byTestId(`Gebäude ${buildingId} abrechnen`, `generate-building-${buildingId}`);
export const confirmMissingInvoices = byTestId('Fehlende Rechnungen bestätigen', 'confirm-missing-invoices');
/** What shows that a state or a wizard step is reached, by its test id */
export const shown = (testId: string) => bySelector(testId, `[data-testid="${testId}"]`);
// #91: the first answer «Vereinbart» in the statement wizard's step 3
export const firstAgreementYes = target('Erste Antwort «Vereinbart»', (page) => page.getByTestId(/^agreement-.+-yes$/).first());
export const firstAgreementFrom = target('Erste Antwort «Vereinbart ab»', (page) => page.getByTestId(/^agreement-.+-from$/).first());
