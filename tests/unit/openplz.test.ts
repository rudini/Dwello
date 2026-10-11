/**
 * OpenPLZ Service Unit Tests
 * Swiss address lookup: search term in, ready addresses out
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchAddresses, formatAddress } from '../../src/lib/services/openplz';

const bahnhofstrasse = {
	key: '12345',
	name: 'Bahnhofstrasse',
	postalCode: '8001',
	locality: 'Zürich',
	canton: { key: '1', name: 'Zürich', shortName: 'ZH' },
	commune: { key: 'c1', name: 'Zürich', shortName: 'ZH' },
	district: { key: 'd1', name: 'Bezirk Zürich', shortName: 'ZH' },
	status: 'Real'
};

describe('OpenPLZ Service', () => {
	let fetchSpy: ReturnType<typeof vi.spyOn>;

	const answer = (streets: unknown[]) =>
		fetchSpy.mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue(streets)
		} as unknown as Response);

	beforeEach(() => {
		fetchSpy = vi.spyOn(global, 'fetch');
		vi.clearAllMocks();
	});

	afterEach(() => {
		fetchSpy.mockRestore();
	});

	describe('searchAddresses', () => {
		it('findet Strassen per Volltextsuche und liefert sie als Adressen', async () => {
			answer([bahnhofstrasse]);

			const results = await searchAddresses('Bahnhofstrasse Zürich');

			expect(fetchSpy).toHaveBeenCalledWith(
				expect.stringContaining('FullTextSearch'),
				expect.anything()
			);
			expect(results).toEqual([
				{
					street: 'Bahnhofstrasse',
					postalCode: '8001',
					city: 'Zürich',
					canton: 'Zürich',
					cantonShort: 'ZH',
					commune: 'Zürich',
					district: 'Bezirk Zürich'
				}
			]);
		});

		it('fragt höchstens die gewünschte Anzahl Treffer ab', async () => {
			answer([]);

			await searchAddresses('Test', 5);

			expect(fetchSpy).toHaveBeenCalledWith(
				expect.stringContaining('pageSize=5'),
				expect.anything()
			);
		});

		it('liefert keine Treffer, wenn die API einen Fehler meldet', async () => {
			fetchSpy.mockResolvedValue({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error'
			} as unknown as Response);

			expect(await searchAddresses('Test')).toEqual([]);
		});

		it('liefert keine Treffer, wenn die API nicht erreichbar ist', async () => {
			fetchSpy.mockRejectedValue(new TypeError('Failed to fetch'));

			expect(await searchAddresses('Test')).toEqual([]);
		});

		it('sucht erst ab zwei Zeichen', async () => {
			expect(await searchAddresses('a')).toEqual([]);
			expect(await searchAddresses('')).toEqual([]);
			expect(fetchSpy).not.toHaveBeenCalled();
		});

		it('entfernt Leerzeichen am Rand des Suchbegriffs', async () => {
			answer([]);

			await searchAddresses('  Bahnhof  ');

			expect(fetchSpy).toHaveBeenCalledWith(
				expect.stringContaining('searchTerm=Bahnhof&'),
				expect.anything()
			);
		});
	});

	describe('formatAddress', () => {
		it('formatiert eine Adresse mit Strasse', () => {
			expect(formatAddress({ street: 'Bahnhofstrasse', postalCode: '8001', city: 'Zürich', canton: 'Zürich', cantonShort: 'ZH' })).toBe(
				'Bahnhofstrasse, 8001 Zürich'
			);
		});

		it('formatiert eine Adresse ohne Strasse', () => {
			expect(formatAddress({ postalCode: '8001', city: 'Zürich', canton: 'Zürich', cantonShort: 'ZH' })).toBe(
				'8001 Zürich'
			);
		});
	});
});
