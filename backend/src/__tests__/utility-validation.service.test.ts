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
	});
});
