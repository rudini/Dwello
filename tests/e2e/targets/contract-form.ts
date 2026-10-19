import { target } from '../screenplay/target';

export const tenantSelect = target('Mieterauswahl', (page) => page.getByTestId('contract-tenant-select'));
export const fixedTenant = target('Mieter des Mietvertrags', (page) => page.getByTestId('contract-form-tenant'));
export const fixedApartment = target('Wohnung des Mietvertrags', (page) => page.getByTestId('contract-form-apartment'));
export const partiesHelp = target('Hilfe zu Mieter und Wohnung', (page) => page.getByTestId('contract-parties-help'));
export const apartmentSelect = target('Wohnungsauswahl', (page) => page.getByTestId('apartment-select'));
export const apartmentOption = (apartmentId: string) =>
	target(`Wohnung ${apartmentId} in der Auswahl`, (page) =>
		apartmentSelect.locate(page).locator(`option[value="${apartmentId}"]`)
	);
export const apartmentContractsUnknown = target('Hinweis bei der Wohnung', (page) =>
	page.getByTestId('apartment-contracts-unknown')
);
export const retryContractsButton = target('Mietverträge erneut laden', (page) =>
	page.getByTestId('contracts-retry')
);
export const startContractsUnknown = target('Hinweis beim Vertragsbeginn', (page) =>
	page.getByTestId('start-contracts-unknown')
);
export const reviewContractsUnknown = target('Hinweis in der Prüfung', (page) =>
	page.getByTestId('review-contracts-unknown')
);
export const startDateInput = target('Vertragsbeginn', (page) => page.getByTestId('start-date-input'));
// #133: the day up to which the Nebenkosten are billed outside Dwello, and its help
export const billedUntilInput = target('Abgerechnet bis', (page) => page.getByTestId('billed-until-input'));
export const billedUntilHelp = target('Hilfe zu «Abgerechnet bis»', (page) => page.getByTestId('billed-until-input-help'));
export const durationChoice = (label: string) =>
	target(`Vertragsdauer «${label}»`, (page) => page.getByTestId('contract-duration').getByText(label, { exact: true }));
export const durationOption = (label: string) =>
	target(`Option Vertragsdauer «${label}»`, (page) =>
		page.getByTestId('contract-duration').getByRole('radio', { name: label })
	);
export const endDateInput = target('Vertragsende', (page) => page.getByTestId('end-date-input'));
export const pastEndConfirm = target('Bestätigung Vertragsende in der Vergangenheit', (page) =>
	page.getByTestId('contract-end-past-confirm')
);
export const baseRentInput = target('Nettomiete', (page) => page.getByTestId('contract-base-rent-input'));
export const advancePaymentInput = target('Akonto', (page) => page.getByTestId('contract-advance-payment-input'));
// #464: the day from which a changed Akonto applies
export const advancePaymentFromInput = target('Akonto gültig ab', (page) => page.getByTestId('contract-advance-from-input'));
export const flatRateInput = target('Nebenkostenpauschale', (page) => page.getByTestId('contract-flat-rate-input'));
export const flatRateWarning = target('Hinweis zur Nebenkostenpauschale', (page) =>
	page.getByTestId('contract-flat-rate-warning')
);
// #66: the Akonto's help, the hint without Akonto, and the hint on changing a running contract
export const advancePaymentHelp = target('Hilfe zum Akonto', (page) => page.getByTestId('contract-advance-payment-input-help'));
export const noAdvanceNotice = target('Hinweis ohne Akonto', (page) => page.getByTestId('advance-payment-notice'));
export const runningContractEditHint = target('Hinweis zum laufenden Mietvertrag', (page) =>
	page.getByTestId('contract-running-hint')
);
export const contractSubmitButton = target('Mietvertrag speichern', (page) => page.getByTestId('submit-button'));
export const newTenantLink = target('Neuen Mieter erfassen', (page) => page.getByTestId('contract-new-tenant'));
export const reviewItem = (label: string) =>
	target(`Prüfung «${label}»`, (page) => page.getByTestId('contract-review-item').filter({ hasText: label }));
export const deleteDraftAndSaveButton = target('Entwurf löschen und speichern', (page) =>
	page.getByTestId('delete-draft-and-save')
);
// «Verwaltungspauschale vereinbart»: Satz des Abrechnungslaufs, eigener Satz or nein (#89)
export const feeChoice = (choice: 'run' | 'own' | 'none') =>
	target(`Verwaltungspauschale «${choice}»`, (page) => page.getByTestId(`contract-fee-choice-${choice}`));
export const feeHelp = target('Hilfe zur Verwaltungspauschale', (page) => page.getByTestId('contract-fee-choice-help'));
export const feeRateInput = target('Eigener Satz der Verwaltungspauschale', (page) => page.getByTestId('contract-fee-rate-input'));
export const runningContractHint = target('Hinweis auf einen laufenden Mietvertrag des Mieters', (page) =>
	page.getByTestId('tenant-running-contract')
);
export const runningContractLink = target('Laufender Mietvertrag im Hinweis', (page) =>
	runningContractHint.locate(page).getByRole('link')
);
export const newContractAfterEndLink = target('Neuen Mietvertrag erfassen', (page) =>
	page.getByTestId('contract-parties-new')
);
export const rentTakenOver = target('Hinweis auf übernommene Beträge', (page) => page.getByTestId('contract-rent-taken-over'));
// the option with its help: the help says when a notice can be withdrawn (glossary «Kündigung aufheben»)
export const withdrawNoticeOption = target('Option «Kündigung aufheben» mit Hilfe', (page) =>
	page
		.getByTestId('contract-duration')
		.locator('label')
		.filter({ has: page.getByTestId('contract-duration-unlimited') })
);
// #91: one box per umlagefähige category, ticked when the contract agrees it
export const agreedCategory = (categoryId: string) =>
	target(`Vereinbarte Nebenkosten ${categoryId}`, (page) => page.getByTestId(`contract-category-${categoryId}`));
export const agreedCategoryBoxes = target('Kästchen der vereinbarten Nebenkosten', (page) => page.getByTestId(/^contract-category-/));
export const agreedCategoryBoxAt = (index: number) =>
	target(`Kästchen ${index + 1} der vereinbarten Nebenkosten`, (page) => page.getByTestId(/^contract-category-/).nth(index));
export const noAgreedCostsNote = target('Hinweis ohne vereinbarte Nebenkosten', (page) => page.getByTestId('contract-agreed-costs-none'));
