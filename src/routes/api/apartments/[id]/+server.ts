/**
 * Apartment Detail API Proxy
 * GET /api/apartments/[id] - Fetch single apartment
 * PUT /api/apartments/[id] - Update apartment
 * DELETE /api/apartments/[id] - Delete apartment
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
		const response = await forwardRequest(`/apartments/${params.id}`, 'GET', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `GET /apartments/${params.id}`);
	}
};

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'PUT');
		const body = await parseRequestBody(request);
		const response = await forwardRequest(`/apartments/${params.id}`, 'PUT', cookies, { body });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `PUT /apartments/${params.id}`);
	}
};

export const DELETE: RequestHandler = async ({ params, request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'DELETE');
		const response = await forwardRequest(`/apartments/${params.id}`, 'DELETE', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `DELETE /apartments/${params.id}`);
	}
};
