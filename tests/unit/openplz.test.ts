/**
 * OpenPLZ Service Unit Tests
 * Tests for Swiss address lookup service
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	searchAddress,
	searchLocality,
	getCantons,
	getDistricts,
	getAddressFromPostalCode,
	streetToAddress,
	formatAddress,
	formatAddressWithCanton,
	OpenPlzError
} from '../../src/lib/services/openplz';

describe('OpenPLZ Service', () => {
	let fetchSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		fetchSpy = vi.spyOn(global, 'fetch');
		vi.clearAllMocks();
	});

	afterEach(() => {
		fetchSpy.mockRestore();
	});

	describe('searchAddress', () => {
		it('should search addresses with full-text search', async () => {
			const mockStreets = [
				{
					key: '12345',
					name: 'Bahnhofstrasse',
					postalCode: '8001',
					locality: 'Zürich',
					canton: { key: '1', name: 'Zürich', shortName: 'ZH' },
					commune: { key: 'c1', name: 'Zürich', shortName: 'ZH' },
					district: { key: 'd1', name: 'Zürich', shortName: 'ZH' },
					status: 'Real'
				}
			];

			fetchSpy.mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue(mockStreets)
			} as unknown as Response);

			const results = await searchAddress('Bahnhofstrasse Zürich');

			expect(fetchSpy).toHaveBeenCalledWith(
				expect.stringContaining('FullTextSearch'),
				expect.anything()
			);
			expect(results).toHaveLength(1);
			expect(results[0].name).toBe('Bahnhofstrasse');
		});

		it('should respect pageSize parameter', async () => {
			fetchSpy.mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue([])
			} as unknown as Response);

			await searchAddress('Test', 5);

			expect(fetchSpy).toHaveBeenCalledWith(
				expect.stringContaining('pageSize=5'),
				expect.anything()
			);
		});

		it('should return empty array on API failure (catches errors)', async () => {
			fetchSpy.mockResolvedValue({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error'
			} as unknown as Response);

			// searchAddress catches errors and returns empty array
			const results = await searchAddress('Test');
			expect(results).toEqual([]);
		});

		it('should return empty array for short query', async () => {
			const results = await searchAddress('a');
			expect(results).toEqual([]);
			expect(fetchSpy).not.toHaveBeenCalled();
		});

		it('should return empty array for empty query', async () => {
			const results = await searchAddress('');
			expect(results).toEqual([]);
			expect(fetchSpy).not.toHaveBeenCalled();
		});

		it('should trim whitespace from query', async () => {
			fetchSpy.mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue([])
			} as unknown as Response);

			await searchAddress('  Bahnhof  ');

			expect(fetchSpy).toHaveBeenCalledWith(
				expect.stringContaining('searchTerm=Bahnhof'),
				expect.anything()
			);
		});
	});

	describe('searchLocality', () => {
		it('should search by postal code', async () => {
			const mockLocalities = [
				{
					postalCode: '8001',
					name: 'Zürich',
					canton: { key: '1', name: 'Zürich', shortName: 'ZH' },
					commune: { key: 'c1', name: 'Zürich', shortName: 'ZH' },
					district: { key: 'd1', name: 'Zürich', shortName: 'ZH' }
				}
			];

			fetchSpy.mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue(mockLocalities)
			} as unknown as Response);

			const results = await searchLocality({ postalCode: '8001' });

			expect(fetchSpy).toHaveBeenCalledWith(
				expect.stringContaining('postalCode=8001'),
				expect.anything()
			);
			expect(results).toHaveLength(1);
			expect(results[0].postalCode).toBe('8001');
		});

		it('should search by name', async () => {
			fetchSpy.mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue([])
			} as unknown as Response);

			await searchLocality({ name: 'Zürich' });

			expect(fetchSpy).toHaveBeenCalledWith(
				expect.stringContaining('name=Z%C3%BCrich'),
				expect.anything()
			);
		});

		it('should return empty array when no options provided', async () => {
			const results = await searchLocality({});
			expect(results).toEqual([]);
		});
	});

	describe('getCantons', () => {
		it('should return all Swiss cantons', async () => {
			const mockCantons = [
				{ key: '1', name: 'Zürich', shortName: 'ZH' },
				{ key: '2', name: 'Bern', shortName: 'BE' }
			];

			fetchSpy.mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue(mockCantons)
			} as unknown as Response);

			const cantons = await getCantons();

			expect(fetchSpy).toHaveBeenCalledWith(
				'https://openplzapi.org/ch/Cantons',
				expect.anything()
			);
			expect(cantons).toHaveLength(2);
		});

		it('should return empty array on error', async () => {
			fetchSpy.mockRejectedValue(new Error('Network error'));

			const cantons = await getCantons();
			expect(cantons).toEqual([]);
		});
	});

	describe('getDistricts', () => {
		it('should return districts for a canton', async () => {
			const mockDistricts = [
				{ key: 'd1', name: 'Zürich', shortName: 'ZH' }
			];

			fetchSpy.mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue(mockDistricts)
			} as unknown as Response);

			const districts = await getDistricts('ZH');

			expect(fetchSpy).toHaveBeenCalledWith(
				'https://openplzapi.org/ch/Cantons/ZH/Districts',
				expect.anything()
			);
			expect(districts).toHaveLength(1);
		});

		it('should return empty array for empty canton key', async () => {
			const districts = await getDistricts('');
			expect(districts).toEqual([]);
			expect(fetchSpy).not.toHaveBeenCalled();
		});
	});

	describe('getAddressFromPostalCode', () => {
		it('should return address from postal code', async () => {
			const mockLocalities = [
				{
					postalCode: '8001',
					name: 'Zürich',
					canton: { key: '1', name: 'Zürich', shortName: 'ZH' },
					commune: { key: 'c1', name: 'Zürich', shortName: 'ZH' },
					district: { key: 'd1', name: 'Zürich', shortName: 'ZH' }
				}
			];

			fetchSpy.mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue(mockLocalities)
			} as unknown as Response);

			const address = await getAddressFromPostalCode('8001');

			expect(address).not.toBeNull();
			expect(address?.postalCode).toBe('8001');
			expect(address?.city).toBe('Zürich');
			expect(address?.cantonShort).toBe('ZH');
			expect(address?.canton).toBe('Zürich');
		});

		it('should return null when postal code not found', async () => {
			fetchSpy.mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue([])
			} as unknown as Response);

			const address = await getAddressFromPostalCode('9999');

			expect(address).toBeNull();
		});

		it('should return null for invalid postal code format', async () => {
			const address = await getAddressFromPostalCode('123');
			expect(address).toBeNull();
			expect(fetchSpy).not.toHaveBeenCalled();
		});

		it('should return null for non-numeric postal code', async () => {
			const address = await getAddressFromPostalCode('abcd');
			expect(address).toBeNull();
			expect(fetchSpy).not.toHaveBeenCalled();
		});
	});

	describe('streetToAddress', () => {
		it('should convert OpenPlzStreet to Address', () => {
			const street = {
				key: '12345',
				name: 'Bahnhofstrasse',
				postalCode: '8001',
				locality: 'Zürich',
				canton: { key: '1', name: 'Zürich', shortName: 'ZH' },
				commune: { key: 'c1', name: 'Zürich City', shortName: 'ZH' },
				district: { key: 'd1', name: 'Zürich District', shortName: 'ZH' },
				status: 'Real' as const
			};

			const address = streetToAddress(street);

			expect(address.street).toBe('Bahnhofstrasse');
			expect(address.postalCode).toBe('8001');
			expect(address.city).toBe('Zürich');
			expect(address.canton).toBe('Zürich');
			expect(address.cantonShort).toBe('ZH');
			expect(address.commune).toBe('Zürich City');
			expect(address.district).toBe('Zürich District');
		});
	});

	describe('formatAddress', () => {
		it('should format address with street', () => {
			const address = {
				street: 'Bahnhofstrasse 1',
				postalCode: '8001',
				city: 'Zürich',
				canton: 'Zürich',
				cantonShort: 'ZH'
			};

			const formatted = formatAddress(address);

			expect(formatted).toBe('Bahnhofstrasse 1, 8001 Zürich');
		});

		it('should format address without street', () => {
			const address = {
				postalCode: '8001',
				city: 'Zürich',
				canton: 'Zürich',
				cantonShort: 'ZH'
			};

			const formatted = formatAddress(address);

			expect(formatted).toBe('8001 Zürich');
		});
	});

	describe('formatAddressWithCanton', () => {
		it('should include canton in formatted address', () => {
			const address = {
				postalCode: '8001',
				city: 'Zürich',
				canton: 'Zürich',
				cantonShort: 'ZH'
			};

			const formatted = formatAddressWithCanton(address);

			expect(formatted).toBe('8001 Zürich (ZH)');
		});

		it('should work with full address including street', () => {
			const address = {
				street: 'Bahnhofstrasse 1',
				postalCode: '8001',
				city: 'Zürich',
				canton: 'Zürich',
				cantonShort: 'ZH'
			};

			// Note: formatAddressWithCanton doesn't include street
			const formatted = formatAddressWithCanton(address);

			expect(formatted).toBe('8001 Zürich (ZH)');
		});
	});

	describe('OpenPlzError', () => {
		it('should create error with status code', () => {
			const error = new OpenPlzError('Not Found', 404);

			expect(error.message).toBe('Not Found');
			expect(error.statusCode).toBe(404);
			expect(error.name).toBe('OpenPlzError');
		});

		it('should create error without status code', () => {
			const error = new OpenPlzError('Network error');

			expect(error.message).toBe('Network error');
			expect(error.statusCode).toBeUndefined();
		});
	});
});
