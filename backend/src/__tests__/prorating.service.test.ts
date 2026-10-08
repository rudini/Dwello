/**
 * Unit tests for prorating service
 * Tests core business logic for utility cost prorating
 */

import { describe, it, expect } from 'bun:test';
import type { ContractWithDetails } from '../services/contract.service';
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

	describe('handleVacancy', () => {
		const periodStart = new Date('2024-01-01');
		const periodEnd = new Date('2024-12-31');

		it('should detect no vacancy when fully occupied', () => {
			const contracts: ContractPeriodOverlap[] = [{
				contract: {} as ContractWithDetails,
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
				contract: {} as ContractWithDetails,
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
					contract: {} as ContractWithDetails,
					overlapStart: new Date('2024-01-01'),
					overlapEnd: new Date('2024-03-31'),
					overlapDays: 91,
					shareOfPeriod: 91/366
				},
				{
					contract: {} as ContractWithDetails,
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
				contract: {} as ContractWithDetails,
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
				{ contract: { id: '1' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 183, shareOfPeriod: 0.5 },
				{ contract: { id: '2' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 183, shareOfPeriod: 0.5 }
			];

			const result = distributeCostsAcrossContracts(contracts, 10000);
			expect(result).toHaveLength(2);
			expect(result[0].amount).toBe(5000);
			expect(result[1].amount).toBe(5000);
		});

		it('should distribute costs proportionally for unequal overlap', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: { id: '1' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 100, shareOfPeriod: 0.25 },
				{ contract: { id: '2' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 300, shareOfPeriod: 0.75 }
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
				{ contract: { id: '1' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 365, shareOfPeriod: 1 }
			];

			const result = distributeCostsAcrossContracts(contracts, 10000);
			expect(result).toHaveLength(1);
			expect(result[0].amount).toBe(10000);
			expect(result[0].share).toBe(1);
		});

		it('should use heating shares when provided', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: { id: '1' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 100, shareOfPeriod: 0.25 },
				{ contract: { id: '2' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 300, shareOfPeriod: 0.75 }
			];

			const heatingShares = new Map([['1', 0.4], ['2', 0.6]]);
			const result = distributeCostsAcrossContracts(contracts, 10000, true, heatingShares);

			expect(result[0].amount).toBe(4000);
			expect(result[1].amount).toBe(6000);
		});

		it('should handle missing heating share gracefully', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: { id: '1' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 100, shareOfPeriod: 0.5 }
			];

			const heatingShares = new Map<string, number>(); // Empty map
			const result = distributeCostsAcrossContracts(contracts, 10000, true, heatingShares);

			expect(result[0].amount).toBe(0); // No share found
		});
	});

	describe('calculateDaysBetween - edge cases', () => {
		it('should handle February in leap year', () => {
			const start = new Date('2024-02-01');
			const end = new Date('2024-02-29');
			expect(calculateDaysBetween(start, end)).toBe(29);
		});

		it('should handle February in non-leap year', () => {
			const start = new Date('2023-02-01');
			const end = new Date('2023-02-28');
			expect(calculateDaysBetween(start, end)).toBe(28);
		});

		it('should handle daylight saving time transitions', () => {
			// DST transition in March (Switzerland)
			const start = new Date('2024-03-30');
			const end = new Date('2024-04-01');
			expect(calculateDaysBetween(start, end)).toBe(3);
		});

		it('should handle end of year to start of year', () => {
			const start = new Date('2023-12-31');
			const end = new Date('2024-01-01');
			expect(calculateDaysBetween(start, end)).toBe(2);
		});
	});

	describe('calculateOverlap - edge cases', () => {
		it('should handle identical ranges', () => {
			const result = calculateOverlap(
				new Date('2024-01-01'),
				new Date('2024-12-31'),
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);
			expect(result).not.toBeNull();
			expect(result!.days).toBe(366);
		});

		it('should handle single day overlap', () => {
			const result = calculateOverlap(
				new Date('2024-01-01'),
				new Date('2024-01-15'),
				new Date('2024-01-15'),
				new Date('2024-01-31')
			);
			expect(result).not.toBeNull();
			expect(result!.days).toBe(1);
		});

		it('should return null when ranges touch but do not overlap', () => {
			const result = calculateOverlap(
				new Date('2024-01-01'),
				new Date('2024-01-14'),
				new Date('2024-01-15'),
				new Date('2024-01-31')
			);
			expect(result).toBeNull();
		});
	});

	describe('calculateProrationDays - edge cases', () => {
		it('should handle contract starting on period start', () => {
			const result = calculateProrationDays(
				new Date('2024-01-01'),
				new Date('2024-06-30'),
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);
			expect(result).not.toBeNull();
			expect(result!.overlapStart.toISOString().split('T')[0]).toBe('2024-01-01');
		});

		it('should handle contract ending on period end', () => {
			const result = calculateProrationDays(
				new Date('2024-07-01'),
				new Date('2024-12-31'),
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);
			expect(result).not.toBeNull();
			expect(result!.overlapEnd.toISOString().split('T')[0]).toBe('2024-12-31');
		});

		it('should handle single day contract', () => {
			const result = calculateProrationDays(
				new Date('2024-06-15'),
				new Date('2024-06-15'),
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);
			expect(result).not.toBeNull();
			expect(result!.days).toBe(1);
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

	describe('handleVacancy - edge cases', () => {
		const periodStart = new Date('2024-01-01');
		const periodEnd = new Date('2024-12-31');

		it('should handle empty contracts array', () => {
			const result = handleVacancy([], periodStart, periodEnd);
			expect(result.vacantPeriods).toHaveLength(1);
			expect(result.totalVacantDays).toBe(366);
		});

		it('should handle multiple gaps between contracts', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: {} as ContractWithDetails, overlapStart: new Date('2024-01-01'), overlapEnd: new Date('2024-02-29'), overlapDays: 60, shareOfPeriod: 60/366 },
				{ contract: {} as ContractWithDetails, overlapStart: new Date('2024-04-01'), overlapEnd: new Date('2024-05-31'), overlapDays: 61, shareOfPeriod: 61/366 },
				{ contract: {} as ContractWithDetails, overlapStart: new Date('2024-08-01'), overlapEnd: new Date('2024-12-31'), overlapDays: 153, shareOfPeriod: 153/366 }
			];

			const result = handleVacancy(contracts, periodStart, periodEnd);
			expect(result.vacantPeriods).toHaveLength(2); // March and June-July
		});

		it('should handle overlapping contracts', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: {} as ContractWithDetails, overlapStart: new Date('2024-01-01'), overlapEnd: new Date('2024-06-30'), overlapDays: 182, shareOfPeriod: 182/366 },
				{ contract: {} as ContractWithDetails, overlapStart: new Date('2024-06-01'), overlapEnd: new Date('2024-12-31'), overlapDays: 214, shareOfPeriod: 214/366 }
			];

			const result = handleVacancy(contracts, periodStart, periodEnd);
			expect(result.vacantPeriods).toHaveLength(0);
		});

		it('should handle unsorted contracts', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: {} as ContractWithDetails, overlapStart: new Date('2024-06-01'), overlapEnd: new Date('2024-12-31'), overlapDays: 214, shareOfPeriod: 214/366 },
				{ contract: {} as ContractWithDetails, overlapStart: new Date('2024-01-01'), overlapEnd: new Date('2024-03-31'), overlapDays: 91, shareOfPeriod: 91/366 }
			];

			const result = handleVacancy(contracts, periodStart, periodEnd);
			expect(result.vacantPeriods).toHaveLength(1);
			// Gap from April 1 to May 31
			expect(result.vacantPeriods[0].start.toISOString().split('T')[0]).toBe('2024-04-01');
		});
	});

	describe('distributeCostsAcrossContracts - additional edge cases', () => {
		it('should handle three contracts with equal days', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: { id: '1' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 100, shareOfPeriod: 1/3 },
				{ contract: { id: '2' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 100, shareOfPeriod: 1/3 },
				{ contract: { id: '3' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 100, shareOfPeriod: 1/3 }
			];

			const result = distributeCostsAcrossContracts(contracts, 9000);
			expect(result).toHaveLength(3);
			expect(result[0].amount).toBeCloseTo(3000, 1);
			expect(result[1].amount).toBeCloseTo(3000, 1);
			expect(result[2].amount).toBeCloseTo(3000, 1);
		});

		it('should handle heating shares with partial coverage', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: { id: '1' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 100, shareOfPeriod: 0.5 },
				{ contract: { id: '2' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 100, shareOfPeriod: 0.5 }
			];

			const heatingShares = new Map([['1', 0.3]]); // Only one contract has heating share
			const result = distributeCostsAcrossContracts(contracts, 10000, true, heatingShares);

			expect(result[0].amount).toBe(3000);
			expect(result[1].amount).toBe(0); // Missing from map
		});

		it('should handle zero overlap days', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: { id: '1' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 0, shareOfPeriod: 0 }
			];

			const result = distributeCostsAcrossContracts(contracts, 10000);
			expect(result[0].share).toBe(0);
			expect(result[0].amount).toBe(0);
		});

		it('should handle decimal day values', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: { id: '1' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 33.5, shareOfPeriod: 0.33 },
				{ contract: { id: '2' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 66.5, shareOfPeriod: 0.67 }
			];

			const result = distributeCostsAcrossContracts(contracts, 10000);
			expect(result[0].share).toBeCloseTo(0.335, 2);
			expect(result[1].share).toBeCloseTo(0.665, 2);
		});

		it('should not use heating shares when flag is false', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: { id: '1' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 100, shareOfPeriod: 0.25 },
				{ contract: { id: '2' } as ContractWithDetails, overlapStart: new Date(), overlapEnd: new Date(), overlapDays: 300, shareOfPeriod: 0.75 }
			];

			const heatingShares = new Map([['1', 0.9], ['2', 0.1]]);
			const result = distributeCostsAcrossContracts(contracts, 10000, false, heatingShares);

			// Should use day-based calculation, not heating shares
			expect(result[0].amount).toBe(2500);
			expect(result[1].amount).toBe(7500);
		});
	});

	describe('handleVacancy - additional edge cases', () => {
		const periodStart = new Date('2024-01-01');
		const periodEnd = new Date('2024-12-31');

		it('should calculate total vacant days correctly for multiple gaps', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: {} as ContractWithDetails, overlapStart: new Date('2024-02-01'), overlapEnd: new Date('2024-03-31'), overlapDays: 60, shareOfPeriod: 60/366 },
				{ contract: {} as ContractWithDetails, overlapStart: new Date('2024-06-01'), overlapEnd: new Date('2024-08-31'), overlapDays: 92, shareOfPeriod: 92/366 }
			];

			const result = handleVacancy(contracts, periodStart, periodEnd);
			// Gap: Jan 1-31 (31 days), Apr 1 - May 31 (61 days), Sep 1 - Dec 31 (122 days)
			expect(result.vacantPeriods).toHaveLength(3);
			expect(result.totalVacantDays).toBe(31 + 61 + 122);
		});

		it('should handle contract starting after period start with exact day precision', () => {
			const contracts: ContractPeriodOverlap[] = [{
				contract: {} as ContractWithDetails,
				overlapStart: new Date('2024-01-15'),
				overlapEnd: new Date('2024-12-31'),
				overlapDays: 352,
				shareOfPeriod: 352/366
			}];

			const result = handleVacancy(contracts, periodStart, periodEnd);
			expect(result.vacantPeriods).toHaveLength(1);
			expect(result.totalVacantDays).toBe(14); // Jan 1-14
		});

		it('should handle contract ending before period end with exact day precision', () => {
			const contracts: ContractPeriodOverlap[] = [{
				contract: {} as ContractWithDetails,
				overlapStart: new Date('2024-01-01'),
				overlapEnd: new Date('2024-12-15'),
				overlapDays: 350,
				shareOfPeriod: 350/366
			}];

			const result = handleVacancy(contracts, periodStart, periodEnd);
			expect(result.vacantPeriods).toHaveLength(1);
			expect(result.totalVacantDays).toBe(16); // Dec 16-31
		});

		it('should handle adjacent contracts with no gap', () => {
			const contracts: ContractPeriodOverlap[] = [
				{ contract: {} as ContractWithDetails, overlapStart: new Date('2024-01-01'), overlapEnd: new Date('2024-06-30'), overlapDays: 182, shareOfPeriod: 0.5 },
				{ contract: {} as ContractWithDetails, overlapStart: new Date('2024-07-01'), overlapEnd: new Date('2024-12-31'), overlapDays: 184, shareOfPeriod: 0.5 }
			];

			const result = handleVacancy(contracts, periodStart, periodEnd);
			expect(result.vacantPeriods).toHaveLength(0);
			expect(result.totalVacantDays).toBe(0);
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

	describe('calculateOverlap - date range combinations', () => {
		it('should handle range2 completely before range1', () => {
			const result = calculateOverlap(
				new Date('2024-06-01'),
				new Date('2024-12-31'),
				new Date('2024-01-01'),
				new Date('2024-05-31')
			);
			expect(result).toBeNull();
		});

		it('should handle range2 completely after range1', () => {
			const result = calculateOverlap(
				new Date('2024-01-01'),
				new Date('2024-05-31'),
				new Date('2024-06-01'),
				new Date('2024-12-31')
			);
			expect(result).toBeNull();
		});

		it('should handle range1 completely within range2', () => {
			const result = calculateOverlap(
				new Date('2024-03-01'),
				new Date('2024-03-31'),
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);
			expect(result).not.toBeNull();
			expect(result!.start.toISOString().split('T')[0]).toBe('2024-03-01');
			expect(result!.end.toISOString().split('T')[0]).toBe('2024-03-31');
		});
	});
});
