/**
 * Database function tests for heating profile service
 * Tests CRUD operations with mocked database
 */

import { describe, it, expect, mock, beforeEach } from 'bun:test';

// Create mock query builders that handle chaining properly
const createChainedMock = (returnValue: any = []) => {
	const chainMock: any = {
		from: mock(() => chainMock),
		where: mock(() => chainMock),
		orderBy: mock(() => chainMock),
		limit: mock(() => chainMock),
		offset: mock(() => chainMock),
		set: mock(() => chainMock),
		values: mock(() => chainMock),
		returning: mock(() => Promise.resolve(returnValue)),
		// Make the mock thenable for async/await
		then: (resolve: any, reject?: any) => {
			return Promise.resolve(returnValue).then(resolve, reject);
		}
	};
	return chainMock;
};

// Track select call results
let selectResults: any[] = [];
let selectCallCount = 0;

const mockSelect = mock(() => {
	const result = selectResults[selectCallCount] ?? [];
	selectCallCount++;
	return createChainedMock(result);
});

const mockInsert = mock(() => createChainedMock([{ id: 'new-id' }]));
const mockUpdate = mock(() => createChainedMock([]));
const mockDelete = mock(() => createChainedMock());

// Mock the database module
mock.module('../db/connection', () => ({
	db: {
		select: mockSelect,
		insert: mockInsert,
		update: mockUpdate,
		delete: mockDelete
	}
}));

// Mock the schema module
mock.module('../db/schema', () => ({
	heatingProfiles: {
		id: 'id',
		name: 'name',
		type: 'type'
	}
}));

// Import service functions after mocking
import {
	getHeatingProfile,
	getHeatingProfileByName,
	createHeatingProfile,
	deleteHeatingProfile,
	heatingProfileExists,
	PREDEFINED_HEATING_PROFILES
} from '../services/heating-profile.service';

describe('Heating Profile Service - Database Operations', () => {
	beforeEach(() => {
		selectResults = [];
		selectCallCount = 0;
		mockSelect.mockClear();
		mockInsert.mockClear();
		mockUpdate.mockClear();
		mockDelete.mockClear();
	});

	describe('getHeatingProfile', () => {
		it('should return null when profile not found', async () => {
			selectResults = [[]];

			const result = await getHeatingProfile('nonexistent-id');

			expect(result).toBeNull();
		});

		it('should return profile when found', async () => {
			const mockProfile = { id: 'test-id', name: 'Test Profile' };
			selectResults = [[mockProfile]];

			const result = await getHeatingProfile('test-id');

			expect(result).toEqual(mockProfile);
		});
	});

	describe('getHeatingProfileByName', () => {
		it('should return null when profile not found', async () => {
			selectResults = [[]];

			const result = await getHeatingProfileByName('Nonexistent');

			expect(result).toBeNull();
		});

		it('should return profile when found by name', async () => {
			const mockProfile = { id: 'test-id', name: 'Mittelland' };
			selectResults = [[mockProfile]];

			const result = await getHeatingProfileByName('Mittelland');

			expect(result).toEqual(mockProfile);
		});
	});

	describe('createHeatingProfile', () => {
		it('should throw error for duplicate name', async () => {
			// Return existing profile for name check
			selectResults = [[{ id: 'existing', name: 'Existing' }]];

			const profile = {
				name: 'Existing',
				nameDE: 'Existing DE',
				nameFR: 'Existing FR',
				nameIT: 'Existing IT',
				nameEN: 'Existing EN',
				type: 'custom' as const,
				description: 'Test',
				januaryPct: '17.00',
				februaryPct: '14.00',
				marchPct: '12.00',
				aprilPct: '7.00',
				mayPct: '2.00',
				junePct: '0.00',
				julyPct: '0.00',
				augustPct: '0.00',
				septemberPct: '2.00',
				octoberPct: '8.00',
				novemberPct: '14.00',
				decemberPct: '24.00'
			};

			await expect(createHeatingProfile(profile)).rejects.toThrow('already exists');
		});

		it('should throw error for invalid percentages', async () => {
			// No duplicate name found
			selectResults = [[]];

			const profile = {
				name: 'New Profile',
				nameDE: 'Neues Profil',
				nameFR: 'Nouveau Profil',
				nameIT: 'Nuovo Profilo',
				nameEN: 'New Profile',
				type: 'custom' as const,
				description: 'Test',
				januaryPct: '50.00', // Way too high
				februaryPct: '50.00',
				marchPct: '50.00',
				aprilPct: '50.00',
				mayPct: '50.00',
				junePct: '50.00',
				julyPct: '50.00',
				augustPct: '50.00',
				septemberPct: '50.00',
				octoberPct: '50.00',
				novemberPct: '50.00',
				decemberPct: '50.00'
			};

			await expect(createHeatingProfile(profile)).rejects.toThrow('must sum to 100%');
		});

		it('should create valid profile', async () => {
			// No duplicate found
			selectResults = [[]];

			const profile = {
				name: 'New Profile',
				nameDE: 'Neues Profil',
				nameFR: 'Nouveau Profil',
				nameIT: 'Nuovo Profilo',
				nameEN: 'New Profile',
				type: 'custom' as const,
				description: 'Test',
				januaryPct: '17.00',
				februaryPct: '14.00',
				marchPct: '12.00',
				aprilPct: '7.00',
				mayPct: '2.00',
				junePct: '0.00',
				julyPct: '0.00',
				augustPct: '0.00',
				septemberPct: '2.00',
				octoberPct: '8.00',
				novemberPct: '14.00',
				decemberPct: '24.00'
			};

			const result = await createHeatingProfile(profile);

			expect(result).toHaveProperty('id');
		});
	});

	describe('deleteHeatingProfile', () => {
		it('should return error for nonexistent profile', async () => {
			selectResults = [[]];

			const result = await deleteHeatingProfile('nonexistent');

			expect(result.success).toBe(false);
			expect(result.error).toContain('not found');
		});

		it('should return error when trying to delete predefined profile', async () => {
			selectResults = [[{ id: 'pred-id', type: 'predefined' }]];

			const result = await deleteHeatingProfile('pred-id');

			expect(result.success).toBe(false);
			expect(result.error).toContain('predefined');
		});

		it('should delete custom profile successfully', async () => {
			selectResults = [[{ id: 'custom-id', type: 'custom' }]];

			const result = await deleteHeatingProfile('custom-id');

			expect(result.success).toBe(true);
		});
	});

	describe('heatingProfileExists', () => {
		it('should return false when profile does not exist', async () => {
			selectResults = [[]];

			const result = await heatingProfileExists('nonexistent');

			expect(result).toBe(false);
		});

		it('should return true when profile exists', async () => {
			selectResults = [[{ id: 'existing-id' }]];

			const result = await heatingProfileExists('existing-id');

			expect(result).toBe(true);
		});
	});

	describe('PREDEFINED_HEATING_PROFILES', () => {
		it('should have all required profiles', () => {
			const profileNames = PREDEFINED_HEATING_PROFILES.map(p => p.name);

			expect(profileNames.some(n => n.includes('Mittelland'))).toBe(true);
			expect(profileNames.some(n => n === 'Bergregion')).toBe(true);
			expect(profileNames.some(n => n === 'Tessin')).toBe(true);
			expect(profileNames.some(n => n.includes('Warmwasser'))).toBe(true);
		});

		it('should have valid percentage sums', () => {
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
});
