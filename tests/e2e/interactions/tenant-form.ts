import type { Page } from '@playwright/test';

export const channelSelect = (page: Page) => page.getByTestId('tenant-channel-select');
export const emailInput = (page: Page) => page.getByTestId('tenant-email-input');
export const addressInput = (page: Page) => page.getByTestId('tenant-address-input');
export const postalCodeInput = (page: Page) => page.getByTestId('tenant-postal-code-input');
export const cityInput = (page: Page) => page.getByTestId('tenant-city-input');
export const submitTenantButton = (page: Page) => page.getByTestId('tenant-submit');
export const tenantChannel = (page: Page) => page.getByTestId('tenant-channel');
export const firstNameInput = (page: Page) => page.getByTestId('tenant-first-name-input');
export const lastNameInput = (page: Page) => page.getByTestId('tenant-last-name-input');
