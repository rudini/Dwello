import type { Page } from '@playwright/test';

export const languageButton = (page: Page) => page.getByTestId('language-button');
export const languageOption = (page: Page, language: string) =>
	page.getByTestId('language-option').filter({ hasText: language });
export const documentLanguage = (page: Page) => page.locator('html');

// The language cookie the switcher sets, for the app and its empty instance (axe states 'empty', 'first-use')
export const useLanguage = (page: Page, language: string) =>
	page.context().addCookies(
		['http://localhost:3100', 'http://localhost:3102'].map((url) => ({ name: 'PARAGLIDE_LOCALE', value: language, url }))
	);
