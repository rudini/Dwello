/**
 * The PDF texts live in services/pdf-texts/<language>.ts, not in messages/*.json; a text missing in a language falls
 * back to German, so no other check notices it
 */

import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';

const sourceOf = (language: string) => readFileSync(new URL(`../services/pdf-texts/${language}.ts`, import.meta.url), 'utf8');

/** The keys of one language's texts, in the order written */
function keysOf(language: string): string[] {
	return [...sourceOf(language).matchAll(/^\t(\w+):/gm)].map((m) => m[1]);
}

// the same in every language
const shared = ['sqm'];

describe('Texte des Abrechnungs-PDF', () => {
	it.each(['fr', 'it', 'en'])('hat auf %s jeden deutschen Text, statt auf Deutsch zurückzufallen', (language) => {
		const keys = keysOf(language);
		expect(keysOf('de').length).toBeGreaterThan(50);
		expect(keysOf('de').filter((key) => !keys.includes(key) && !shared.includes(key))).toEqual([]);
	});
});

// #674: the same rule as for messages/fr.json (src/__tests__/i18n.test.ts); the block writes U+00A0 as \u00a0
describe('Französische Texte des Abrechnungs-PDF', () => {
	it('setzen Guillemets mit geschütztem Leerzeichen innen', () => {
		const fr = sourceOf('fr').replaceAll('\\u00a0', '\u00a0');
		const wrong = fr.split('\n').filter((line) => /«(?!\u00a0)|(?<!\u00a0)»/.test(line));

		expect(fr).toContain('«');
		expect(wrong).toEqual([]);
	});
});
