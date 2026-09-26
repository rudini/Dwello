import type { Page } from '@playwright/test';

export const tenantSelect = (page: Page) => page.getByTestId('contract-tenant-select');
export const apartmentSelect = (page: Page) => page.getByTestId('apartment-select');
export const apartmentOption = (page: Page, apartmentId: string) =>
	apartmentSelect(page).locator(`option[value="${apartmentId}"]`);
export const startDateInput = (page: Page) => page.getByTestId('start-date-input');
export const baseRentInput = (page: Page) => page.getByTestId('contract-base-rent-input');
export const contractSubmitButton = (page: Page) => page.getByTestId('submit-button');
