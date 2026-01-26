/**
 * Dashboard API Proxy
 * GET /api/dashboard - Fetch dashboard summary data
 */

import type { RequestHandler } from './$types';
import {
	forwardRequest,
	createProxyResponse,
	handleProxyError
} from '$lib/server/api-proxy';
import { AppError } from '$lib/server/error-handler';

// Mock data for development when backend is unavailable
const MOCK_DASHBOARD_DATA = {
	totalBuildings: 3,
	totalApartments: 24,
	occupiedApartments: 21,
	vacantApartments: 3,
	pendingStatements: 5,
	overdueStatements: 1
};

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const response = await forwardRequest('/dashboard', 'GET', cookies);
		return createProxyResponse(response);
	} catch (error) {
		// Return mock data when backend is unavailable (development mode)
		if (error instanceof AppError && error.code === 'SERVICE_UNAVAILABLE') {
			return new Response(JSON.stringify(MOCK_DASHBOARD_DATA), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		return handleProxyError(error, 'GET /dashboard');
	}
};
