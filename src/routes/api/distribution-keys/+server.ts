/**
 * Distribution Keys API Proxy
 * GET /api/distribution-keys - List distribution keys
 * POST /api/distribution-keys - Create new distribution key
 */

import type { RequestHandler } from './$types';
import {
	forwardRequest,
	validateXsrfForMutation,
	createProxyResponse,
	handleProxyError,
	extractQueryParams,
	parseRequestBody
} from '$lib/server/api-proxy';

export const GET: RequestHandler = async ({ url, cookies }) => {
	try {
		const params = extractQueryParams(url);
		const response = await forwardRequest('/distribution-keys', 'GET', cookies, { params });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'GET /distribution-keys');
	}
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'POST');
		const body = await parseRequestBody(request);
		const response = await forwardRequest('/distribution-keys', 'POST', cookies, { body });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'POST /distribution-keys');
	}
};
