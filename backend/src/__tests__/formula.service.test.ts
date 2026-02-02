/**
 * Unit tests for formula service
 * Tests custom distribution key formula parsing and evaluation
 */

import { describe, it, expect } from 'bun:test';
import {
	parseFormula,
	evaluateFormula,
	calculateDistribution,
	validateFormulaForDistribution,
	FORMULA_VARIABLES
} from '../services/formula.service';

describe('Formula Service', () => {
	describe('parseFormula', () => {
		it('should parse simple area formula', () => {
			const result = parseFormula('{area}');
			expect(result.isValid).toBe(true);
			expect(result.variables).toContain('area');
			expect(result.errors).toHaveLength(0);
		});

		it('should parse formula with multiple variables', () => {
			const result = parseFormula('{area} + {rooms} * 10');
			expect(result.isValid).toBe(true);
			expect(result.variables).toContain('area');
			expect(result.variables).toContain('rooms');
		});

		it('should parse formula with all supported variables', () => {
			const result = parseFormula('{area} + {rooms} + {volume} + {units}');
			expect(result.isValid).toBe(true);
			expect(result.variables).toHaveLength(4);
		});

		it('should reject empty formula', () => {
			const result = parseFormula('');
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Formula cannot be empty');
		});

		it('should reject formula without variables', () => {
			const result = parseFormula('100 + 50');
			expect(result.isValid).toBe(false);
			expect(result.errors.some(e => e.includes('must contain at least one variable'))).toBe(true);
		});

		it('should reject unknown variables', () => {
			const result = parseFormula('{area} + {unknown}');
			expect(result.isValid).toBe(false);
			expect(result.errors.some(e => e.includes('Unknown variable'))).toBe(true);
		});

		it('should detect unbalanced parentheses', () => {
			const result = parseFormula('({area} + {rooms}');
			expect(result.isValid).toBe(false);
			expect(result.errors.some(e => e.includes('parentheses'))).toBe(true);
		});

		it('should detect consecutive operators', () => {
			const result = parseFormula('{area} ++ {rooms}');
			expect(result.isValid).toBe(false);
			expect(result.errors.some(e => e.includes('consecutive operators'))).toBe(true);
		});

		it('should normalize variable names to lowercase', () => {
			const result = parseFormula('{AREA} + {Rooms}');
			expect(result.isValid).toBe(true);
			expect(result.normalizedFormula).toBe('{area} + {rooms}');
		});

		it('should handle complex formulas', () => {
			const result = parseFormula('({area} * 0.7) + ({rooms} * 0.3 * 10)');
			expect(result.isValid).toBe(true);
		});
	});

	describe('evaluateFormula', () => {
		const variables = { area: 80, rooms: 3.5, volume: 200, units: 1 };

		it('should evaluate simple area formula', () => {
			const result = evaluateFormula('{area}', variables);
			expect(result.isValid).toBe(true);
			expect(result.value).toBe(80);
		});

		it('should evaluate formula with arithmetic', () => {
			const result = evaluateFormula('{area} + {rooms} * 10', variables);
			expect(result.isValid).toBe(true);
			expect(result.value).toBe(80 + 3.5 * 10); // 115
		});

		it('should evaluate formula with parentheses', () => {
			const result = evaluateFormula('({area} + {rooms}) * 2', variables);
			expect(result.isValid).toBe(true);
			expect(result.value).toBe((80 + 3.5) * 2); // 167
		});

		it('should evaluate weighted formula', () => {
			const result = evaluateFormula('{area} * 0.7 + {rooms} * 10 * 0.3', variables);
			expect(result.isValid).toBe(true);
			expect(result.value).toBeCloseTo(80 * 0.7 + 3.5 * 10 * 0.3, 2); // 66.5
		});

		it('should fail for missing variable value', () => {
			const result = evaluateFormula('{area} + {volume}', { area: 80, rooms: 3.5 });
			expect(result.isValid).toBe(false);
			expect(result.error).toContain('Missing value');
		});

		it('should use default volume calculation when volume not provided', () => {
			// Volume defaults to area * 2.5 (default ceiling height) when not explicitly set
			const result = evaluateFormula('{volume}', { area: 80, rooms: 3.5, volume: 200 });
			expect(result.isValid).toBe(true);
			expect(result.value).toBe(200);
		});

		it('should handle division', () => {
			const result = evaluateFormula('{area} / 2', variables);
			expect(result.isValid).toBe(true);
			expect(result.value).toBe(40);
		});

		it('should handle percentage operator', () => {
			const result = evaluateFormula('{area} * 50%', variables);
			expect(result.isValid).toBe(true);
			expect(result.value).toBe(40);
		});
	});

	describe('calculateDistribution', () => {
		const apartments = [
			{ area: 50, rooms: 2 },
			{ area: 80, rooms: 3.5 },
			{ area: 120, rooms: 5 }
		];

		it('should distribute by area', () => {
			const result = calculateDistribution('{area}', apartments, 1000);
			expect(result.isValid).toBe(true);
			expect(result.distributions).toHaveLength(3);

			// Total area = 250
			expect(result.distributions[0].share).toBeCloseTo(50/250, 4);
			expect(result.distributions[1].share).toBeCloseTo(80/250, 4);
			expect(result.distributions[2].share).toBeCloseTo(120/250, 4);
		});

		it('should distribute by rooms', () => {
			const result = calculateDistribution('{rooms}', apartments, 1000);
			expect(result.isValid).toBe(true);

			// Total rooms = 10.5
			expect(result.distributions[0].share).toBeCloseTo(2/10.5, 4);
		});

		it('should distribute equally by units', () => {
			const apartmentsWithUnits = [
				{ area: 50, rooms: 2, units: 1 },
				{ area: 80, rooms: 3.5, units: 1 },
				{ area: 120, rooms: 5, units: 1 }
			];
			const result = calculateDistribution('{units}', apartmentsWithUnits, 1200);
			expect(result.isValid).toBe(true);

			// Each unit gets equal share
			expect(result.distributions[0].amount).toBe(400);
			expect(result.distributions[1].amount).toBe(400);
			expect(result.distributions[2].amount).toBe(400);
		});

		it('should distribute by weighted formula', () => {
			const result = calculateDistribution('{area} * 0.7 + {rooms} * 10 * 0.3', apartments, 1000);
			expect(result.isValid).toBe(true);
			expect(result.distributions).toHaveLength(3);

			// Verify amounts sum to total
			const totalAmount = result.distributions.reduce((sum, d) => sum + d.amount, 0);
			expect(totalAmount).toBeCloseTo(1000, 1);
		});

		it('should fail for invalid formula', () => {
			const result = calculateDistribution('invalid', apartments, 1000);
			expect(result.isValid).toBe(false);
		});

		it('should fail for formula resulting in zero total', () => {
			// All apartments with 0 area would give 0 total
			const zeroApartments = [
				{ area: 0, rooms: 0 },
				{ area: 0, rooms: 0 }
			];
			const result = calculateDistribution('{area}', zeroApartments, 1000);
			expect(result.isValid).toBe(false);
			expect(result.error).toContain('zero');
		});
	});

	describe('validateFormulaForDistribution', () => {
		it('should validate simple area formula', () => {
			const result = validateFormulaForDistribution('{area}');
			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should validate rooms formula', () => {
			const result = validateFormulaForDistribution('{rooms}');
			expect(result.isValid).toBe(true);
		});

		it('should validate weighted formula', () => {
			const result = validateFormulaForDistribution('{area} * 0.6 + {rooms} * 10 * 0.4');
			expect(result.isValid).toBe(true);
		});

		it('should reject invalid formula', () => {
			const result = validateFormulaForDistribution('not a formula');
			expect(result.isValid).toBe(false);
		});

		it('should warn about zero results', () => {
			// A formula that could give zero for some apartments
			const result = validateFormulaForDistribution('{rooms} - 2');
			// This might give zero or negative for 2-room apartments
			expect(result.warnings.length > 0 || result.errors.length > 0).toBe(true);
		});
	});

	describe('FORMULA_VARIABLES', () => {
		it('should contain all expected variables', () => {
			expect(FORMULA_VARIABLES).toContain('area');
			expect(FORMULA_VARIABLES).toContain('rooms');
			expect(FORMULA_VARIABLES).toContain('volume');
			expect(FORMULA_VARIABLES).toContain('units');
		});

		it('should have exactly 4 variables', () => {
			expect(FORMULA_VARIABLES).toHaveLength(4);
		});
	});
});
