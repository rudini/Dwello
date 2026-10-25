/**
 * Abrechnungsperiode still running
 * GET /api/statements/check-period?periodEnd=YYYY-MM-DD - whether it ends today or later, by the Swiss day (#815)
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
		const response = await forwardRequest('/statements/check-period', 'GET', cookies, { params });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'GET /statements/check-period');
	}
};
