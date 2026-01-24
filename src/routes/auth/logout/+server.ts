/**
 * Auth Logout Endpoint
 * POST /auth/logout
 * Clears all authentication cookies and ends the session
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	clearAuthCookies,
	getJwtFromCookie,
	verifyJwt,
	validateXsrfToken
} from '$lib/server/auth';
import {
	handleRequestError,
	logger
} from '$lib/server/error-handler';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// Validate XSRF token for mutation requests
		// Note: We're lenient here - if no XSRF token, we still log out
		// This prevents users from being "stuck" logged in
		const hasValidXsrf = validateXsrfToken(request, cookies);

		if (!hasValidXsrf) {
			logger.warn('Logout without valid XSRF token', {
				operation: 'logout'
			});
		}

		// Try to get user info for logging (optional)
		const jwt = getJwtFromCookie(cookies);
		let userId: string | undefined;

		if (jwt) {
			try {
				const payload = await verifyJwt(jwt);
				userId = payload.sub;
			} catch {
				// Token might be expired, that's fine
			}
		}

		// Clear all auth cookies
		clearAuthCookies(cookies);

		logger.info('User logged out', {
			userId: userId || 'unknown',
			hadValidXsrf: hasValidXsrf
		});

		return json({ success: true });
	} catch (error) {
		// Even on error, try to clear cookies
		try {
			clearAuthCookies(cookies);
		} catch {
			// Ignore cookie clearing errors
		}

		return handleRequestError(error, 'logout');
	}
};
