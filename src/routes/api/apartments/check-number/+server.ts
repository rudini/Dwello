/**
 * Check Apartment Number Availability
 * GET /api/apartments/check-number?buildingId=...&number=...&excludeId=...
 * Returns whether an apartment number already exists in a building
 */

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const buildingId = url.searchParams.get('buildingId');
	const number = url.searchParams.get('number');
	const excludeId = url.searchParams.get('excludeId');

	if (!buildingId || !number) {
		return json({ error: 'buildingId and number are required' }, { status: 400 });
	}

	try {
		// Query apartments in the building
		const response = await fetch(
			`${BACKEND_URL}/api/v1/apartments?buildingId=${encodeURIComponent(buildingId)}&limit=100`
		);

		if (!response.ok) {
			return json({ error: 'Failed to fetch apartments' }, { status: response.status });
		}

		const data = await response.json();
		const apartments = data.apartments || data.data || [];

		// Check if any apartment has the same number (excluding the current one if editing)
		const duplicate = apartments.find(
			(apt: { id: string; number: string }) =>
				apt.number === number && (!excludeId || apt.id !== excludeId)
		);

		if (duplicate) {
			return json({
				exists: true,
				apartmentId: duplicate.id,
				number: duplicate.number
			});
		}

		return json({ exists: false });
	} catch (error) {
		console.error('Error checking apartment number:', error);
		return json({ error: 'Failed to check apartment number' }, { status: 500 });
	}
};
