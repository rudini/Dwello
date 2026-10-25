import { describe, it, expect } from 'vitest';
import {
	computeAvailability,
	checkDateRangeOverlap,
	type ContractForAvailability
} from '../contract-availability';

// #815: the backend decides availability by the Swiss day (backend apartment-availability.pg.test.ts); this names it
describe('computeAvailability', () => {
	it('returns fully available when the backend names neither a block nor a later day', () => {
		expect(computeAvailability({ blocked: false, availableFrom: null })).toEqual({
			isAvailable: true,
			availableFrom: null,
			hasOngoingContract: false,
			message: 'Wohnung verfügbar',
			statusType: 'available'
		});
	});

	it('returns blocked when the backend names an open-ended contract', () => {
		const result = computeAvailability({ blocked: true, availableFrom: null });

		expect(result.isAvailable).toBe(false);
		expect(result.hasOngoingContract).toBe(true);
		expect(result.statusType).toBe('blocked');
		expect(result.message).toContain('unbefristeter Mietvertrag, nicht gekündigt');
	});

	it('returns available from the day the backend names', () => {
		const result = computeAvailability({ blocked: false, availableFrom: '2026-04-01' });

		expect(result.isAvailable).toBe(true);
		expect(result.availableFrom).toBe('2026-04-01');
		expect(result.statusType).toBe('available-from');
		expect(result.message).toContain('01.04.2026');
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
