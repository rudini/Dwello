import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import PrivacyPage from '../routes/privacy/+page.svelte';
import { show } from './helpers/dom';

afterEach(() => overwriteGetLocale(() => baseLocale));

const page = (locale: 'fr' | 'it' | 'en') => {
	overwriteGetLocale(() => locale);
	show(PrivacyPage, { data: { recipient: null, providers: ['Google', 'Microsoft'] } } as never);
	return document.body.textContent ?? '';
};

describe('Datenschutzerklärung auf Französisch, Italienisch und Englisch', () => {
	it('setzt französische Guillemets mit geschütztem Leerzeichen und spricht niemanden mit Geschlecht an', () => {
		const text = page('fr');
		expect(text).toContain('Google ou Microsoft');
		expect(text).toContain('« dwello_session »');
		expect(text).not.toContain('vous garde connecté');
	});

	it('setzt auch im Abschnitt der öffentlichen Demo geschützte Leerzeichen in die Guillemets', () => {
		overwriteGetLocale(() => 'fr');
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'], demo: true } } as never);
		expect(document.body.textContent).toContain('(voir «\u00a0Connexion\u00a0»)');
	});

	// The building map is gone (#129), so CARTO receives nothing
	it('nennt CARTO in keiner Sprache', () => {
		for (const locale of ['fr', 'it', 'en'] as const) expect(page(locale)).not.toContain('CARTO');
	});

	it('verwendet die festgelegten italienischen Begriffe für Gebäude', () => {
		const text = page('it');
		expect(text).toContain('Google o Microsoft');
		expect(text).toContain('immobile');
		expect(text).not.toMatch(/stabile|\bcarta\b/);
		expect(text).not.toContain('La mantiene connessa');
		expect(text).toContain('quando Lei sceglie il link');
		expect(text).toContain('durante la registrazione di un immobile');
	});

	// «proposer si» ist kein Französisch, «proponga se» kein gutes Italienisch (#176, E-22, F-21)
	it('sagt idiomatisch, dass die KI angibt, ob die Kosten umlagefähig sind', () => {
		for (const [locale, text] of [
			['fr', 'pour que l’IA indique si ses frais sont répercutables'],
			['it', 'affinché l’IA indichi se i relativi costi sono addebitabili']
		] as const) {
			overwriteGetLocale(() => locale);
			show(PrivacyPage, {
				data: { recipient: { provider: 'Beispiel AG', country: 'Schweiz' }, providers: ['Google'] }
			} as never);
			expect(document.body.textContent).toContain(text);
		}
	});
});
