import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import PrivacyPage from '../routes/privacy/+page.svelte';
import { show } from './helpers/dom';

afterEach(() => overwriteGetLocale(() => baseLocale));

const page = (locale: 'fr' | 'it') => {
	overwriteGetLocale(() => locale);
	show(PrivacyPage, { data: { recipient: null, providers: ['Google', 'Microsoft'] } } as never);
	return document.body.textContent ?? '';
};

describe('Datenschutzerklärung auf Französisch und Italienisch', () => {
	it('setzt französische Guillemets mit geschütztem Leerzeichen und spricht niemanden mit Geschlecht an', () => {
		const text = page('fr');
		expect(text).toContain('Google ou Microsoft');
		expect(text).toContain('« dwello_session »');
		expect(text).not.toContain('vous garde connecté');
	});

	it('verwendet die festgelegten italienischen Begriffe für Gebäude und Karte', () => {
		const text = page('it');
		expect(text).toContain('Google o Microsoft');
		expect(text).toContain('immobile');
		expect(text).not.toMatch(/stabile|\bcarta\b/);
		expect(text).not.toContain('La mantiene connessa');
	});
});
