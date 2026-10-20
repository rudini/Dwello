/**
 * Address search of «Neues Gebäude» in the Gebäuderegister (#479)
 * GET /api/addresses?q=<text> - addresses with house number; 502 when the register cannot be reached
 */

import { json } from '@sveltejs/kit';
import { searchRegister } from '$lib/server/building-register';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		return json(await searchRegister(url.searchParams.get('q') ?? ''));
	} catch (error) {
		console.error('Building register search failed:', error);
		return json({ error: 'unreachable' }, { status: 502 });
	}
};
