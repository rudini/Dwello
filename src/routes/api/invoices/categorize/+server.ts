/**
 * Invoice Categorization API Proxy
 * POST /api/invoices/categorize - Categorize invoice using LLM
 */

import type { RequestHandler } from './$types';
import {
	forwardRequest,
	validateXsrfForMutation,
	createProxyResponse,
	handleProxyError,
	parseRequestBody
} from '$lib/server/api-proxy';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'POST');
		const body = await parseRequestBody(request);
		const response = await forwardRequest('/invoices/categorize', 'POST', cookies, { body });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'POST /invoices/categorize');
	}
};
