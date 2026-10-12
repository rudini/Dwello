import type { Page } from '@playwright/test';
import { documentLanguage, languageButton } from '../interactions/language';

const codes: Record<string, string> = { Deutsch: 'de', Français: 'fr', Italiano: 'it', English: 'en' };

// Asked of whoever looks at the page, signed in or not
export const shownLanguage = ({ page }: { page: Page }) => languageButton(page);
export const pageLanguage = ({ page }: { page: Page }) => documentLanguage(page);
export const languageCode = (language: string) => codes[language];
