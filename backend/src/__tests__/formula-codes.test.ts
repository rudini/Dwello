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

	it('nennt die Beispielwohnung, für die die Formel nicht rechnet', () => {
		const result = validateFormulaForDistribution('{area} / ({rooms} - 2)');

		expect(result.errors[0]).toBe('Kleine Wohnung (50 m², 2 Zimmer): Die Formel ergibt keine gültige Zahl.');
		expect(result.errorCodes[0]).toEqual({
			code: 'FORMULA_SAMPLE_FAILED',
			params: { sample: 'FORMULA_SAMPLE_SMALL', reason: 'FORMULA_NOT_A_NUMBER' }
		});
		expect(result.errorCodes).toHaveLength(result.errors.length);
	});

	it('nennt einen negativen Anteil', () => {
		const result = validateFormulaForDistribution('{area} - 100');

		expect(result.errors).toContain('Die Formel ergibt für das Beispiel «Kleine Wohnung (50 m², 2 Zimmer)» einen negativen Wert.');
		expect(result.errorCodes).toContainEqual({
			code: 'FORMULA_SAMPLE_NEGATIVE',
			params: { sample: 'FORMULA_SAMPLE_SMALL' }
		});
		expect(result.errorCodes).toHaveLength(result.errors.length);
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
