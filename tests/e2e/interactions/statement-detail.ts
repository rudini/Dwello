import type { Page } from '@playwright/test';

export const statementStatus = (page: Page) => page.getByTestId('statement-status');
export const statementLineItem = (page: Page, category: string) =>
	page.getByTestId('statement-line-item').filter({ hasText: category });
export const sendStatementButton = (page: Page) => page.getByTestId('statement-send-button');
export const markPaidButton = (page: Page) => page.getByTestId('statement-mark-paid-button');
export const confirmMarkPaidButton = (page: Page) => page.getByTestId('statement-mark-paid-confirm');
export const deleteStatementButton = (page: Page) => page.getByTestId('statement-delete-button');
export const confirmDeleteStatementButton = (page: Page) => page.getByTestId('statement-delete-confirm');
export const statementEditButton = (page: Page) => page.getByTestId('statement-edit-button');
export const statementTenantLink = (page: Page) => page.getByTestId('statement-tenant-link');
export const statementApartmentLink = (page: Page) => page.getByTestId('statement-apartment-link');
