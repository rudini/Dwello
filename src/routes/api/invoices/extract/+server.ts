/**
 * POST /api/invoices/extract - What the KI reads from an uploaded file (its pages as images); stores nothing
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
		return createProxyResponse(await forwardRequest('/invoices/extract', 'POST', cookies, { body }));
	} catch (error) {
		return handleProxyError(error, 'POST /invoices/extract');
	}
};
