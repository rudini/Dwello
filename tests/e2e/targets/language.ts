import { target } from '../screenplay/target';

export const languageButton = target('Sprachwahl', (page) => page.getByTestId('language-button'));
export const languageOption = (language: string) =>
	target(`Sprache «${language}»`, (page) => page.getByTestId('language-option').filter({ hasText: language }));
export const documentRoot = target('Dokument', (page) => page.locator('html'));
