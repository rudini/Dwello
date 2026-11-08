/**
 * Every formula error carries a stable code with its values, so the UI can show it in the chosen language
 */

import { describe, expect, it } from 'bun:test';
import { evaluateFormula, parseFormula, validateFormulaForDistribution } from '../services/formula.service';

describe('Fehlercodes der Formel', () => {
	it('nennt zu jedem Fehler beim Lesen der Formel den Code', () => {
		const result = parseFormula('{persons} + ) ** $');

		expect(result.errorCodes).toEqual([
			{ code: 'FORMULA_UNKNOWN_VARIABLE', params: { variable: 'persons' } },
			{ code: 'FORMULA_INVALID_CHARACTERS', params: { characters: '$' } },
			{ code: 'FORMULA_UNOPENED_PARENTHESIS', params: { part: '+ ) *' } },
			{ code: 'FORMULA_CONSECUTIVE_OPERATORS', params: { part: ') **' } },
			{ code: 'FORMULA_MISSING_OPERAND', params: { part: '**' } }
		]);
		expect(result.errorCodes).toHaveLength(result.errors.length);
	});

	it('nennt eine leere Formel', () => {
		expect(parseFormula(' ').errorCodes).toEqual([{ code: 'FORMULA_REQUIRED', params: {} }]);
	});

	// #737 (persona Helga): an error that depends on the values stood once per sample apartment and once more
	it('nennt eine Formel, die für eine Wohnung keine Zahl ergibt, beim Prüfen nur einmal', () => {
		const result = validateFormulaForDistribution('{area} / ({units} - 1)');

		expect(result.errorCodes).toEqual([
			{ code: 'FORMULA_APARTMENT_FAILED', params: { reason: 'FORMULA_NOT_A_NUMBER' } }
		]);
		expect(result.errors).toHaveLength(1);
	});

	it('nennt einen negativen Anteil nur einmal', () => {
		const result = validateFormulaForDistribution('{area} - 100');

		expect(result.errorCodes).toEqual([{ code: 'FORMULA_NEGATIVE', params: {} }]);
		expect(result.errors).toEqual([
			'Für eine Wohnung ergibt die Formel einen negativen Wert, meist weil sie dort zu viel abzieht. Prüfen Sie, was nach «-» steht.'
		]);
	});

	// #737 (Fachprüfung 737-2 V-3): zero for every apartment says what to check
	it('nennt eine Formel, die für alle Wohnungen null ergibt, mit dem, was zu prüfen ist', () => {
		const result = validateFormulaForDistribution('{units} - 1');

		expect(result.errorCodes).toEqual([{ code: 'FORMULA_ALL_ZERO', params: {} }]);
		expect(result.errors).toEqual([
			'Die Formel ergibt für alle Wohnungen null, so lassen sich keine Anteile berechnen. Prüfen Sie, ob sie mit 0 malnimmt oder {units} - 1 enthält ({units} ist für jede Wohnung 1).'
		]);
	});

	// #737: saving checked three sample apartments (one with 80 m²), «Formel testen» shows four
	it('prüft beim Speichern mit den vier Beispielwohnungen von «Formel testen»', () => {
		const formula = '1 / (({area} - 80) * ({area} - 80))';

		expect(validateFormulaForDistribution(formula).errorCodes).toEqual([]);
		expect(validateFormulaForDistribution('{area} / (({rooms} - 3) * ({rooms} - 3))').errorCodes).toEqual([
			{ code: 'FORMULA_APARTMENT_FAILED', params: { reason: 'FORMULA_NOT_A_NUMBER' } }
		]);
	});

	// #128: the JavaScript engine's English message went into the params and on to the UI
	it('nennt eine Formel, die sich nicht berechnen lässt, ohne den englischen Text der Rechenmaschine', () => {
		const result = evaluateFormula('{area} .', { area: 50, rooms: 2, volume: 150, units: 1 });

		expect(result.errorCode).toEqual({ code: 'FORMULA_NOT_COMPUTABLE', params: {} });
		expect(result.error).toContain('Unexpected'); // for the log, never shown
	});

	// persona Helga (#128): the same sentence stood four times, once per sample apartment and once more
	it('nennt eine Formel, die sich nicht berechnen lässt, beim Prüfen nur einmal', () => {
		const result = validateFormulaForDistribution('{area} .');

		expect(result.errorCodes).toEqual([{ code: 'FORMULA_NOT_COMPUTABLE', params: {} }]);
		expect(result.errors).toHaveLength(1);
	});

	// #1200 (persona Helga, #128): a syntax error names the part of the formula where it breaks
	describe('nennt die Stelle, an der die Formel bricht', () => {
		const errorOf = (formula: string) => parseFormula(formula).errorCodes;

		it('bei einer offenen Klammer die Klammer und was ihr folgt', () => {
			expect(errorOf('0.7 * ({area} / {area_total} + 0.3')).toEqual([
				{ code: 'FORMULA_UNCLOSED_PARENTHESIS', params: { part: '({area} / {area_total} + 0.3' } }
			]);
		});

		it('bei zwei Rechenzeichen hintereinander beide mit dem, was vor und nach ihnen steht', () => {
			expect(errorOf('{area} * / {rooms}')).toEqual([
				{ code: 'FORMULA_CONSECUTIVE_OPERATORS', params: { part: '{area} * / {rooms}' } }
			]);
		});

		it('bei einer Klammer, die nicht geöffnet wurde, die Klammer mit ihren Nachbarn', () => {
			expect(errorOf('{area}) * 2')).toEqual([
				{ code: 'FORMULA_UNOPENED_PARENTHESIS', params: { part: '{area}) *' } }
			]);
		});

		it('bei einem Rechenzeichen am Ende das Rechenzeichen mit dem, was davor steht', () => {
			expect(errorOf('{area} *')).toEqual([{ code: 'FORMULA_MISSING_OPERAND', params: { part: '{area} *' } }]);
		});

		it('bei leeren Klammern die Klammern', () => {
			expect(errorOf('{area} * ()')).toEqual([{ code: 'FORMULA_MISSING_OPERAND', params: { part: '* ()' } }]);
		});

		// decided in #1200: its own refusal with the two values between which the Rechenzeichen is missing
		it('bei einem fehlenden Rechenzeichen die beiden Werte, zwischen denen es fehlt', () => {
			expect(errorOf('{area} 2')).toEqual([{ code: 'FORMULA_MISSING_OPERATOR', params: { part: '{area} 2' } }]);
			expect(errorOf('2 ({area} + 1)')).toEqual([
				{ code: 'FORMULA_MISSING_OPERATOR', params: { part: '2 ({area}' } }
			]);
		});

		// fachreview 1200-1 V-1: what reads today keeps reading, also in keys already saved
		it('lässt Vorzeichen am Anfang und nach einer Klammer und ein nachgestelltes % zu', () => {
			for (const formula of ['-{area} + (-{rooms} + 10)', '+{area}', '{area} * 50%', '50% * {area}', '0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}'])
				expect(errorOf(formula)).toEqual([]);
		});

		// code review formula-form-1 C-1: each rule of where a value is missing
		it('bei * oder / am Anfang, % ohne Wert davor und leerer Klammer nach einem Rechenzeichen', () => {
			expect(errorOf('* {area}')).toEqual([{ code: 'FORMULA_MISSING_OPERAND', params: { part: '* {area}' } }]);
			expect(errorOf('%{area}')).toEqual([{ code: 'FORMULA_MISSING_OPERAND', params: { part: '%{area}' } }]);
			expect(errorOf('{area} * % 2')).toEqual([{ code: 'FORMULA_MISSING_OPERAND', params: { part: '* % 2' } }]);
			expect(errorOf('({area} +)')).toEqual([{ code: 'FORMULA_MISSING_OPERAND', params: { part: '{area} +)' } }]);
		});

		// code review formula-form-1: after a bracket the engine reads % as remainder, as before #1200
		it('lässt % nach einer Klammer als Rest einer Division zu', () => {
			expect(errorOf('({area} + 1) % 2')).toEqual([]);
		});

		// fallback review of #1308: a remainder may take a signed number, as on main; a postfix % ends a value like «)»
		it('lässt nach dem Rest einer Division ein Vorzeichen zu und liest % nach einem Prozent als Rest', () => {
			for (const formula of ['({area} + 1) % -2', '({area} + 1) % +2', '{area}% % 2']) expect(errorOf(formula)).toEqual([]);
		});

		it('nennt bei zwei % am Ende die fehlende Zahl', () => {
			expect(errorOf('{area}%%')).toEqual([{ code: 'FORMULA_MISSING_OPERAND', params: { part: '%%' } }]);
		});

		it('nennt bei mehreren offenen Klammern die letzte und schneidet die Stelle aus dem eingegebenen Text', () => {
			expect(errorOf('({AREA}  + ({rooms} * 2')).toEqual([
				{ code: 'FORMULA_UNCLOSED_PARENTHESIS', params: { part: '({rooms} * 2' } }
			]);
		});
	});
});
