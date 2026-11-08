import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale, type Locale } from '$lib/paraglide/runtime';
import { backendMessage } from '$lib/backend-error';
import { m } from '$lib/paraglide/messages';

// #1200: the wording of fachreview 1200-1, word for word in the four languages (French with U+00A0 inside « »)
const syntaxErrors: Record<Locale, Record<string, string>> = {
	de: {
		FORMULA_UNOPENED_PARENTHESIS:
			'Bei «{area}) *» schliesst die Formel eine Klammer, die nicht geöffnet wurde. Löschen Sie diese Klammer oder öffnen Sie sie weiter vorne mit «(».',
		FORMULA_UNCLOSED_PARENTHESIS:
			'Die Klammer am Anfang von «{area}) *» wird nicht geschlossen. Setzen Sie «)» dort, wo sie enden soll.',
		FORMULA_CONSECUTIVE_OPERATORS:
			'Bei «{area}) *» folgen zwei Rechenzeichen direkt aufeinander. Löschen Sie eines oder setzen Sie eine Zahl oder einen Baustein dazwischen.',
		FORMULA_MISSING_OPERAND:
			'Bei «{area}) *» fehlt eine Zahl oder ein Baustein. Ergänzen Sie den fehlenden Wert oder löschen Sie, was dort zu viel steht.',
		FORMULA_MISSING_OPERATOR:
			'Bei «{area}) *» fehlt ein Rechenzeichen zwischen zwei Werten. Setzen Sie +, -, * oder / dazwischen.'
	},
	fr: {
		FORMULA_UNOPENED_PARENTHESIS:
			'Dans « {area}) * », la formule ferme une parenthèse qui n’a pas été ouverte. Supprimez cette parenthèse ou ouvrez-la plus tôt avec « ( ».',
		FORMULA_UNCLOSED_PARENTHESIS:
			'La parenthèse au début de « {area}) * » n’est pas fermée. Placez « ) » là où elle doit se terminer.',
		FORMULA_CONSECUTIVE_OPERATORS:
			'Dans « {area}) * », deux opérateurs se suivent directement. Supprimez-en un ou placez un nombre ou un élément entre les deux.',
		FORMULA_MISSING_OPERAND:
			'Dans « {area}) * », il manque un nombre ou un élément. Complétez la valeur manquante ou supprimez ce qui est en trop.',
		FORMULA_MISSING_OPERATOR:
			'Dans « {area}) * », il manque un opérateur entre deux valeurs. Placez +, -, * ou / entre les deux.'
	},
	it: {
		FORMULA_UNOPENED_PARENTHESIS:
			'In «{area}) *» la formula chiude una parentesi che non è stata aperta. Cancelli questa parentesi o la apra prima con «(».',
		FORMULA_UNCLOSED_PARENTHESIS:
			'La parentesi all’inizio di «{area}) *» non è chiusa. Inserisca «)» dove deve terminare.',
		FORMULA_CONSECUTIVE_OPERATORS:
			'In «{area}) *» due operatori si susseguono direttamente. Ne cancelli uno o inserisca tra i due un numero o un elemento.',
		FORMULA_MISSING_OPERAND:
			'In «{area}) *» manca un numero o un elemento. Completi il valore mancante o cancelli ciò che è di troppo.',
		FORMULA_MISSING_OPERATOR:
			'In «{area}) *» manca un operatore tra due valori. Inserisca +, -, * o / tra i due.'
	},
	en: {
		FORMULA_UNOPENED_PARENTHESIS:
			'At «{area}) *» the formula closes a bracket that was not opened. Delete this bracket or open it earlier with «(».',
		FORMULA_UNCLOSED_PARENTHESIS:
			'The bracket at the start of «{area}) *» is not closed. Put «)» where it should end.',
		FORMULA_CONSECUTIVE_OPERATORS:
			'At «{area}) *» two operators follow each other directly. Delete one or put a number or building block between them.',
		FORMULA_MISSING_OPERAND:
			'At «{area}) *» a number or building block is missing. Add the missing value or delete what does not belong there.',
		FORMULA_MISSING_OPERATOR:
			'At «{area}) *» an operator between two values is missing. Put +, -, * or / between them.'
	}
};
const nameTaken: Record<Locale, string> = {
	de: 'Ein Verteilschlüssel mit dem Namen «Lift» existiert bereits. Wählen Sie einen anderen Namen.',
	fr: 'Une clé de répartition nommée « Lift » existe déjà. Choisissez un autre nom.',
	it: 'Esiste già una chiave di riparto con il nome «Lift». Scelga un altro nome.',
	en: 'A distribution key named «Lift» already exists. Choose another name.'
};
const insertTotal: Record<Locale, string> = {
	de: 'Summe des Gebäudes einfügen',
	fr: 'Insérer une somme de l’immeuble',
	it: 'Inserire una somma dell’immobile',
	en: 'Insert building total'
};

afterEach(() => overwriteGetLocale(() => baseLocale));

describe('Fehler im Aufbau der Formel und vergebener Name in allen Sprachen', () => {
	for (const locale of Object.keys(syntaxErrors) as Locale[]) {
		it(`nennt auf ${locale} die Stelle, an der die Formel bricht, und was zu tun ist`, () => {
			overwriteGetLocale(() => locale);
			for (const [code, text] of Object.entries(syntaxErrors[locale]))
				expect(backendMessage({ code, params: { part: '{area}) *' } }, 'Ersatz')).toBe(text);
		});

		it(`sagt auf ${locale} beim vergebenen Namen, dass ein anderer Name zu wählen ist`, () => {
			overwriteGetLocale(() => locale);
			expect(
				backendMessage({ code: 'DISTRIBUTION_KEY_NAME_TAKEN', params: { name: 'Lift' } }, 'Ersatz')
			).toBe(nameTaken[locale]);
		});

		it(`beschriftet auf ${locale} die Knöpfe der Summen des Gebäudes`, () => {
			overwriteGetLocale(() => locale);
			expect(m.keys_insert_total()).toBe(insertTotal[locale]);
		});
	}
});
