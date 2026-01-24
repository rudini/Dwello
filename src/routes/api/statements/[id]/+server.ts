/**
 * Statement Detail API Proxy
 * GET /api/statements/[id] - Fetch single statement
 * PUT /api/statements/[id] - Update statement status
 * DELETE /api/statements/[id] - Delete statement
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
		const response = await forwardRequest(`/statements/${params.id}`, 'GET', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `GET /statements/${params.id}`);
	}
};

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'PUT');
		const body = await parseRequestBody(request);
		const response = await forwardRequest(`/statements/${params.id}`, 'PUT', cookies, { body });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `PUT /statements/${params.id}`);
	}
};

export const DELETE: RequestHandler = async ({ params, request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'DELETE');
		const response = await forwardRequest(`/statements/${params.id}`, 'DELETE', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `DELETE /statements/${params.id}`);
	}
};
