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
export const generatePdfButton = (page: Page) => page.getByTestId('statement-generate-pdf-button');
export const downloadPdfLink = (page: Page) => page.getByTestId('statement-pdf-download');
export const sendDialog = (page: Page) => page.getByRole('dialog');
export const confirmSendButton = (page: Page) => page.getByTestId('statement-send-confirm');
export const sendRecipient = (page: Page) => page.getByTestId('send-recipient');
export const sendPdfLink = (page: Page) => page.getByTestId('send-pdf-view');
export const paidDateInput = (page: Page) => page.getByTestId('paid-date-input');
export const statementHistory = (page: Page) => page.getByRole('heading', { name: 'Verlauf' }).locator('xpath=ancestor::*[.//dl][1]');
