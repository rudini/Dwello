/**
 * Vertragsbeginn in the past
 * GET /api/contracts/check-start?startDate=YYYY-MM-DD - whether it lies before today, by the Swiss day (#815)
 */

import type { RequestHandler } from './$types';
import {
	forwardRequest,
	createProxyResponse,
	handleProxyError,
	extractQueryParams
} from '$lib/server/api-proxy';

export const GET: RequestHandler = async ({ url, cookies }) => {
	try {
		const params = extractQueryParams(url);
		const response = await forwardRequest('/contracts/check-start', 'GET', cookies, { params });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'GET /contracts/check-start');
	}
};
