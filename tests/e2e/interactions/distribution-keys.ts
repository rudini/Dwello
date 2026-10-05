import type { Page } from '@playwright/test';

export const keyRow = (page: Page, name: string) =>
	page
		.getByTestId('distribution-key-row')
		.filter({ has: page.getByTestId('distribution-key-name').getByText(name, { exact: true }) });
export const nameInput = (page: Page) => page.getByTestId('distribution-key-name-input');
export const formulaInput = (page: Page) => page.getByTestId('distribution-key-formula-input');
export const testButton = (page: Page) => page.getByTestId('distribution-key-test-button');
export const submitButton = (page: Page) => page.getByTestId('distribution-key-submit');
export const sampleRow = (page: Page, apartment: string) =>
	page.getByTestId('formula-test-row').filter({ hasText: apartment });
export const editButton = (page: Page, name: string) =>
	keyRow(page, name).getByTestId('distribution-key-edit-button');
export const deleteButton = (page: Page, name: string) =>
	keyRow(page, name).getByTestId('distribution-key-delete-button');
export const formula = (page: Page, name: string) =>
	keyRow(page, name).getByTestId('distribution-key-formula');
export const usage = (page: Page, name: string) =>
	keyRow(page, name).getByTestId('distribution-key-usage');
