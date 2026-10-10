import type { Page } from '@playwright/test';

export const buildingSelect = (page: Page) => page.getByTestId('invoice-building-select');
export const amountInput = (page: Page) => page.getByTestId('invoice-amount-input');
export const invoiceDateInput = (page: Page) => page.getByTestId('invoice-date-input');
export const periodWarning = (page: Page) => page.getByTestId('invoice-period-warning');
export const supplierInput = (page: Page) => page.getByTestId('invoice-billing-entity-input');
export const descriptionInput = (page: Page) => page.getByTestId('invoice-description-input');
export const categorySelect = (page: Page) => page.getByTestId('invoice-category-select');
export const utilityCostCheckbox = (page: Page) => page.getByTestId('invoice-utility-cost-checkbox');
export const categoryWarning = (page: Page) => page.getByTestId('invoice-category-warning');
export const overrideReasonInput = (page: Page) => page.getByTestId('invoice-override-reason-input');
export const invoiceSubmitButton = (page: Page) => page.getByTestId('submit-button');
