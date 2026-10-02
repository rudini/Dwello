import type { Page } from '@playwright/test';

export const paymentDeadlineInput = (page: Page) => page.getByTestId('payment-deadline-input');
export const notesInput = (page: Page) => page.getByTestId('statement-notes-input');
export const saveStatementButton = (page: Page) => page.getByTestId('statement-save-button');
export const recalculateHint = (page: Page) => page.getByTestId('statement-recalculate-hint');
export const statementPaymentDeadline = (page: Page) =>
	page.getByTestId('statement-payment-deadline');
export const statementNotes = (page: Page) => page.getByTestId('statement-notes');
