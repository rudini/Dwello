/**
 * Building Detail API Proxy
 * GET /api/buildings/[id] - Fetch single building
 * PUT /api/buildings/[id] - Update building
 * DELETE /api/buildings/[id] - Delete building
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
		const response = await forwardRequest(`/buildings/${params.id}`, 'GET', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `GET /buildings/${params.id}`);
	}
};

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'PUT');
		const body = await parseRequestBody(request);
		const response = await forwardRequest(`/buildings/${params.id}`, 'PUT', cookies, { body });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `PUT /buildings/${params.id}`);
	}
};

export const DELETE: RequestHandler = async ({ params, request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'DELETE');
		const response = await forwardRequest(`/buildings/${params.id}`, 'DELETE', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `DELETE /buildings/${params.id}`);
	}
};
