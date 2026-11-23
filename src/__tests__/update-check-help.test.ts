import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

// #1456 (decided 23.11.2026): the help at «Täglich nach neuen Versionen suchen» ends by saying that the checkbox saves at once
const sentences = {
	de: 'Dwello speichert, sobald Sie das Kästchen ankreuzen oder das Kreuz entfernen.'
};

describe('Hilfetext der Suche nach neuen Versionen', () => {
	it.each(Object.entries(sentences))(
		'endet in %s mit dem Satz, dass das Kästchen sofort speichert',
		(locale, sentence) => {
			const messages = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'));
			expect(messages.settings_updates_check_help.endsWith(` ${sentence}`)).toBe(true);
		}
	);
});
