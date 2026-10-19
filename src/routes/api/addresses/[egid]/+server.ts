/**
 * Type, year and Wohnungen of a building in the Gebäuderegister (#479)
 * GET /api/addresses/<egid> - 400 for an EGID that is not a number, 502 when the register cannot be reached
 */

import { json } from '@sveltejs/kit';
import { readRegisterBuilding } from '$lib/server/building-register';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	if (!/^\d+$/.test(params.egid)) return json({ error: 'invalid' }, { status: 400 });
	try {
		return json(await readRegisterBuilding(params.egid));
	} catch (error) {
		console.error('Building register building failed:', error);
		return json({ error: 'unreachable' }, { status: 502 });
	}
};
