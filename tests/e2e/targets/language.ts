import { target } from '../screenplay/target';

// below 768 px the language choice stands in the menu (#657): the one shown, and the header's, which names the language
export const languageButton = target('Sprachwahl', (page) => page.getByTestId('language-button').filter({ visible: true }));
export const headerLanguageButton = target('Sprachwahl der Kopfzeile', (page) => page.getByTestId('language-button').first());
export const languageOption = (language: string) =>
	target(`Sprache «${language}»`, (page) => page.getByTestId('language-option').filter({ hasText: language }));
export const documentRoot = target('Dokument', (page) => page.locator('html'));
