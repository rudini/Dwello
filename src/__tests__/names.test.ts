import { describe, it, expect } from 'vitest';
import { germanName } from '../lib/names';

describe('Namen der Stammdaten', () => {
	// Categories, distribution keys and heating profiles are stored in English with a German name beside it
	it('zeigt den deutschen Namen und sonst den gespeicherten', () => {
		expect(germanName({ name: 'Caretaker', nameDE: 'Hauswart' })).toBe('Hauswart');
		expect(germanName({ name: 'Gartenpflege', nameDE: null })).toBe('Gartenpflege');
		expect(germanName({ name: 'Eigener Schlüssel' })).toBe('Eigener Schlüssel');
	});
});
