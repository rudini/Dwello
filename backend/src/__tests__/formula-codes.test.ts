/**
 * Every formula error carries a stable code with its values, so the UI can show it in the chosen language
 */

import { describe, expect, it } from 'bun:test';
import { parseFormula, validateFormulaForDistribution } from '../services/formula.service';

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

		expect(result.errors).toContain('Die Formel ergibt für die Kleine Wohnung (50 m², 2 Zimmer) einen negativen Wert.');
		expect(result.errorCodes).toContainEqual({
			code: 'FORMULA_SAMPLE_NEGATIVE',
			params: { sample: 'FORMULA_SAMPLE_SMALL' }
		});
		expect(result.errorCodes).toHaveLength(result.errors.length);
	});
});
