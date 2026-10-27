/**
 * The PDF texts live in `translations` of pdf.service.ts, not in messages/*.json; a text missing in a language falls
 * back to German, so no other check notices it
 */

import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../services/pdf.service.ts', import.meta.url), 'utf8');
const start = source.indexOf('const translations');
const block = source.slice(start, source.indexOf('\n};', start));

/** The keys of one language's block, in the order written */
function keysOf(language: string): string[] {
	const body = block.split(new RegExp(`\\n\\t${language}: \\{`))[1]?.split(/\n\t\}/)[0] ?? '';
	return [...body.matchAll(/^\t\t(\w+):/gm)].map((m) => m[1]);
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
		const fr = block.split(/\n\tfr: \{/)[1].split(/\n\t\}/)[0].replaceAll('\\u00a0', '\u00a0');
		const wrong = fr.split('\n').filter((line) => /«(?!\u00a0)|(?<!\u00a0)»/.test(line));

		expect(fr).toContain('«');
		expect(wrong).toEqual([]);
	});
});
