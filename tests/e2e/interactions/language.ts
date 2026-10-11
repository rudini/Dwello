import type { Page } from '@playwright/test';

export const languageButton = (page: Page) => page.getByTestId('language-button');
export const languageOption = (page: Page, language: string) =>
	page.getByTestId('language-option').filter({ hasText: language });
export const documentLanguage = (page: Page) => page.locator('html');
