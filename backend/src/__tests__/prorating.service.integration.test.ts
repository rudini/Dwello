/**
 * Integration tests for prorating service async functions
 * Uses mocked database dependencies
 */

import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test';

// Mock the contract service before importing prorating service
const mockGetContractsByPeriod = mock(() => Promise.resolve([]));

mock.module('../services/contract.service', () => ({
	getContractsByPeriod: mockGetContractsByPeriod
}));

// Mock the heating profile service
const mockGetHeatingProfile = mock(() => Promise.resolve(null));
const mockCalculateHeatingShare = mock(() => ({
	share: 0,
	percentage: 0,
	monthBreakdown: []
}));

mock.module('../services/heating-profile.service', () => ({
	getHeatingProfile: mockGetHeatingProfile,
	calculateHeatingShare: mockCalculateHeatingShare
}));

// Now import the service under test
import {
	handleMultipleContracts,
	handleMidYearMoves,
	calculateApartmentProrating
} from '../services/prorating.service';

describe('Prorating Service - Async Functions', () => {
	beforeEach(() => {
		mockGetContractsByPeriod.mockClear();
		mockGetHeatingProfile.mockClear();
		mockCalculateHeatingShare.mockClear();
	});

	describe('handleMultipleContracts', () => {
		it('should return empty array when no contracts exist', async () => {
			mockGetContractsByPeriod.mockResolvedValue([]);

			const result = await handleMultipleContracts(
				'apt-1',
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);

			expect(result).toHaveLength(0);
			expect(mockGetContractsByPeriod).toHaveBeenCalledTimes(1);
		});

		it('should calculate overlap for single contract', async () => {
			mockGetContractsByPeriod.mockResolvedValue([
				{
					id: 'contract-1',
					startDate: '2024-01-01',
					endDate: '2024-12-31'
				}
			]);

			const result = await handleMultipleContracts(
				'apt-1',
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);

			expect(result).toHaveLength(1);
			expect(result[0].overlapDays).toBe(366); // 2024 is a leap year
			expect(result[0].shareOfPeriod).toBe(1);
		});

		it('should calculate overlap for contract without end date', async () => {
			mockGetContractsByPeriod.mockResolvedValue([
				{
					id: 'contract-1',
					startDate: '2024-06-01',
					endDate: null
				}
			]);

			const result = await handleMultipleContracts(
				'apt-1',
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);

			expect(result).toHaveLength(1);
			expect(result[0].overlapDays).toBe(214); // Jun 1 - Dec 31
		});

		it('should handle multiple contracts with overlaps', async () => {
			mockGetContractsByPeriod.mockResolvedValue([
				{
					id: 'contract-1',
					startDate: '2024-01-01',
					endDate: '2024-03-31'
				},
				{
					id: 'contract-2',
					startDate: '2024-04-01',
					endDate: '2024-12-31'
				}
			]);

			const result = await handleMultipleContracts(
				'apt-1',
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);

			expect(result).toHaveLength(2);
			expect(result[0].overlapDays + result[1].overlapDays).toBe(366);
		});

		it('should exclude contracts outside period', async () => {
			mockGetContractsByPeriod.mockResolvedValue([
				{
					id: 'contract-1',
					startDate: '2023-01-01',
					endDate: '2023-12-31'
				}
			]);

			const result = await handleMultipleContracts(
				'apt-1',
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);

			expect(result).toHaveLength(0);
		});
	});

	describe('handleMidYearMoves', () => {
		it('should fallback to day-based prorating when profile not found', async () => {
			mockGetHeatingProfile.mockResolvedValue(null);

			const result = await handleMidYearMoves(
				'profile-1',
				new Date('2024-07-01'),
				null,
				new Date('2024-01-01'),
				new Date('2024-12-31'),
				10000
			);

			expect(result.share).toBeGreaterThan(0);
			expect(result.monthBreakdown).toHaveLength(0);
		});

		it('should return zero when contract is outside period', async () => {
			mockGetHeatingProfile.mockResolvedValue(null);

			const result = await handleMidYearMoves(
				'profile-1',
				new Date('2023-01-01'),
				new Date('2023-12-31'),
				new Date('2024-01-01'),
				new Date('2024-12-31'),
				10000
			);

			expect(result.share).toBe(0);
			expect(result.percentage).toBe(0);
		});

		it('should use heating profile when available', async () => {
			const mockProfile = {
				id: 'profile-1',
				name: 'Test Profile',
				januaryPct: '17',
				februaryPct: '14',
				marchPct: '12',
				aprilPct: '7',
				mayPct: '2',
				junePct: '0',
				julyPct: '0',
				augustPct: '0',
				septemberPct: '2',
				octoberPct: '8',
				novemberPct: '14',
				decemberPct: '24'
			};

			mockGetHeatingProfile.mockResolvedValue(mockProfile);
			mockCalculateHeatingShare.mockReturnValue({
				share: 4600,
				percentage: 46,
				monthBreakdown: [
					{ month: 10, percentage: 8 },
					{ month: 11, percentage: 14 },
					{ month: 12, percentage: 24 }
				]
			});

			const result = await handleMidYearMoves(
				'profile-1',
				new Date('2024-10-01'),
				new Date('2024-12-31'),
				new Date('2024-01-01'),
				new Date('2024-12-31'),
				10000
			);

			expect(result.share).toBe(4600);
			expect(result.percentage).toBe(46);
			expect(result.monthBreakdown).toHaveLength(3);
		});

		it('should handle contract spanning period boundaries', async () => {
			mockGetHeatingProfile.mockResolvedValue(null);

			const result = await handleMidYearMoves(
				'profile-1',
				new Date('2023-06-01'),
				new Date('2025-06-30'),
				new Date('2024-01-01'),
				new Date('2024-12-31'),
				10000
			);

			// Full year coverage
			expect(result.percentage).toBeCloseTo(100, 0);
		});
	});

	describe('calculateApartmentProrating', () => {
		it('should return complete prorating result', async () => {
			mockGetContractsByPeriod.mockResolvedValue([
				{
					id: 'contract-1',
					startDate: '2024-03-01',
					endDate: '2024-09-30'
				}
			]);

			const result = await calculateApartmentProrating(
				'apt-1',
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);

			expect(result.apartmentId).toBe('apt-1');
			expect(result.totalPeriodDays).toBe(366);
			expect(result.contracts).toHaveLength(1);
			expect(result.vacancy).toBeDefined();
			expect(result.occupancyRate).toBeLessThan(1);
		});

		it('should calculate correct occupancy rate', async () => {
			mockGetContractsByPeriod.mockResolvedValue([
				{
					id: 'contract-1',
					startDate: '2024-01-01',
					endDate: '2024-06-30'
				}
			]);

			const result = await calculateApartmentProrating(
				'apt-1',
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);

			expect(result.occupancyRate).toBeCloseTo(0.497, 2); // ~182/366
		});

		it('should identify vacancy periods', async () => {
			mockGetContractsByPeriod.mockResolvedValue([
				{
					id: 'contract-1',
					startDate: '2024-04-01',
					endDate: '2024-09-30'
				}
			]);

			const result = await calculateApartmentProrating(
				'apt-1',
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);

			expect(result.vacancy.vacantPeriods.length).toBeGreaterThan(0);
			expect(result.vacancy.totalVacantDays).toBeGreaterThan(0);
		});

		it('should handle fully vacant apartment', async () => {
			mockGetContractsByPeriod.mockResolvedValue([]);

			const result = await calculateApartmentProrating(
				'apt-1',
				new Date('2024-01-01'),
				new Date('2024-12-31')
			);

			expect(result.occupancyRate).toBe(0);
			expect(result.occupiedDays).toBe(0);
			expect(result.vacancy.totalVacantDays).toBe(366);
		});
	});
});
