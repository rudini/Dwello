import type { Page } from '@playwright/test';

export const nameInput = (page: Page) => page.getByTestId('building-name-input');
export const addressInput = (page: Page) => page.getByTestId('building-address-input');
export const postalCodeInput = (page: Page) => page.getByTestId('building-postal-code-input');
export const cityInput = (page: Page) => page.getByTestId('building-city-input');
export const cantonSelect = (page: Page) => page.getByTestId('building-canton-select');
export const yearBuiltInput = (page: Page) => page.getByTestId('building-year-built-input');
export const submitButton = (page: Page) => page.getByTestId('building-form-submit');
