import { target } from '../screenplay/target';

export const tenantSelect = target('Mieterauswahl', (page) => page.getByTestId('contract-tenant-select'));
export const apartmentSelect = target('Wohnungsauswahl', (page) => page.getByTestId('apartment-select'));
export const apartmentOption = (apartmentId: string) =>
	target(`Wohnung ${apartmentId} in der Auswahl`, (page) =>
		apartmentSelect.locate(page).locator(`option[value="${apartmentId}"]`)
	);
export const apartmentContractsUnknown = target('Hinweis bei der Wohnung', (page) =>
	page.getByTestId('apartment-contracts-unknown')
);
export const retryContractsButton = target('Mietverträge erneut laden', (page) =>
	page.getByTestId('apartment-contracts-retry')
);
export const startContractsUnknown = target('Hinweis beim Vertragsbeginn', (page) =>
	page.getByTestId('start-contracts-unknown')
);
export const reviewContractsUnknown = target('Hinweis in der Prüfung', (page) =>
	page.getByTestId('review-contracts-unknown')
);
export const startDateInput = target('Vertragsbeginn', (page) => page.getByTestId('start-date-input'));
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
export const contractSubmitButton = target('Mietvertrag speichern', (page) => page.getByTestId('submit-button'));
export const newTenantLink = target('Neuen Mieter erfassen', (page) => page.getByTestId('contract-new-tenant'));
export const reviewItem = (label: string) =>
	target(`Prüfung «${label}»`, (page) => page.getByTestId('contract-review-item').filter({ hasText: label }));
export const deleteDraftAndSaveButton = target('Entwurf löschen und speichern', (page) =>
	page.getByTestId('delete-draft-and-save')
);
