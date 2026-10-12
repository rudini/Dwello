/**
 * Unit tests for prorating service
 * Tests core business logic for utility cost prorating
 */

import { describe, it, expect } from 'bun:test';
import { prorateCosts } from '../services/prorating.service';

describe('Prorating Service', () => {
	describe('prorateCosts', () => {
		it('should calculate correct proration for full period', () => {
			const result = prorateCosts(12000, 365, 365);
			expect(result.proratedAmount).toBe(12000);
			expect(result.periodShare).toBe(1);
		});

		it('should calculate correct proration for half period', () => {
			const result = prorateCosts(12000, 183, 366);
			expect(result.proratedAmount).toBe(6000); // Exactly half
			expect(result.periodShare).toBeCloseTo(0.5, 2);
		});

		it('should calculate correct proration for quarter period', () => {
			const result = prorateCosts(12000, 91, 365);
			expect(result.proratedAmount).toBeCloseTo(2991.78, 2);
			expect(result.periodShare).toBeCloseTo(0.2493, 3);
		});

		it('should return 0 for zero total days', () => {
			const result = prorateCosts(12000, 100, 0);
			expect(result.proratedAmount).toBe(0);
			expect(result.periodShare).toBe(0);
		});

		it('should handle scenario: Tenant A Jan 1 - Mar 15 (74 of 365 days)', () => {
			// From PRD: Tenant A: Jan 1 - Mar 15 (74 days), Total CHF 12,000
			const resultA = prorateCosts(12000, 74, 365);
			expect(resultA.proratedAmount).toBeCloseTo(2432.88, 2);
		});
	});

	describe('prorateCosts - edge cases', () => {
		it('should handle negative total days', () => {
			const result = prorateCosts(12000, 100, -1);
			expect(result.proratedAmount).toBe(0);
			expect(result.periodShare).toBe(0);
		});

		it('should handle zero proration days', () => {
			const result = prorateCosts(12000, 0, 365);
			expect(result.proratedAmount).toBe(0);
			expect(result.periodShare).toBe(0);
		});

		it('should round to 2 decimal places', () => {
			const result = prorateCosts(10000, 33, 365);
			// 10000 * 33/365 = 904.109589...
			expect(result.proratedAmount).toBe(904.11);
		});

		it('should handle very small amounts', () => {
			const result = prorateCosts(0.01, 1, 365);
			expect(result.proratedAmount).toBe(0);
		});
	});

	describe('prorateCosts - PRD scenarios', () => {
		it('should handle PRD scenario: Tenant A Jan-Mar 15 (74 days)', () => {
			const result = prorateCosts(12000, 74, 365);
			expect(result.proratedAmount).toBeCloseTo(2432.88, 2);
			expect(result.periodShare).toBeCloseTo(0.2027, 3);
		});

		it('should handle PRD scenario: Tenant B Mar 16-Dec 31 (291 days)', () => {
			const result = prorateCosts(12000, 291, 365);
			expect(result.proratedAmount).toBeCloseTo(9567.12, 2);
			expect(result.periodShare).toBeCloseTo(0.7973, 3);
		});

		it('should sum to total for both tenants', () => {
			const resultA = prorateCosts(12000, 74, 365);
			const resultB = prorateCosts(12000, 291, 365);
			expect(resultA.proratedAmount + resultB.proratedAmount).toBeCloseTo(12000, 1);
		});
	});
});
