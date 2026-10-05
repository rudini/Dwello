/**
 * Distribution Key Detail API Proxy
 * GET /api/distribution-keys/[id] - Fetch single distribution key
 * PUT /api/distribution-keys/[id] - Update distribution key
 * DELETE /api/distribution-keys/[id] - Delete distribution key
 */

import type { RequestHandler } from './$types';
import {
	forwardRequest,
	validateXsrfForMutation,
	createProxyResponse,
	handleProxyError,
	parseRequestBody
} from '$lib/server/api-proxy';

export const GET: RequestHandler = async ({ params, cookies }) => {
	try {
		const response = await forwardRequest(`/distribution-keys/${params.id}`, 'GET', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `GET /distribution-keys/${params.id}`);
	}
};

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'PUT');
		const body = await parseRequestBody(request);
		const response = await forwardRequest(`/distribution-keys/${params.id}`, 'PUT', cookies, {
			body
		});
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `PUT /distribution-keys/${params.id}`);
	}
};

export const DELETE: RequestHandler = async ({ params, request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'DELETE');
		const response = await forwardRequest(`/distribution-keys/${params.id}`, 'DELETE', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `DELETE /distribution-keys/${params.id}`);
	}
};
