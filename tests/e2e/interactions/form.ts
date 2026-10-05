import type { Page } from '@playwright/test';

export const cancelButton = (page: Page) => page.getByTestId('form-cancel');
export const formError = (page: Page, text: string) =>
	page.getByTestId('form-error').filter({ hasText: text });
// Confirm button of any delete dialog (contract-delete-confirm, tenant-delete-confirm, ...)
export const deleteConfirmButton = (page: Page) => page.getByTestId(/-delete-confirm$/);
