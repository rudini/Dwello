/**
 * Statements API Proxy
 * GET /api/statements - List statements with filters
 * POST /api/statements - Create statements (bulk generation)
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
		const response = await forwardRequest('/statements', 'GET', cookies, { params });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'GET /statements');
	}
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'POST');
		const body = await parseRequestBody(request);
		const response = await forwardRequest('/statements', 'POST', cookies, { body });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'POST /statements');
	}
};
