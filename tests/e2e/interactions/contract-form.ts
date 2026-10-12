import type { Page } from '@playwright/test';

export const tenantSelect = (page: Page) => page.getByTestId('contract-tenant-select');
export const apartmentSelect = (page: Page) => page.getByTestId('apartment-select');
export const apartmentOption = (page: Page, apartmentId: string) =>
	apartmentSelect(page).locator(`option[value="${apartmentId}"]`);
export const startDateInput = (page: Page) => page.getByTestId('start-date-input');
export const limitedDuration = (page: Page) => page.getByTestId('contract-duration').getByText('Befristet', { exact: true });
export const endDateInput = (page: Page) => page.getByTestId('end-date-input');
export const pastEndConfirm = (page: Page) => page.getByTestId('contract-end-past-confirm');
export const baseRentInput = (page: Page) => page.getByTestId('contract-base-rent-input');
export const advancePaymentInput = (page: Page) => page.getByTestId('contract-advance-payment-input');
export const contractSubmitButton = (page: Page) => page.getByTestId('submit-button');
export const newTenantLink = (page: Page) => page.getByTestId('contract-new-tenant');
export const reviewItem = (page: Page, label: string) =>
	page.getByTestId('contract-review-item').filter({ hasText: label });

// Wizard frame, shared with the statement wizard
export const nextButton = (page: Page) => page.getByTestId('wizard-next');
export const finishedStep = (page: Page, label: string) => page.getByTestId('wizard-step').filter({ hasText: label });
export const draftRestored = (page: Page) => page.getByTestId('draft-restored');
export const discardDraftButton = (page: Page) => page.getByTestId('draft-discard');
export const saveStatus = (page: Page) => page.getByTestId('save-status');
export const successToast = (page: Page) => page.getByTestId('toast-success');
