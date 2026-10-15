/**
 * Invoices API Proxy
 * GET /api/invoices - List invoices with filters
 * POST /api/invoices - Create new invoice; as multipart form the fields in `invoice` (JSON) and its Beleg in `file`
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
import { belegOf } from '$lib/server/invoice';

// A file of up to 10 MB is sent as a form: in JSON its Base64 would be larger than the server reads (BODY_SIZE_LIMIT)
async function invoiceWithBeleg(request: Request) {
	const form = await request.formData();
	return { ...JSON.parse(String(form.get('invoice'))), beleg: await belegOf(form.get('file') as File) };
}

export const GET: RequestHandler = async ({ url, cookies }) => {
	try {
		const params = extractQueryParams(url);
		const response = await forwardRequest('/invoices', 'GET', cookies, { params });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'GET /invoices');
	}
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'POST');
		const body = request.headers.get('content-type')?.startsWith('multipart/form-data')
			? await invoiceWithBeleg(request)
			: await parseRequestBody(request);
		const response = await forwardRequest('/invoices', 'POST', cookies, { body });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, 'POST /invoices');
	}
};
