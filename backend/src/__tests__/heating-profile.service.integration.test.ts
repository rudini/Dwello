/**
 * Integration tests for heating profile service database functions
 * Uses mocked database dependencies
 */

import { describe, it, expect, mock, beforeEach } from 'bun:test';

// Mock the database connection
const mockDbSelect = mock(() => ({
	from: mock(() => ({
		where: mock(() => ({
			limit: mock(() => Promise.resolve([]))
		})),
		orderBy: mock(() => ({
			limit: mock(() => ({
				offset: mock(() => Promise.resolve([]))
			}))
		})),
		limit: mock(() => ({
			offset: mock(() => Promise.resolve([]))
		}))
	}))
}));

const mockDbInsert = mock(() => ({
	values: mock(() => ({
		returning: mock(() => Promise.resolve([{ id: 'new-id' }]))
	}))
}));

const mockDbUpdate = mock(() => ({
	set: mock(() => ({
		where: mock(() => ({
			returning: mock(() => Promise.resolve([]))
		}))
	}))
}));

const mockDbDelete = mock(() => ({
	where: mock(() => Promise.resolve())
}));

mock.module('../db/connection', () => ({
	db: {
		select: mockDbSelect,
		insert: mockDbInsert,
		update: mockDbUpdate,
		delete: mockDbDelete
	}
}));

// Import for type testing
import type { HeatingProfile } from '../db/schema';
import {
	PREDEFINED_HEATING_PROFILES,
	validatePercentages,
	getMonthlyPercentage,
	getMonthlyPercentages,
	calculateHeatingShare,
	type MonthlyPercentages
} from '../services/heating-profile.service';

describe('Heating Profile Service - Database Functions (Mocked)', () => {
	beforeEach(() => {
		mockDbSelect.mockClear();
		mockDbInsert.mockClear();
		mockDbUpdate.mockClear();
		mockDbDelete.mockClear();
	});

	describe('PREDEFINED_HEATING_PROFILES structure', () => {
		it('should have correct structure for database insertion', () => {
			for (const profile of PREDEFINED_HEATING_PROFILES) {
				expect(profile.name).toBeDefined();
				expect(profile.type).toBe('predefined');
				expect(profile.januaryPct).toBeDefined();
				expect(profile.februaryPct).toBeDefined();
				expect(profile.marchPct).toBeDefined();
				expect(profile.aprilPct).toBeDefined();
				expect(profile.mayPct).toBeDefined();
				expect(profile.junePct).toBeDefined();
				expect(profile.julyPct).toBeDefined();
				expect(profile.augustPct).toBeDefined();
				expect(profile.septemberPct).toBeDefined();
				expect(profile.octoberPct).toBeDefined();
				expect(profile.novemberPct).toBeDefined();
				expect(profile.decemberPct).toBeDefined();
			}
		});

		it('should not include id, createdAt, updatedAt', () => {
			for (const profile of PREDEFINED_HEATING_PROFILES) {
				expect((profile as Record<string, unknown>).id).toBeUndefined();
				expect((profile as Record<string, unknown>).createdAt).toBeUndefined();
				expect((profile as Record<string, unknown>).updatedAt).toBeUndefined();
			}
		});

		it('should have string percentage values for database storage', () => {
			for (const profile of PREDEFINED_HEATING_PROFILES) {
				expect(typeof profile.januaryPct).toBe('string');
				expect(typeof profile.decemberPct).toBe('string');
			}
		});
	});

	describe('validatePercentages with various distributions', () => {
		it('should validate standard Mittelland distribution', () => {
			const mittelland = PREDEFINED_HEATING_PROFILES.find(p => p.name.includes('Mittelland'));
			const percentages: MonthlyPercentages = {
				january: parseFloat(mittelland!.januaryPct),
				february: parseFloat(mittelland!.februaryPct),
				march: parseFloat(mittelland!.marchPct),
				april: parseFloat(mittelland!.aprilPct),
				may: parseFloat(mittelland!.mayPct),
				june: parseFloat(mittelland!.junePct),
				july: parseFloat(mittelland!.julyPct),
				august: parseFloat(mittelland!.augustPct),
				september: parseFloat(mittelland!.septemberPct),
				october: parseFloat(mittelland!.octoberPct),
				november: parseFloat(mittelland!.novemberPct),
				december: parseFloat(mittelland!.decemberPct)
			};

			const result = validatePercentages(percentages);
			expect(result.isValid).toBe(true);
		});

		it('should validate Bergregion distribution', () => {
			const bergregion = PREDEFINED_HEATING_PROFILES.find(p => p.name === 'Bergregion');
			const percentages: MonthlyPercentages = {
				january: parseFloat(bergregion!.januaryPct),
				february: parseFloat(bergregion!.februaryPct),
				march: parseFloat(bergregion!.marchPct),
				april: parseFloat(bergregion!.aprilPct),
				may: parseFloat(bergregion!.mayPct),
				june: parseFloat(bergregion!.junePct),
				july: parseFloat(bergregion!.julyPct),
				august: parseFloat(bergregion!.augustPct),
				september: parseFloat(bergregion!.septemberPct),
				october: parseFloat(bergregion!.octoberPct),
				november: parseFloat(bergregion!.novemberPct),
				december: parseFloat(bergregion!.decemberPct)
			};

			const result = validatePercentages(percentages);
			expect(result.isValid).toBe(true);
		});

		it('should validate Tessin distribution', () => {
			const tessin = PREDEFINED_HEATING_PROFILES.find(p => p.name === 'Tessin');
			const percentages: MonthlyPercentages = {
				january: parseFloat(tessin!.januaryPct),
				february: parseFloat(tessin!.februaryPct),
				march: parseFloat(tessin!.marchPct),
				april: parseFloat(tessin!.aprilPct),
				may: parseFloat(tessin!.mayPct),
				june: parseFloat(tessin!.junePct),
				july: parseFloat(tessin!.julyPct),
				august: parseFloat(tessin!.augustPct),
				september: parseFloat(tessin!.septemberPct),
				october: parseFloat(tessin!.octoberPct),
				november: parseFloat(tessin!.novemberPct),
				december: parseFloat(tessin!.decemberPct)
			};

			const result = validatePercentages(percentages);
			expect(result.isValid).toBe(true);
		});

		it('should validate Warmwasser distribution', () => {
			const warmwasser = PREDEFINED_HEATING_PROFILES.find(p => p.name.includes('Warmwasser'));
			const percentages: MonthlyPercentages = {
				january: parseFloat(warmwasser!.januaryPct),
				february: parseFloat(warmwasser!.februaryPct),
				march: parseFloat(warmwasser!.marchPct),
				april: parseFloat(warmwasser!.aprilPct),
				may: parseFloat(warmwasser!.mayPct),
				june: parseFloat(warmwasser!.junePct),
				july: parseFloat(warmwasser!.julyPct),
				august: parseFloat(warmwasser!.augustPct),
				september: parseFloat(warmwasser!.septemberPct),
				october: parseFloat(warmwasser!.octoberPct),
				november: parseFloat(warmwasser!.novemberPct),
				december: parseFloat(warmwasser!.decemberPct)
			};

			const result = validatePercentages(percentages);
			expect(result.isValid).toBe(true);
		});
	});

	describe('calculateHeatingShare with predefined profiles', () => {
		// Create a mock profile from Mittelland data
		const createMittellandProfile = (): HeatingProfile => {
			const mittelland = PREDEFINED_HEATING_PROFILES.find(p => p.name.includes('Mittelland'))!;
			return {
				id: 'mittelland-1',
				name: mittelland.name,
				nameDE: mittelland.nameDE ?? null,
				nameFR: mittelland.nameFR ?? null,
				nameIT: mittelland.nameIT ?? null,
				nameEN: mittelland.nameEN ?? null,
				type: mittelland.type ?? 'predefined',
				description: mittelland.description ?? null,
				januaryPct: mittelland.januaryPct,
				februaryPct: mittelland.februaryPct,
				marchPct: mittelland.marchPct,
				aprilPct: mittelland.aprilPct,
				mayPct: mittelland.mayPct,
				junePct: mittelland.junePct,
				julyPct: mittelland.julyPct,
				augustPct: mittelland.augustPct,
				septemberPct: mittelland.septemberPct,
				octoberPct: mittelland.octoberPct,
				novemberPct: mittelland.novemberPct,
				decemberPct: mittelland.decemberPct,
				createdAt: new Date(),
				updatedAt: new Date()
			};
		};

		it('should calculate winter quarter correctly for Mittelland', () => {
			const profile = createMittellandProfile();
			// Oct 8% + Nov 14% + Dec 24% = 46%
			const result = calculateHeatingShare(
				profile,
				new Date('2024-10-01'),
				new Date('2024-12-31'),
				10000
			);

			expect(result.percentage).toBeCloseTo(46, 1);
			expect(result.share).toBeCloseTo(4600, 100);
		});

		it('should calculate summer months as zero for Mittelland', () => {
			const profile = createMittellandProfile();
			// Jun 0% + Jul 0% + Aug 0% = 0%
			const result = calculateHeatingShare(
				profile,
				new Date('2024-06-01'),
				new Date('2024-08-31'),
				10000
			);

			expect(result.percentage).toBeCloseTo(0, 1);
			expect(result.share).toBeCloseTo(0, 10);
		});

		it('should calculate first quarter correctly for Mittelland', () => {
			const profile = createMittellandProfile();
			// Jan 17% + Feb 14% + Mar 12% = 43%
			const result = calculateHeatingShare(
				profile,
				new Date('2024-01-01'),
				new Date('2024-03-31'),
				10000
			);

			expect(result.percentage).toBeCloseTo(43, 1);
			expect(result.share).toBeCloseTo(4300, 100);
		});
	});

	describe('getMonthlyPercentage with predefined profile data', () => {
		const createTestProfile = (): HeatingProfile => ({
			id: 'test-1',
			name: 'Test',
			nameDE: 'Test DE',
			nameFR: 'Test FR',
			nameIT: 'Test IT',
			nameEN: 'Test EN',
			type: 'custom',
			description: 'Test',
			januaryPct: '10',
			februaryPct: '11',
			marchPct: '12',
			aprilPct: '8',
			mayPct: '5',
			junePct: '2',
			julyPct: '1',
			augustPct: '2',
			septemberPct: '5',
			octoberPct: '10',
			novemberPct: '14',
			decemberPct: '20',
			createdAt: new Date(),
			updatedAt: new Date()
		});

		it('should return correct value for each month', () => {
			const profile = createTestProfile();

			expect(getMonthlyPercentage(profile, 1)).toBe(10);
			expect(getMonthlyPercentage(profile, 2)).toBe(11);
			expect(getMonthlyPercentage(profile, 3)).toBe(12);
			expect(getMonthlyPercentage(profile, 4)).toBe(8);
			expect(getMonthlyPercentage(profile, 5)).toBe(5);
			expect(getMonthlyPercentage(profile, 6)).toBe(2);
			expect(getMonthlyPercentage(profile, 7)).toBe(1);
			expect(getMonthlyPercentage(profile, 8)).toBe(2);
			expect(getMonthlyPercentage(profile, 9)).toBe(5);
			expect(getMonthlyPercentage(profile, 10)).toBe(10);
			expect(getMonthlyPercentage(profile, 11)).toBe(14);
			expect(getMonthlyPercentage(profile, 12)).toBe(20);
		});
	});

	describe('getMonthlyPercentages with predefined profile data', () => {
		const createTestProfile = (): HeatingProfile => ({
			id: 'test-1',
			name: 'Test',
			nameDE: 'Test DE',
			nameFR: 'Test FR',
			nameIT: 'Test IT',
			nameEN: 'Test EN',
			type: 'custom',
			description: 'Test',
			januaryPct: '10.5',
			februaryPct: '11.5',
			marchPct: '12.0',
			aprilPct: '8.0',
			mayPct: '5.0',
			junePct: '2.0',
			julyPct: '1.0',
			augustPct: '2.0',
			septemberPct: '5.0',
			octoberPct: '10.0',
			novemberPct: '14.0',
			decemberPct: '19.0',
			createdAt: new Date(),
			updatedAt: new Date()
		});

		it('should return object with all months', () => {
			const profile = createTestProfile();
			const percentages = getMonthlyPercentages(profile);

			expect(percentages.january).toBe(10.5);
			expect(percentages.february).toBe(11.5);
			expect(percentages.march).toBe(12.0);
			expect(percentages.april).toBe(8.0);
			expect(percentages.may).toBe(5.0);
			expect(percentages.june).toBe(2.0);
			expect(percentages.july).toBe(1.0);
			expect(percentages.august).toBe(2.0);
			expect(percentages.september).toBe(5.0);
			expect(percentages.october).toBe(10.0);
			expect(percentages.november).toBe(14.0);
			expect(percentages.december).toBe(19.0);
		});

		it('should handle decimal percentage values', () => {
			const profile = createTestProfile();
			const percentages = getMonthlyPercentages(profile);

			expect(percentages.january).toBe(10.5);
			expect(typeof percentages.january).toBe('number');
		});
	});
});
