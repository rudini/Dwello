import { describe, it, expect } from 'vitest';
import { germanName, translatedLanguages } from '../lib/names';

describe('Namen der Stammdaten', () => {
	// Categories, distribution keys and heating profiles are stored in English with a German name beside it
	it('zeigt den deutschen Namen und sonst den gespeicherten', () => {
		expect(germanName({ name: 'Caretaker', nameDE: 'Hauswart' })).toBe('Hauswart');
		expect(germanName({ name: 'Gartenpflege', nameDE: null })).toBe('Gartenpflege');
		expect(germanName({ name: 'Eigener Schlüssel' })).toBe('Eigener Schlüssel');
	});

	// #689: the lists say in which languages an own record is translated, always in the order FR, IT, EN
	it('nennt die Sprachen mit gespeichertem Namen in der Reihenfolge FR, IT, EN', () => {
		const key = { name: 'Nach Volumen', nameEN: 'By volume', nameFR: 'Selon le volume' };
		expect(translatedLanguages(key)).toEqual(['FR', 'EN']);
	});

	it('nennt keine Sprache, wenn kein Name oder nur ein leerer gespeichert ist', () => {
		expect(translatedLanguages({ name: 'Gartenpflege', nameFR: '', nameIT: null })).toEqual([]);
	});
});
