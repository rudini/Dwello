import type { Page } from '@playwright/test';

export const periodStartInput = (page: Page) => page.getByTestId('period-start-input');
export const periodEndInput = (page: Page) => page.getByTestId('period-end-input');
export const heatingProfileSelect = (page: Page) => page.getByTestId('heating-profile-select');
export const managementFeeInput = (page: Page) => page.getByTestId('management-fee-input');
export const wizardChoices = (page: Page) => page.getByRole('combobox');
export const managementFeeHint = (page: Page) => page.getByTestId('management-fee-hint');
export const buildingCheckbox = (page: Page, buildingId: string) =>
	page.getByTestId(`generate-building-${buildingId}`);
export const nextButton = (page: Page) => page.getByTestId('wizard-next');
export const generateButton = (page: Page) => page.getByTestId('generate-statements-button');
export const previewCount = (page: Page) => page.getByTestId('preview-count');
export const previewRows = (page: Page) => page.getByTestId('preview-row');
export const previewEmpty = (page: Page) => page.getByTestId('preview-empty');
export const generationResult = (page: Page) => page.getByTestId('generation-result');
export const showStatementsButton = (page: Page) => page.getByTestId('show-statements-button');
// "Abbrechen" in the wizard's first step (after its breadcrumb), or the statement page's breadcrumb to the list
export const backLink = (page: Page) =>
	page
		.getByTestId('form-cancel')
		.or(page.getByTestId('breadcrumb-link').filter({ hasText: 'Nebenkostenabrechnungen' }))
		.last();
export const generateMoreButton = (page: Page) => page.getByTestId('generate-more-button');
export const missingInvoices = (page: Page) => page.getByTestId('missing-invoices');
export const newInvoiceFromWarning = (page: Page) =>
	missingInvoices(page).getByRole('link', { name: 'Rechnung erfassen' });
export const confirmMissingInvoices = (page: Page) => page.getByTestId('confirm-missing-invoices');
export const buildingInvoices = (page: Page, buildingName: string) =>
	page.getByTestId('preview-invoices').filter({ hasText: buildingName });
export const categoryFindings = (page: Page) => page.getByTestId('category-finding');
export const draftsOnlyNote = (page: Page) => page.getByTestId('generate-drafts-note');
