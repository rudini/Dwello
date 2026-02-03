/**
 * i18n Configuration for Dwello
 *
 * Primary language: German (de-CH)
 * Supported languages: German, English
 */

import { browser } from '$app/environment';
import { init, register, getLocaleFromNavigator, locale } from 'svelte-i18n';

// Register locale files
register('de', () => import('./locales/de.json'));
register('en', () => import('./locales/en.json'));

/**
 * Initialize i18n with default settings
 */
export function initI18n(): void {
	init({
		fallbackLocale: 'de',
		initialLocale: browser ? getLocaleFromNavigator()?.split('-')[0] ?? 'de' : 'de'
	});
}

/**
 * Set the current locale
 */
export function setLocale(newLocale: string): void {
	locale.set(newLocale);
}

/**
 * Get available locales
 */
export const availableLocales = [
	{ code: 'de', name: 'Deutsch' },
	{ code: 'en', name: 'English' }
] as const;

export { locale } from 'svelte-i18n';
