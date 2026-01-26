/**
 * OpenPLZ API Service
 *
 * Swiss address lookup using the OpenPLZ API.
 * Documentation: https://www.openplzapi.org/en/
 *
 * Base URL: https://openplzapi.org/ch/
 */

const BASE_URL = 'https://openplzapi.org/ch';
const DEFAULT_PAGE_SIZE = 10;

// Response types from OpenPLZ API
export interface OpenPlzCanton {
	key: string;
	name: string;
	shortName: string;
}

export interface OpenPlzDistrict {
	key: string;
	name: string;
	shortName: string;
}

export interface OpenPlzCommune {
	key: string;
	name: string;
	shortName: string;
}

export interface OpenPlzLocality {
	postalCode: string;
	name: string;
	commune: OpenPlzCommune;
	district: OpenPlzDistrict;
	canton: OpenPlzCanton;
}

export interface OpenPlzStreet {
	key: string;
	name: string;
	postalCode: string;
	locality: string;
	commune: OpenPlzCommune;
	district: OpenPlzDistrict;
	canton: OpenPlzCanton;
	status: 'Real' | 'Outdated' | 'Planned';
}

// Simplified address type for application use
export interface Address {
	street?: string;
	postalCode: string;
	city: string;
	canton: string;
	cantonShort: string;
	commune?: string;
	district?: string;
}

// API error type
export class OpenPlzError extends Error {
	constructor(
		message: string,
		public statusCode?: number
	) {
		super(message);
		this.name = 'OpenPlzError';
	}
}

/**
 * Fetch helper with error handling
 */
async function fetchApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
	const url = new URL(`${BASE_URL}${endpoint}`);
	Object.entries(params).forEach(([key, value]) => {
		if (value) url.searchParams.append(key, value);
	});

	try {
		const response = await fetch(url.toString(), {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			throw new OpenPlzError(`OpenPLZ API error: ${response.statusText}`, response.status);
		}

		return response.json();
	} catch (error) {
		if (error instanceof OpenPlzError) throw error;
		throw new OpenPlzError(`Failed to fetch from OpenPLZ API: ${error}`);
	}
}

/**
 * Search for addresses using full-text search.
 * Searches across street names, postal codes, and localities.
 *
 * @param query - Search term (can include street, postal code, city in any order)
 * @param pageSize - Number of results to return (default: 10)
 * @returns Array of matching street addresses
 *
 * @example
 * const results = await searchAddress('Bahnhofstrasse Zürich');
 * const results = await searchAddress('8001');
 * const results = await searchAddress('Musterstrasse 12 Bern');
 */
export async function searchAddress(query: string, pageSize = DEFAULT_PAGE_SIZE): Promise<OpenPlzStreet[]> {
	if (!query || query.trim().length < 2) {
		return [];
	}

	try {
		const results = await fetchApi<OpenPlzStreet[]>('/FullTextSearch', {
			searchTerm: query.trim(),
			pageSize: pageSize.toString()
		});
		return results;
	} catch (error) {
		console.error('OpenPLZ search error:', error);
		return [];
	}
}

/**
 * Search for localities by postal code and/or name.
 *
 * @param postalCode - Swiss postal code (4 digits)
 * @param name - Locality name (supports regex patterns)
 * @param pageSize - Number of results to return (default: 10)
 * @returns Array of matching localities
 *
 * @example
 * const results = await searchLocality({ postalCode: '8001' });
 * const results = await searchLocality({ name: 'Zürich' });
 */
export async function searchLocality(
	options: { postalCode?: string; name?: string },
	pageSize = DEFAULT_PAGE_SIZE
): Promise<OpenPlzLocality[]> {
	const { postalCode, name } = options;

	if (!postalCode && !name) {
		return [];
	}

	try {
		const results = await fetchApi<OpenPlzLocality[]>('/Localities', {
			postalCode: postalCode || '',
			name: name || '',
			pageSize: pageSize.toString()
		});
		return results;
	} catch (error) {
		console.error('OpenPLZ locality search error:', error);
		return [];
	}
}

/**
 * Get all Swiss cantons.
 *
 * @returns Array of all 26 Swiss cantons
 */
export async function getCantons(): Promise<OpenPlzCanton[]> {
	try {
		return await fetchApi<OpenPlzCanton[]>('/Cantons');
	} catch (error) {
		console.error('OpenPLZ cantons error:', error);
		return [];
	}
}

/**
 * Get districts within a canton.
 *
 * @param cantonKey - Canton key (e.g., '1' for Zürich)
 * @returns Array of districts in the canton
 */
export async function getDistricts(cantonKey: string): Promise<OpenPlzDistrict[]> {
	if (!cantonKey) return [];

	try {
		return await fetchApi<OpenPlzDistrict[]>(`/Cantons/${cantonKey}/Districts`);
	} catch (error) {
		console.error('OpenPLZ districts error:', error);
		return [];
	}
}

/**
 * Get address details from a postal code.
 * Returns the first matching locality with full canton/district info.
 *
 * @param postalCode - Swiss postal code (4 digits)
 * @returns Address object with city, canton, etc. or null if not found
 *
 * @example
 * const address = await getAddressFromPostalCode('8001');
 * // Returns: { postalCode: '8001', city: 'Zürich', canton: 'Zürich', cantonShort: 'ZH', ... }
 */
export async function getAddressFromPostalCode(postalCode: string): Promise<Address | null> {
	if (!postalCode || !/^\d{4}$/.test(postalCode)) {
		return null;
	}

	const localities = await searchLocality({ postalCode });

	if (localities.length === 0) {
		return null;
	}

	const locality = localities[0];
	return {
		postalCode: locality.postalCode,
		city: locality.name,
		canton: locality.canton.name,
		cantonShort: locality.canton.shortName,
		commune: locality.commune.name,
		district: locality.district.name
	};
}

/**
 * Convert OpenPLZ street result to simplified Address format.
 *
 * @param street - OpenPLZ street object
 * @returns Simplified Address object
 */
export function streetToAddress(street: OpenPlzStreet): Address {
	return {
		street: street.name,
		postalCode: street.postalCode,
		city: street.locality,
		canton: street.canton.name,
		cantonShort: street.canton.shortName,
		commune: street.commune.name,
		district: street.district.name
	};
}

/**
 * Format an address for display.
 *
 * @param address - Address object
 * @returns Formatted address string
 *
 * @example
 * formatAddress({ street: 'Bahnhofstrasse', postalCode: '8001', city: 'Zürich', ... })
 * // Returns: 'Bahnhofstrasse, 8001 Zürich'
 */
export function formatAddress(address: Address): string {
	const parts: string[] = [];

	if (address.street) {
		parts.push(address.street);
	}

	parts.push(`${address.postalCode} ${address.city}`);

	return parts.join(', ');
}

/**
 * Format an address with canton for display.
 *
 * @param address - Address object
 * @returns Formatted address string with canton
 *
 * @example
 * formatAddressWithCanton({ postalCode: '8001', city: 'Zürich', cantonShort: 'ZH', ... })
 * // Returns: '8001 Zürich (ZH)'
 */
export function formatAddressWithCanton(address: Address): string {
	return `${address.postalCode} ${address.city} (${address.cantonShort})`;
}
