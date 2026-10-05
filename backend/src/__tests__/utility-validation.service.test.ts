/**
 * Unit tests for utility validation service
 * Tests Swiss utility cost validation and compliance
 */

import { describe, it, expect } from 'bun:test';
import {
	MAX_MANAGEMENT_FEE_PERCENT,
	getUtilityCostRules,
	validateManagementFee,
	calculateMaxManagementFee
} from '../services/utility-validation.service';

describe('Utility Validation Service', () => {
	describe('MAX_MANAGEMENT_FEE_PERCENT', () => {
		it('should be 3% per Swiss law', () => {
			expect(MAX_MANAGEMENT_FEE_PERCENT).toBe(3.0);
		});
	});

	describe('getUtilityCostRules', () => {
		it('should return max management fee of 3%', () => {
			const rules = getUtilityCostRules();
			expect(rules.maxManagementFeePercent).toBe(3.0);
		});

		it('should include allowed categories', () => {
			const rules = getUtilityCostRules();
			expect(rules.allowedCategories).toBeDefined();
			expect(Array.isArray(rules.allowedCategories)).toBe(true);
		});

		it('should include not allowed categories', () => {
			const rules = getUtilityCostRules();
			expect(rules.notAllowedCategories).toBeDefined();
			expect(Array.isArray(rules.notAllowedCategories)).toBe(true);
		});

		it('should include compliance notes in German', () => {
			const rules = getUtilityCostRules();
			expect(rules.notes).toBeDefined();
			expect(rules.notes.length).toBeGreaterThan(0);
			// Check for key Swiss rules
			expect(rules.notes.some(n => n.includes('3%'))).toBe(true);
		});
	});

	describe('validateManagementFee', () => {
		it('should accept fee at exactly 3%', () => {
			const result = validateManagementFee(300, 10000);
			expect(result.isValid).toBe(true);
			expect(result.actualPercent).toBe(3);
		});

		it('should accept fee below 3%', () => {
			const result = validateManagementFee(200, 10000);
			expect(result.isValid).toBe(true);
			expect(result.actualPercent).toBe(2);
		});

		it('should reject fee above 3%', () => {
			const result = validateManagementFee(400, 10000);
			expect(result.isValid).toBe(false);
			expect(result.actualPercent).toBe(4);
			expect(result.error).toContain('überschreiten');
		});

		it('should accept zero fee', () => {
			const result = validateManagementFee(0, 10000);
			expect(result.isValid).toBe(true);
			expect(result.actualPercent).toBe(0);
		});

		it('should handle zero total costs with zero fee', () => {
			const result = validateManagementFee(0, 0);
			expect(result.isValid).toBe(true);
		});

		it('should reject fee when total costs is zero', () => {
			const result = validateManagementFee(100, 0);
			expect(result.isValid).toBe(false);
			expect(result.error).toContain('nur bei Nebenkosten');
		});

		it('should calculate correct percentage for edge cases', () => {
			// 2.99% should be valid
			const result = validateManagementFee(299, 10000);
			expect(result.isValid).toBe(true);
			expect(result.actualPercent).toBeCloseTo(2.99, 2);
		});

		it('should reject 3.01%', () => {
			const result = validateManagementFee(301, 10000);
			expect(result.isValid).toBe(false);
		});
	});

	describe('calculateMaxManagementFee', () => {
		it('should calculate 3% of total costs', () => {
			expect(calculateMaxManagementFee(10000)).toBe(300);
		});

		it('should return 0 for zero costs', () => {
			expect(calculateMaxManagementFee(0)).toBe(0);
		});

		it('should handle decimal amounts', () => {
			expect(calculateMaxManagementFee(5555.55)).toBeCloseTo(166.67, 2);
		});

		it('should calculate correctly for large amounts', () => {
			expect(calculateMaxManagementFee(100000)).toBe(3000);
		});

		it('should calculate correctly for small amounts', () => {
			expect(calculateMaxManagementFee(100)).toBe(3);
		});

		it('should handle negative amounts', () => {
			expect(calculateMaxManagementFee(-1000)).toBe(-30);
		});
	});

	describe('getUtilityCostRules - detailed checks', () => {
		it('should include heating in allowed categories', () => {
			const rules = getUtilityCostRules();
			expect(rules.allowedCategories.some(c => c.toLowerCase().includes('heiz'))).toBe(true);
		});

		it('should include water in allowed categories', () => {
			const rules = getUtilityCostRules();
			expect(rules.allowedCategories.some(c => c.toLowerCase().includes('wasser'))).toBe(true);
		});

		it('should include repairs in not allowed categories', () => {
			const rules = getUtilityCostRules();
			expect(rules.notAllowedCategories.some(c => c.toLowerCase().includes('reparatur'))).toBe(true);
		});

		it('should include taxes in not allowed categories', () => {
			const rules = getUtilityCostRules();
			expect(rules.notAllowedCategories.some(c => c.toLowerCase().includes('steuer'))).toBe(true);
		});
	});

	describe('validateManagementFee - boundary tests', () => {
		it('should accept 2.999%', () => {
			const result = validateManagementFee(299.9, 10000);
			expect(result.isValid).toBe(true);
		});

		it('should reject 3.001%', () => {
			const result = validateManagementFee(300.1, 10000);
			expect(result.isValid).toBe(false);
		});

		it('should handle very small total costs', () => {
			const result = validateManagementFee(0.03, 1);
			expect(result.isValid).toBe(true);
			expect(result.actualPercent).toBe(3);
		});

		it('should handle very large total costs', () => {
			const result = validateManagementFee(30000, 1000000);
			expect(result.isValid).toBe(true);
			expect(result.actualPercent).toBe(3);
		});

		it('should provide correct error message format', () => {
			const result = validateManagementFee(500, 10000);
			expect(result.isValid).toBe(false);
			expect(result.error).toContain('5');
			expect(result.error).toContain('3%');
		});
	});

	describe('validateManagementFee - additional edge cases', () => {
		it('should return maxPercent in all results', () => {
			const validResult = validateManagementFee(100, 10000);
			const invalidResult = validateManagementFee(500, 10000);

			expect(validResult.maxPercent).toBe(3);
			expect(invalidResult.maxPercent).toBe(3);
		});

		it('should handle negative management fee', () => {
			const result = validateManagementFee(-100, 10000);
			// Negative fee gives negative percent, which is less than 3%
			expect(result.actualPercent).toBe(-1);
			expect(result.isValid).toBe(true); // Technically valid as it's under 3%
		});

		it('should reject positive fee when total costs is negative', () => {
			const result = validateManagementFee(100, -10000);
			// Negative total costs means no valid utility costs, so fee not allowed
			expect(result.isValid).toBe(false);
		});

		it('should handle decimal amounts precisely', () => {
			const result = validateManagementFee(299.99, 10000);
			expect(result.actualPercent).toBeCloseTo(2.9999, 3);
			expect(result.isValid).toBe(true);
		});

		it('should handle fractional cent amounts', () => {
			const result = validateManagementFee(2.999, 100);
			expect(result.actualPercent).toBeCloseTo(2.999, 2);
			expect(result.isValid).toBe(true);
		});

		it('should format error message with percentage', () => {
			const result = validateManagementFee(450, 10000);
			expect(result.error).toContain('4.5');
		});
	});

	describe('calculateMaxManagementFee - additional scenarios', () => {
		it('should handle Swiss franc amounts correctly', () => {
			// Typical Swiss utility costs
			expect(calculateMaxManagementFee(5000)).toBe(150);
			expect(calculateMaxManagementFee(8000)).toBe(240);
			expect(calculateMaxManagementFee(15000)).toBe(450);
		});

		it('should handle rounding for odd amounts', () => {
			// 3% of 333.33 = 9.9999
			const result = calculateMaxManagementFee(333.33);
			expect(result).toBeCloseTo(9.9999, 2);
		});

		it('should handle very small amounts', () => {
			expect(calculateMaxManagementFee(1)).toBe(0.03);
			expect(calculateMaxManagementFee(0.5)).toBe(0.015);
		});

		it('should handle integer division correctly', () => {
			// Ensure no integer division issues
			expect(calculateMaxManagementFee(1)).toBe(0.03);
			expect(calculateMaxManagementFee(2)).toBe(0.06);
			expect(calculateMaxManagementFee(3)).toBe(0.09);
		});
	});

	describe('getUtilityCostRules - detailed structure', () => {
		it('should return all required fields', () => {
			const rules = getUtilityCostRules();
			expect(rules).toHaveProperty('maxManagementFeePercent');
			expect(rules).toHaveProperty('allowedCategories');
			expect(rules).toHaveProperty('notAllowedCategories');
			expect(rules).toHaveProperty('notes');
		});

		it('should have non-empty allowed categories', () => {
			const rules = getUtilityCostRules();
			expect(rules.allowedCategories.length).toBeGreaterThan(0);
		});

		it('should have non-empty not allowed categories', () => {
			const rules = getUtilityCostRules();
			expect(rules.notAllowedCategories.length).toBeGreaterThan(0);
		});

		it('should include elevator in allowed', () => {
			const rules = getUtilityCostRules();
			const hasElevator = rules.allowedCategories.some(c =>
				c.toLowerCase().includes('aufzug') || c.toLowerCase().includes('lift')
			);
			expect(hasElevator).toBe(true);
		});

		it('should include caretaker/Hauswart in allowed', () => {
			const rules = getUtilityCostRules();
			const hasCaretaker = rules.allowedCategories.some(c =>
				c.toLowerCase().includes('hauswart') || c.toLowerCase().includes('concierge')
			);
			expect(hasCaretaker).toBe(true);
		});

		it('notes should be in German', () => {
			const rules = getUtilityCostRules();
			// Check for German-specific characters or words
			const hasGerman = rules.notes.some(n =>
				n.includes('Nebenkosten') ||
				n.includes('Verwaltungskosten') ||
				n.includes('Mietvertrag')
			);
			expect(hasGerman).toBe(true);
		});

		it('notes should mention the 3% rule', () => {
			const rules = getUtilityCostRules();
			const mentions3Percent = rules.notes.some(n => n.includes('3%'));
			expect(mentions3Percent).toBe(true);
		});

		it('notes should mention repairs are not allowed', () => {
			const rules = getUtilityCostRules();
			const mentionsRepairs = rules.notes.some(n =>
				n.toLowerCase().includes('reparatur')
			);
			expect(mentionsRepairs).toBe(true);
		});
	});

	describe('MAX_MANAGEMENT_FEE_PERCENT constant', () => {
		it('should be a number', () => {
			expect(typeof MAX_MANAGEMENT_FEE_PERCENT).toBe('number');
		});

		it('should be positive', () => {
			expect(MAX_MANAGEMENT_FEE_PERCENT).toBeGreaterThan(0);
		});

		it('should be less than or equal to 5 (reasonable limit)', () => {
			expect(MAX_MANAGEMENT_FEE_PERCENT).toBeLessThanOrEqual(5);
		});

		it('should match Swiss legal requirement', () => {
			// Swiss law caps management fees at 3%
			expect(MAX_MANAGEMENT_FEE_PERCENT).toBe(3.0);
		});
	});

	describe('validateManagementFee and calculateMaxManagementFee consistency', () => {
		it('should accept fee at exactly calculated max', () => {
			const totalCosts = 12500;
			const maxFee = calculateMaxManagementFee(totalCosts);
			const result = validateManagementFee(maxFee, totalCosts);
			expect(result.isValid).toBe(true);
		});

		it('should reject fee slightly above calculated max', () => {
			const totalCosts = 12500;
			const maxFee = calculateMaxManagementFee(totalCosts);
			const result = validateManagementFee(maxFee + 0.01, totalCosts);
			expect(result.isValid).toBe(false);
		});

		it('should be consistent across various amounts', () => {
			const testAmounts = [100, 1000, 5000, 10000, 50000, 100000];

			for (const amount of testAmounts) {
				const maxFee = calculateMaxManagementFee(amount);
				const result = validateManagementFee(maxFee, amount);
				expect(result.isValid).toBe(true);
			}
		});
	});
});
