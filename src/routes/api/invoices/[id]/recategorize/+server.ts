/**
 * Invoice Recategorize API Proxy
 * POST /api/invoices/[id]/recategorize - Re-run LLM categorization for an invoice
 */

import type { RequestHandler } from './$types';
import {
	forwardRequest,
	validateXsrfForMutation,
	createProxyResponse,
	handleProxyError
} from '$lib/server/api-proxy';

export const POST: RequestHandler = async ({ params, request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'POST');
		const response = await forwardRequest(`/invoices/${params.id}/recategorize`, 'POST', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `POST /invoices/${params.id}/recategorize`);
	}
};
