/**
 * Invoice Statements API Proxy
 * GET /api/invoices/[id]/statements - Periods with statements that bill the invoice or lack it
 */

import type { RequestHandler } from './$types';
import { forwardRequest, createProxyResponse, handleProxyError } from '$lib/server/api-proxy';

export const GET: RequestHandler = async ({ params, cookies }) => {
	try {
		const response = await forwardRequest(`/invoices/${params.id}/statements`, 'GET', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `GET /invoices/${params.id}/statements`);
	}
};
