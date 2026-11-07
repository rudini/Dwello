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
			{ code: 'FORMULA_UNOPENED_PARENTHESIS', params: {} },
			{ code: 'FORMULA_CONSECUTIVE_OPERATORS', params: {} }
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
		expect(result.errors).toEqual(['Die Formel ergibt einen negativen Wert.']);
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
		const result = evaluateFormula('{area} 2', { area: 50, rooms: 2, volume: 150, units: 1 });

		expect(result.errorCode).toEqual({ code: 'FORMULA_NOT_COMPUTABLE', params: {} });
		expect(result.error).toContain('Unexpected number'); // for the log, never shown
	});

	// persona Helga (#128): the same sentence stood four times, once per sample apartment and once more
	it('nennt eine Formel, die sich nicht berechnen lässt, beim Prüfen nur einmal', () => {
		const result = validateFormulaForDistribution('{area} 2');

		expect(result.errorCodes).toEqual([{ code: 'FORMULA_NOT_COMPUTABLE', params: {} }]);
		expect(result.errors).toHaveLength(1);
	});
});
