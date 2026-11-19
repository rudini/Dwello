import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

// #1456 (decided 19.11.2026): the help at «Täglich nach neuen Versionen suchen» ends by saying that the switch saves at once
const sentences = {
	de: 'Der Schalter speichert, sobald Sie ihn umlegen.',
	fr: 'Le réglage est enregistré dès que vous actionnez l’interrupteur.',
	it: 'L’impostazione viene salvata non appena Lei aziona l’interruttore.',
	en: 'The switch saves as soon as you flip it.'
};

describe('Hilfetext der Suche nach neuen Versionen', () => {
	it.each(Object.entries(sentences))(
		'endet in %s mit dem Satz, dass der Schalter sofort speichert',
		(locale, sentence) => {
			const messages = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'));
			expect(messages.settings_updates_check_help.endsWith(` ${sentence}`)).toBe(true);
		}
	);
});
