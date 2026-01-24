/**
 * Configuration API Proxy
 * GET /api/config - Read global configuration
 * PUT /api/config - Update configuration
 */

import type { RequestHandler } from './$types';
import {
	forwardRequest,
	validateXsrfForMutation,
	createProxyResponse,
	handleProxyError,
	parseRequestBody
} from '$lib/server/api-proxy';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const response = await forwardRequest('/config', 'GET', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'GET /config');
	}
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'PUT');
		const body = await parseRequestBody(request);
		const response = await forwardRequest('/config', 'PUT', cookies, { body });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'PUT /config');
	}
};
