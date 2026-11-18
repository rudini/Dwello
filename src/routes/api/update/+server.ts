/**
 * The update (#1453)
 * POST /api/update - start it (the backend refuses without a Sicherung)
 * GET /api/update - how far it is, asked of the update service itself: while the backend restarts it does not answer
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	createProxyResponse,
	forwardRequest,
	handleProxyError,
	validateXsrfForMutation
} from '$lib/server/api-proxy';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'POST');
		return createProxyResponse(await forwardRequest('/update', 'POST', cookies));
	} catch (error) {
		return handleProxyError(error, 'POST /update');
	}
};

export const GET: RequestHandler = async () => {
	const response = await fetch(`${process.env.UPDATER_URL}/status`).catch(() => null);
	return response?.ok ? json(await response.json()) : json({ state: 'unknown' }, { status: 503 });
};
