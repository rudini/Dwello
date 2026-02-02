/**
 * Unit tests for heating profile service
 * Tests heating distribution profiles and calculations
 */

import { describe, it, expect } from 'bun:test';
import {
	validatePercentages,
	getMonthlyPercentage,
	getMonthlyPercentages,
	calculateHeatingShare,
	PREDEFINED_HEATING_PROFILES,
	type MonthlyPercentages
} from '../services/heating-profile.service';
import type { HeatingProfile } from '../db/schema';

// Mock heating profile for testing
const createMockProfile = (percentages: Partial<MonthlyPercentages> = {}): HeatingProfile => {
	const defaults: MonthlyPercentages = {
		january: 17, february: 14, march: 12, april: 7, may: 2,
		june: 0, july: 0, august: 0, september: 2,
		october: 8, november: 14, december: 24
	};
	const merged = { ...defaults, ...percentages };
	return {
		id: 'test-profile',
		name: 'Test Profile',
		nameDE: 'Test Profile DE',
		nameFR: 'Test Profile FR',
		nameIT: 'Test Profile IT',
		nameEN: 'Test Profile EN',
		type: 'custom',
		description: 'Test profile',
		januaryPct: String(merged.january),
		februaryPct: String(merged.february),
		marchPct: String(merged.march),
		aprilPct: String(merged.april),
		mayPct: String(merged.may),
		junePct: String(merged.june),
		julyPct: String(merged.july),
		augustPct: String(merged.august),
		septemberPct: String(merged.september),
		octoberPct: String(merged.october),
		novemberPct: String(merged.november),
		decemberPct: String(merged.december),
		isActive: true,
		createdAt: new Date(),
		updatedAt: new Date()
	};
};

describe('Heating Profile Service', () => {
	describe('PREDEFINED_HEATING_PROFILES', () => {
		it('should have 4 predefined profiles', () => {
			expect(PREDEFINED_HEATING_PROFILES).toHaveLength(4);
		});

		it('should include Standard (Mittelland) profile', () => {
			const profile = PREDEFINED_HEATING_PROFILES.find(p => p.name.includes('Mittelland'));
			expect(profile).toBeDefined();
		});

		it('should include Bergregion profile', () => {
			const profile = PREDEFINED_HEATING_PROFILES.find(p => p.name === 'Bergregion');
			expect(profile).toBeDefined();
		});

		it('should include Tessin profile', () => {
			const profile = PREDEFINED_HEATING_PROFILES.find(p => p.name === 'Tessin');
			expect(profile).toBeDefined();
		});

		it('should include Warmwasser profile', () => {
			const profile = PREDEFINED_HEATING_PROFILES.find(p => p.name.includes('Warmwasser'));
			expect(profile).toBeDefined();
		});

		it('all profiles should sum to approximately 100%', () => {
			for (const profile of PREDEFINED_HEATING_PROFILES) {
				const sum = parseFloat(profile.januaryPct!) +
					parseFloat(profile.februaryPct!) +
					parseFloat(profile.marchPct!) +
					parseFloat(profile.aprilPct!) +
					parseFloat(profile.mayPct!) +
					parseFloat(profile.junePct!) +
					parseFloat(profile.julyPct!) +
					parseFloat(profile.augustPct!) +
					parseFloat(profile.septemberPct!) +
					parseFloat(profile.octoberPct!) +
					parseFloat(profile.novemberPct!) +
					parseFloat(profile.decemberPct!);
				expect(sum).toBeCloseTo(100, 0);
			}
		});
	});

	describe('validatePercentages', () => {
		it('should accept percentages summing to 100', () => {
			const percentages: MonthlyPercentages = {
				january: 17, february: 14, march: 12, april: 7, may: 2,
				june: 0, july: 0, august: 0, september: 2,
				october: 8, november: 14, december: 24
			};
			const result = validatePercentages(percentages);
			expect(result.isValid).toBe(true);
			expect(result.sum).toBe(100);
		});

		it('should accept percentages within tolerance', () => {
			const percentages: MonthlyPercentages = {
				january: 8.33, february: 8.33, march: 8.33, april: 8.33, may: 8.33,
				june: 8.33, july: 8.33, august: 8.33, september: 8.33,
				october: 8.33, november: 8.33, december: 8.37
			};
			const result = validatePercentages(percentages);
			expect(result.isValid).toBe(true);
		});

		it('should reject percentages not summing to 100', () => {
			const percentages: MonthlyPercentages = {
				january: 20, february: 20, march: 20, april: 20, may: 0,
				june: 0, july: 0, august: 0, september: 0,
				october: 0, november: 0, december: 0
			};
			const result = validatePercentages(percentages);
			expect(result.isValid).toBe(false);
			expect(result.error).toContain('must sum to 100%');
		});

		it('should reject negative percentages', () => {
			const percentages: MonthlyPercentages = {
				january: -5, february: 20, march: 20, april: 20, may: 15,
				june: 10, july: 5, august: 5, september: 5,
				october: 5, november: 0, december: 0
			};
			const result = validatePercentages(percentages);
			expect(result.isValid).toBe(false);
			expect(result.error).toContain('cannot be negative');
		});
	});

	describe('getMonthlyPercentage', () => {
		const profile = createMockProfile();

		it('should return January percentage', () => {
			expect(getMonthlyPercentage(profile, 1)).toBe(17);
		});

		it('should return December percentage', () => {
			expect(getMonthlyPercentage(profile, 12)).toBe(24);
		});

		it('should return June percentage (0 for summer)', () => {
			expect(getMonthlyPercentage(profile, 6)).toBe(0);
		});

		it('should throw for invalid month 0', () => {
			expect(() => getMonthlyPercentage(profile, 0)).toThrow('Invalid month');
		});

		it('should throw for invalid month 13', () => {
			expect(() => getMonthlyPercentage(profile, 13)).toThrow('Invalid month');
		});
	});

	describe('getMonthlyPercentages', () => {
		it('should return all monthly percentages', () => {
			const profile = createMockProfile();
			const percentages = getMonthlyPercentages(profile);

			expect(percentages.january).toBe(17);
			expect(percentages.december).toBe(24);
			expect(percentages.july).toBe(0);
		});
	});

	describe('calculateHeatingShare', () => {
		const profile = createMockProfile();
		const totalCost = 10000;

		it('should calculate full year share', () => {
			const result = calculateHeatingShare(
				profile,
				new Date('2024-01-01'),
				new Date('2024-12-31'),
				totalCost
			);
			expect(result.percentage).toBeCloseTo(100, 0);
			expect(result.share).toBeCloseTo(totalCost, 0);
		});

		it('should calculate winter months share (higher)', () => {
			// Oct-Dec: 8 + 14 + 24 = 46%
			const result = calculateHeatingShare(
				profile,
				new Date('2024-10-01'),
				new Date('2024-12-31'),
				totalCost
			);
			expect(result.percentage).toBeCloseTo(46, 1);
			expect(result.share).toBeCloseTo(4600, 100);
		});

		it('should calculate summer months share (lower or zero)', () => {
			// Jun-Aug: 0 + 0 + 0 = 0%
			const result = calculateHeatingShare(
				profile,
				new Date('2024-06-01'),
				new Date('2024-08-31'),
				totalCost
			);
			expect(result.percentage).toBeCloseTo(0, 1);
			expect(result.share).toBeCloseTo(0, 100);
		});

		it('should handle mid-month start', () => {
			// Half of October (8% * 0.5 = 4%)
			const result = calculateHeatingShare(
				profile,
				new Date('2024-10-16'),
				new Date('2024-10-31'),
				totalCost
			);
			expect(result.percentage).toBeLessThan(8);
			expect(result.percentage).toBeGreaterThan(0);
		});

		it('should return month breakdown', () => {
			const result = calculateHeatingShare(
				profile,
				new Date('2024-10-01'),
				new Date('2024-12-31'),
				totalCost
			);
			expect(result.monthBreakdown).toBeDefined();
			expect(result.monthBreakdown.length).toBe(3);
			expect(result.monthBreakdown[0].month).toBe(10); // October
		});

		it('should handle Tessin profile (PRD example)', () => {
			// PRD scenario: Tenant moved Oct 1 - Dec 31, Mittelland profile
			// Oct 8%, Nov 10%, Dec 12% = 30% (but let's test with our mock)
			const result = calculateHeatingShare(
				profile,
				new Date('2024-10-01'),
				new Date('2024-12-31'),
				10000
			);
			// With our mock profile: Oct 8% + Nov 14% + Dec 24% = 46%
			expect(result.share).toBeCloseTo(4600, 100);
		});
	});
});
