import type { Page } from '@playwright/test';

export const reminderButton = (page: Page) => page.getByTestId('statement-reminder-button');
export const confirmReminderButton = (page: Page) => page.getByTestId('statement-reminder-confirm');
export const reminderFeedback = (page: Page) => page.getByTestId('reminder-feedback');
export const documentRow = (page: Page, title: string, tenantName = '') =>
	page.getByTestId('document-row').filter({ hasText: title }).filter({ hasText: tenantName });
export const documentStatus = (page: Page, title: string) =>
	documentRow(page, title).getByTestId('document-status');
export const markSentButton = (page: Page, title: string, tenantName: string) =>
	documentRow(page, title, tenantName).getByTestId('document-mark-sent');
