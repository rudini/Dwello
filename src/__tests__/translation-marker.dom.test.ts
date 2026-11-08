import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import TranslationMarker from '../routes/config/TranslationMarker.svelte';
import { byTestId, show } from './helpers/dom';

afterEach(() => overwriteGetLocale(() => baseLocale));

const mark = (names: object) => {
	show(TranslationMarker, { names, testid: 'marker' });
	return byTestId('marker')!.parentElement!;
};

// #689: the lists say whether an own record is translated, not the translated names; texts from 689-fachreview-1.md
describe('Hinweis zur Übersetzung eines eigenen Namens', () => {
	it('zeigt die Sprachen mit Namen als Kürzel und liest sie einem Screenreader ausgeschrieben vor', () => {
		const marker = mark({ nameFR: 'Selon le volume', nameEN: 'By volume' });
		expect(byTestId('marker')!.textContent).toBe('Übersetzt: FR, EN');
		expect(byTestId('marker')!.getAttribute('aria-hidden')).toBe('true');
		expect(marker.querySelector('.sr-only')?.textContent).toBe('Übersetzt: Französisch, Englisch');
	});

	it('sagt «Keine Übersetzung», wenn kein Name in einer anderen Sprache gespeichert ist', () => {
		const marker = mark({ nameFR: null, nameIT: '' });
		expect(marker.textContent).toBe('Keine Übersetzung');
		expect(marker.querySelector('[aria-hidden]')).toBeNull();
	});

	it.each([
		['fr', 'Nom traduit : IT', 'Aucune traduction'],
		['it', 'Nome tradotto: IT', 'Nessuna traduzione'],
		['en', 'Translated: IT', 'No translation']
	] as const)('spricht %s', (locale, translated, none) => {
		overwriteGetLocale(() => locale);
		mark({ nameIT: 'Giardinaggio' });
		expect(byTestId('marker')!.textContent).toBe(translated);
		document.body.innerHTML = '';
		expect(mark({}).textContent).toBe(none);
	});
});
