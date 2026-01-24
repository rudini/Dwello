/**
 * Tenant Detail API Proxy
 * GET /api/tenants/[id] - Fetch single tenant
 * PUT /api/tenants/[id] - Update tenant
 * DELETE /api/tenants/[id] - Delete tenant
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
		const response = await forwardRequest(`/tenants/${params.id}`, 'GET', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `GET /tenants/${params.id}`);
	}
};

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'PUT');
		const body = await parseRequestBody(request);
		const response = await forwardRequest(`/tenants/${params.id}`, 'PUT', cookies, { body });
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `PUT /tenants/${params.id}`);
	}
};

export const DELETE: RequestHandler = async ({ params, request, cookies }) => {
	try {
		validateXsrfForMutation(request, cookies, 'DELETE');
		const response = await forwardRequest(`/tenants/${params.id}`, 'DELETE', cookies);
		return createProxyResponse(response);
	} catch (error) {
		return handleProxyError(error, `DELETE /tenants/${params.id}`);
	}
};
