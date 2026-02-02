/**
 * Unit tests for prorating service
 * Tests core business logic for utility cost prorating
 */

import { describe, it, expect } from 'bun:test';
import {
	calculateDaysBetween,
	calculateOverlap,
	calculateProrationDays,
	prorateCosts,
	handleVacancy,
	distributeCostsAcrossContracts,
	type ContractPeriodOverlap
} from '../services/prorating.service';

describe('Prorating Service', () => {
	describe('calculateDaysBetween', () => {
		it('should return 1 for same day', () => {
			const date = new Date('2024-01-15');
			expect(calculateDaysBetween(date, date)).toBe(1);
		});

		it('should return correct days for a full year', () => {
			const start = new Date('2024-01-01');
			const end = new Date('2024-12-31');
			expect(calculateDaysBetween(start, end)).toBe(366); // 2024 is a leap year
		});

		it('should return correct days for a month', () => {
			const start = new Date('2024-03-01');
			const end = new Date('2024-03-31');
			expect(calculateDaysBetween(start, end)).toBe(31);
		});

		it('should handle cross-year periods', () => {
			const start = new Date('2023-12-15');
			const end = new Date('2024-01-15');
			expect(calculateDaysBetween(start, end)).toBe(32);
		});
	});

	describe('calculateOverlap', () => {
		it('should return null for non-overlapping ranges', () => {
			const result = calculateOverlap(
				new Date('2024-01-01'),
				new Date('2024-01-31'),
				new Date('2024-03-01'),
				new Date('2024-03-31')
			);
			expect(result).toBeNull();
		});

		it('should return correct overlap for partially overlapping ranges', () => {
			const result = calculateOverlap(
				new Date('2024-01-01'),
				new Date('2024-02-15'),
				new Date('2024-02-01'),
				new Date('2024-03-31')
			);
			expect(result).not.toBeNull();
			expect(result!.start.toISOString().split('T')[0]).toBe('2024-02-01');
			expect(result!.end.toISOString().split('T')[0]).toBe('2024-02-15');
			expect(result!.days).toBe(15);
		});

		it('should return full range when one range contains the other', () => {
			const result = calculateOverlap(
				new Date('2024-01-01'),
				new Date('2024-12-31'),
				new Date('2024-03-01'),
				new Date('2024-03-31')
			);
			expect(result).not.toBeNull();
			expect(result!.days).toBe(31);
		});

		it('should handle adjacent ranges (no overlap)', () => {
			const result = calculateOverlap(
				new Date('2024-01-01'),
				new Date('2024-01-31'),
				new Date('2024-02-01'),
				new Date('2024-02-28')
			);
			expect(result).toBeNull();
		});
	});

	describe('calculateProrationDays', () => {
		const periodStart = new Date('2024-01-01');
		const periodEnd = new Date('2024-12-31');

		it('should return full period for contract covering entire period', () => {
			const result = calculateProrationDays(
				new Date('2023-01-01'),
				null, // No end date
				periodStart,
				periodEnd
			);
			expect(result).not.toBeNull();
			expect(result!.days).toBe(366);
		});

		it('should return partial period for mid-year move-in', () => {
			const result = calculateProrationDays(
				new Date('2024-07-01'),
				null,
				periodStart,
				periodEnd
			);
			expect(result).not.toBeNull();
			expect(result!.days).toBe(184); // Jul 1 - Dec 31
		});

		it('should return partial period for mid-year move-out', () => {
			const result = calculateProrationDays(
				new Date('2023-01-01'),
				new Date('2024-06-30'),
				periodStart,
				periodEnd
			);
			expect(result).not.toBeNull();
			expect(result!.days).toBe(182); // Jan 1 - Jun 30
		});

		it('should return null for contract outside period', () => {
			const result = calculateProrationDays(
				new Date('2023-01-01'),
				new Date('2023-12-31'),
				periodStart,
				periodEnd
			);
			expect(result).toBeNull();
		});

		it('should handle contract within period', () => {
			const result = calculateProrationDays(
				new Date('2024-03-15'),
				new Date('2024-09-15'),
				periodStart,
				periodEnd
			);
			expect(result).not.toBeNull();
			expect(result!.overlapStart.toISOString().split('T')[0]).toBe('2024-03-15');
			expect(result!.overlapEnd.toISOString().split('T')[0]).toBe('2024-09-15');
		});
	});

	describe('prorateCosts', () => {
		it('should calculate correct proration for full period', () => {
			const result = prorateCosts(12000, 365, 365);
			expect(result.proratedAmount).toBe(12000);
			expect(result.sharePercentage).toBe(1);
		});

		it('should calculate correct proration for half period', () => {
			const result = prorateCosts(12000, 183, 366);
			expect(result.proratedAmount).toBe(6000); // Exactly half
			expect(result.sharePercentage).toBeCloseTo(0.5, 2);
		});

		it('should calculate correct proration for quarter period', () => {
			const result = prorateCosts(12000, 91, 365);
			expect(result.proratedAmount).toBeCloseTo(2991.78, 2);
			expect(result.sharePercentage).toBeCloseTo(0.2493, 3);
		});

		it('should return 0 for zero total days', () => {
			const result = prorateCosts(12000, 100, 0);
			expect(result.proratedAmount).toBe(0);
			expect(result.sharePercentage).toBe(0);
		});

		it('should handle scenario: Tenant A Jan-Mar, Tenant B Apr-Dec', () => {
			// From PRD: Tenant A: Jan 1 - Mar 15 (74 days), Total CHF 12,000
			const resultA = prorateCosts(12000, 74, 365);
			expect(resultA.proratedAmount).toBeCloseTo(2432.88, 2);
		});
	});

	describe('handleVacancy', () => {
		const periodStart = new Date('2024-01-01');
		const periodEnd = new Date('2024-12-31');

		it('should detect no vacancy when fully occupied', () => {
			const contracts: ContractPeriodOverlap[] = [{
				contract: {} as any,
				overlapStart: new Date('2024-01-01'),
				overlapEnd: new Date('2024-12-31'),
				overlapDays: 366,
				shareOfPeriod: 1
			}];

			const result = handleVacancy(contracts, periodStart, periodEnd);
			expect(result.vacantPeriods).toHaveLength(0);
			expect(result.totalVacantDays).toBe(0);
		});

		it('should detect vacancy at start of period', () => {
			const contracts: ContractPeriodOverlap[] = [{
				contract: {} as any,
				overlapStart: new Date('2024-03-01'),
				overlapEnd: new Date('2024-12-31'),
				overlapDays: 306,
				shareOfPeriod: 306/366
			}];

			const result = handleVacancy(contracts, periodStart, periodEnd);
			expect(result.vacantPeriods).toHaveLength(1);
			expect(result.vacantPeriods[0].start.toISOString().split('T')[0]).toBe('2024-01-01');
			expect(result.vacantPeriods[0].end.toISOString().split('T')[0]).toBe('2024-02-29');
		});

		it('should detect vacancy between contracts', () => {
			const contracts: ContractPeriodOverlap[] = [
				{
					contract: {} as any,
					overlapStart: new Date('2024-01-01'),
					overlapEnd: new Date('2024-03-31'),
					overlapDays: 91,
					shareOfPeriod: 91/366
				},
				{
					contract: {} as any,
					overlapStart: new Date('2024-06-01'),
					overlapEnd: new Date('2024-12-31'),
					overlapDays: 214,
					shareOfPeriod: 214/366
				}
			];

			const result = handleVacancy(contracts, periodStart, periodEnd);
			expect(result.vacantPeriods).toHaveLength(1);
			expect(result.vacantPeriods[0].start.toISOString().split('T')[0]).toBe('2024-04-01');
			expect(result.vacantPeriods[0].end.toISOString().split('T')[0]).toBe('2024-05-31');
		});

		it('should detect vacancy at end of period', () => {
			const contracts: ContractPeriodOverlap[] = [{
				contract: {} as any,
				overlapStart: new Date('2024-01-01'),
				overlapEnd: new Date('2024-09-30'),
				overlapDays: 274,
				shareOfPeriod: 274/366
			}];

			const result = handleVacancy(contracts, periodStart, periodEnd);
			expect(result.vacantPeriods).toHaveLength(1);
			expect(result.vacantPeriods[0].start.toISOString().split('T')[0]).toBe('2024-10-01');
		});
	});

	describe('distributeCostsAcrossContracts', () => {
		it('should distribute costs equally for equal overlap', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: { id: '1' } as any, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 183, shareOfPeriod: 0.5 },
				{ contract: { id: '2' } as any, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 183, shareOfPeriod: 0.5 }
			];

			const result = distributeCostsAcrossContracts(contracts, 10000);
			expect(result).toHaveLength(2);
			expect(result[0].amount).toBe(5000);
			expect(result[1].amount).toBe(5000);
		});

		it('should distribute costs proportionally for unequal overlap', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: { id: '1' } as any, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 100, shareOfPeriod: 0.25 },
				{ contract: { id: '2' } as any, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 300, shareOfPeriod: 0.75 }
			];

			const result = distributeCostsAcrossContracts(contracts, 10000);
			expect(result).toHaveLength(2);
			expect(result[0].amount).toBe(2500);
			expect(result[1].amount).toBe(7500);
		});

		it('should return empty array for no contracts', () => {
			const result = distributeCostsAcrossContracts([], 10000);
			expect(result).toHaveLength(0);
		});

		it('should handle single contract', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: { id: '1' } as any, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 365, shareOfPeriod: 1 }
			];

			const result = distributeCostsAcrossContracts(contracts, 10000);
			expect(result).toHaveLength(1);
			expect(result[0].amount).toBe(10000);
			expect(result[0].share).toBe(1);
		});
	});
});
