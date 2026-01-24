/**
 * Dashboard API Proxy
 * GET /api/dashboard - Fetch dashboard summary data
 */

import type { RequestHandler } from './$types';
import {
	forwardRequest,
	createProxyResponse,
	handleProxyError
} from '$lib/server/api-proxy';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const response = await forwardRequest('/dashboard', 'GET', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'GET /dashboard');
	}
};
