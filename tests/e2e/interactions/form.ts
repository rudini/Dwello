import type { Page } from '@playwright/test';

export const cancelButton = (page: Page) => page.getByTestId('form-cancel');
export const formError = (page: Page, text: string) => page.getByTestId('form-error').filter({ hasText: text });
