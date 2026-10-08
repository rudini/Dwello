/**
 * Statements API Proxy
 * GET /api/statements - List statements with filters
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
		const response = await forwardRequest('/statements', 'GET', cookies, { params });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'GET /statements');
	}
};
