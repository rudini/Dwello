import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Scenarios say what the Liegenschaftsverwalter wants, not which UI element is used (tests/e2e/CLAUDE.md, #708).
// Comments and quoted texts (app texts, labels) may name them.
const features = 'tests/e2e/features';
const stepOrName =
	/^\s*(Funktionalität|Grundlage|Szenario|Szenariogrundriss|Angenommen|Wenn|Dann|Und|Aber)\b/;
const uiWord = /\b(Feld|Feldes|Felder|Feldern|klickt|klicken|Button)\b/i;

const uiWordsIn = (text: string) =>
	text
		.split('\n')
		.filter((line) => stepOrName.test(line))
		.map((line) => line.replace(/"[^"]*"|«[^»]*»/g, '""'))
		.filter((line) => uiWord.test(line))
		.map((line) => line.trim());

describe('Wortwahl der Szenarien', () => {
	it('findet ein UI-Wort in einem Schritt, nicht in Kommentaren und zitierten Texten', () => {
		const text = [
			'  # das Feld sagt warum',
			'  Szenario: Der Dialog beginnt im Feld Vertragsende',
			'    Dann meldet das Feld «Zahlungsfrist» "Lassen Sie das Feld leer."',
			'    Dann meldet Dwello bei «Feld» "Lassen Sie das Feld leer."',
			'    Wenn der Liegenschaftsverwalter auf «Weiter» klickt'
		].join('\n');
		expect(uiWordsIn(text)).toEqual([
			'Szenario: Der Dialog beginnt im Feld Vertragsende',
			'Dann meldet das Feld "" ""',
			'Wenn der Liegenschaftsverwalter auf "" klickt'
		]);
	});

	it('nennt in keinem Szenario ein UI-Element', () => {
		const found = readdirSync(features)
			.filter((file) => file.endsWith('.feature'))
			.flatMap((file) =>
				uiWordsIn(readFileSync(join(features, file), 'utf8')).map((line) => `${file}: ${line}`)
			);
		expect(found).toEqual([]);
	});
});
