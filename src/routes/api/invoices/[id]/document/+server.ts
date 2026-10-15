/**
 * PUT /api/invoices/[id]/document - Adds or replaces the Beleg of an invoice; the file comes as multipart form in `file`
 */

import type { RequestHandler } from './$types';
import { forwardRequest, validateXsrfForMutation, createProxyResponse, handleProxyError } from '$lib/server/api-proxy';
import { belegOf } from '$lib/server/invoice';

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'PUT');
		const body = await belegOf((await request.formData()).get('file') as File);
		return createProxyResponse(await forwardRequest(`/invoices/${params.id}/document`, 'PUT', cookies, { body }));
	} catch (error) {
		return handleProxyError(error, `PUT /invoices/${params.id}/document`);
	}
};
