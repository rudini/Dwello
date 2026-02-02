import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	computeAvailability,
	checkDateRangeOverlap,
	type ContractForAvailability
} from '../contract-availability';

describe('computeAvailability', () => {
	beforeEach(() => {
		// Mock current date to 2026-01-15
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-15'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns fully available when no contracts exist', () => {
		const result = computeAvailability([]);

		expect(result).toEqual({
			isAvailable: true,
			availableFrom: null,
			hasOngoingContract: false,
			message: 'Wohnung verfügbar',
			statusType: 'available'
		});
	});

	it('returns blocked when there is an ongoing unlimited contract', () => {
		const contracts: ContractForAvailability[] = [
			{
				id: 'contract-1',
				start_date: '2025-06-01',
				end_date: null,
				status: 'Aktiv'
			}
		];

		const result = computeAvailability(contracts);

		expect(result.isAvailable).toBe(false);
		expect(result.hasOngoingContract).toBe(true);
		expect(result.statusType).toBe('blocked');
		expect(result.message).toContain('unbefristeter Vertrag');
	});

	it('returns available from date when contract has ended', () => {
		const contracts: ContractForAvailability[] = [
			{
				id: 'contract-1',
				start_date: '2025-01-01',
				end_date: '2025-12-31',
				status: 'Beendet'
			}
		];

		const result = computeAvailability(contracts);

		expect(result.isAvailable).toBe(true);
		expect(result.availableFrom).toBe(null); // Already in the past
		expect(result.hasOngoingContract).toBe(false);
		expect(result.statusType).toBe('available');
	});

	it('returns available from future date when contract ends in future', () => {
		const contracts: ContractForAvailability[] = [
			{
				id: 'contract-1',
				start_date: '2025-01-01',
				end_date: '2026-03-31',
				status: 'Aktiv'
			}
		];

		const result = computeAvailability(contracts);

		expect(result.isAvailable).toBe(true);
		expect(result.availableFrom).toBe('2026-04-01');
		expect(result.hasOngoingContract).toBe(false);
		expect(result.statusType).toBe('available-from');
		expect(result.message).toContain('01.04.2026');
	});

	it('excludes contract by ID when editing', () => {
		const contracts: ContractForAvailability[] = [
			{
				id: 'contract-1',
				start_date: '2025-06-01',
				end_date: null,
				status: 'Aktiv'
			}
		];

		const result = computeAvailability(contracts, 'contract-1');

		// Should be available because the only contract is excluded
		expect(result.isAvailable).toBe(true);
		expect(result.hasOngoingContract).toBe(false);
		expect(result.statusType).toBe('available');
	});

	it('handles multiple contracts and returns latest end date', () => {
		const contracts: ContractForAvailability[] = [
			{
				id: 'contract-1',
				start_date: '2024-01-01',
				end_date: '2024-12-31',
				status: 'Beendet'
			},
			{
				id: 'contract-2',
				start_date: '2025-01-01',
				end_date: '2026-06-30',
				status: 'Aktiv'
			}
		];

		const result = computeAvailability(contracts);

		expect(result.isAvailable).toBe(true);
		expect(result.availableFrom).toBe('2026-07-01');
		expect(result.statusType).toBe('available-from');
	});

	it('handles Date objects as well as strings', () => {
		const contracts: ContractForAvailability[] = [
			{
				id: 'contract-1',
				start_date: new Date('2025-01-01'),
				end_date: new Date('2026-02-28'),
				status: 'Aktiv'
			}
		];

		const result = computeAvailability(contracts);

		expect(result.isAvailable).toBe(true);
		expect(result.availableFrom).toBe('2026-03-01');
	});
});

describe('checkDateRangeOverlap', () => {
	it('returns no overlap when no contracts exist', () => {
		const result = checkDateRangeOverlap('2026-01-01', '2026-12-31', []);

		expect(result.hasOverlap).toBe(false);
		expect(result.message).toBeNull();
	});

	it('detects overlap with existing fixed-term contract', () => {
		const contracts: ContractForAvailability[] = [
			{
				id: 'contract-1',
				start_date: '2026-03-01',
				end_date: '2026-08-31',
				status: 'Aktiv'
			}
		];

		const result = checkDateRangeOverlap('2026-06-01', '2026-12-31', contracts);

		expect(result.hasOverlap).toBe(true);
		expect(result.message).toContain('Überschneidung');
		expect(result.message).toContain('01.03.2026');
		expect(result.message).toContain('31.08.2026');
	});

	it('detects overlap with unlimited contract', () => {
		const contracts: ContractForAvailability[] = [
			{
				id: 'contract-1',
				start_date: '2025-01-01',
				end_date: null,
				status: 'Aktiv'
			}
		];

		const result = checkDateRangeOverlap('2026-01-01', null, contracts);

		expect(result.hasOverlap).toBe(true);
		expect(result.message).toContain('unbefristet');
	});

	it('returns no overlap when date ranges do not intersect', () => {
		const contracts: ContractForAvailability[] = [
			{
				id: 'contract-1',
				start_date: '2025-01-01',
				end_date: '2025-06-30',
				status: 'Beendet'
			}
		];

		const result = checkDateRangeOverlap('2026-01-01', '2026-12-31', contracts);

		expect(result.hasOverlap).toBe(false);
		expect(result.message).toBeNull();
	});

	it('excludes contract by ID when checking overlap', () => {
		const contracts: ContractForAvailability[] = [
			{
				id: 'contract-1',
				start_date: '2026-01-01',
				end_date: '2026-12-31',
				status: 'Aktiv'
			}
		];

		// Without exclusion - should overlap
		const resultWithOverlap = checkDateRangeOverlap('2026-06-01', '2026-08-31', contracts);
		expect(resultWithOverlap.hasOverlap).toBe(true);

		// With exclusion - no overlap
		const resultExcluded = checkDateRangeOverlap(
			'2026-06-01',
			'2026-08-31',
			contracts,
			'contract-1'
		);
		expect(resultExcluded.hasOverlap).toBe(false);
	});

	it('detects edge case: new contract starts on end date of existing', () => {
		const contracts: ContractForAvailability[] = [
			{
				id: 'contract-1',
				start_date: '2025-01-01',
				end_date: '2026-01-31',
				status: 'Aktiv'
			}
		];

		// Start on last day of existing contract - this is an overlap
		const resultOverlap = checkDateRangeOverlap('2026-01-31', '2026-12-31', contracts);
		expect(resultOverlap.hasOverlap).toBe(true);

		// Start day after existing contract ends - no overlap
		const resultNoOverlap = checkDateRangeOverlap('2026-02-01', '2026-12-31', contracts);
		expect(resultNoOverlap.hasOverlap).toBe(false);
	});

	it('handles proposed unlimited contract correctly', () => {
		const contracts: ContractForAvailability[] = [
			{
				id: 'contract-1',
				start_date: '2027-01-01',
				end_date: '2027-12-31',
				status: 'Aktiv'
			}
		];

		// Proposed unlimited contract that starts before existing
		const result = checkDateRangeOverlap('2026-06-01', null, contracts);

		expect(result.hasOverlap).toBe(true);
	});
});
