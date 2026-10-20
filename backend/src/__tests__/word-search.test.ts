/**
 * The apartment search drops the word for «apartment» the cards show in every language (#376, #461)
 */

import { describe, expect, it } from 'bun:test';
import { withoutApartmentWord } from '../services/word-search';

describe('Wohnungssuche ohne das Wort für Wohnung', () => {
	it('übergeht «Wohnung», «appartement», «appartamento» und «apartment» in jeder Schreibweise', () => {
		expect(withoutApartmentWord('Wohnung 2.01')).toBe('2.01');
		expect(withoutApartmentWord('appartement 2.01')).toBe('2.01');
		expect(withoutApartmentWord('Appartamento Ahornhof 2.01')).toBe('Ahornhof 2.01');
		expect(withoutApartmentWord('APARTMENT 2.01')).toBe('2.01');
	});

	it('behält Wörter, die das Wort nur enthalten', () => {
		expect(withoutApartmentWord('Wohnungen Apartments 2.01')).toBe('Wohnungen Apartments 2.01');
	});
});
