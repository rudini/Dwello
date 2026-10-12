/**
 * OpenPLZ API Service
 *
 * Swiss address lookup using the OpenPLZ API: a search term in, ready addresses out.
 * Documentation: https://www.openplzapi.org/en/
 */

const BASE_URL = 'https://openplzapi.org/ch';

// A street as the OpenPLZ full-text search returns it
interface OpenPlzStreet {
	name: string;
	postalCode: string;
	locality: string;
	commune: { name: string };
	district: { name: string };
	canton: { name: string; shortName: string };
}

export interface Address {
	street?: string;
	postalCode: string;
	city: string;
	canton: string;
	cantonShort: string;
	commune?: string;
	district?: string;
}

/**
 * Swiss addresses matching a search term (street, postal code and city in any order).
 * No results for fewer than two characters, or when the API fails or cannot be reached.
 *
 * @example
 * await searchAddresses('Bahnhofstrasse Zürich');
 * // [{ street: 'Bahnhofstrasse', postalCode: '8001', city: 'Zürich', cantonShort: 'ZH', ... }]
 */
export async function searchAddresses(query: string, limit = 10): Promise<Address[]> {
	const searchTerm = query.trim();
	if (searchTerm.length < 2) return [];

	const url = new URL(`${BASE_URL}/FullTextSearch`);
	url.searchParams.append('searchTerm', searchTerm);
	url.searchParams.append('pageSize', String(limit));
	try {
		const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
		if (!response.ok) throw new Error(`OpenPLZ API error: ${response.statusText}`);
		const streets: OpenPlzStreet[] = await response.json();
		return streets.map((street) => ({
			street: street.name,
			postalCode: street.postalCode,
			city: street.locality,
			canton: street.canton.name,
			cantonShort: street.canton.shortName,
			commune: street.commune.name,
			district: street.district.name
		}));
	} catch (error) {
		console.error('OpenPLZ search error:', error);
		return [];
	}
}

/**
 * Format an address for display.
 *
 * @example
 * formatAddress({ street: 'Bahnhofstrasse', postalCode: '8001', city: 'Zürich', ... })
 * // 'Bahnhofstrasse, 8001 Zürich'
 */
export function formatAddress(address: Address): string {
	const town = `${address.postalCode} ${address.city}`;
	return address.street ? `${address.street}, ${town}` : town;
}
