import type { Page } from '@playwright/test';

export const categoryRow = (page: Page, name: string) =>
	page.getByTestId('category-row').filter({ hasText: name });
export const allowedFilter = (page: Page) => page.getByTestId('category-filter-allowed');
export const nameInput = (page: Page) => page.getByTestId('category-name-input');
export const allowedCheckbox = (page: Page) => page.getByTestId('category-allowed-checkbox');
export const submitButton = (page: Page) => page.getByTestId('category-submit');
export const editButton = (page: Page, name: string) =>
	categoryRow(page, name).getByTestId('category-edit-button');
export const deleteButton = (page: Page, name: string) =>
	categoryRow(page, name).getByTestId('category-delete-button');
export const allowedBadge = (page: Page, name: string) =>
	categoryRow(page, name).getByTestId('category-allowed');
export const usage = (page: Page, name: string) =>
	categoryRow(page, name).getByTestId('category-usage');
