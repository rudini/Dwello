/**
 * Auth Logout Endpoint
 * POST /auth/logout
 * Clears all authentication cookies and ends the session
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearAuthCookies, getJwtFromCookie, verifyJwt, validateXsrfToken } from '$lib/server/auth';
import { handleRequestError, logger } from '$lib/server/error-handler';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// No valid XSRF token: a cross-site request, the session stays (#1434)
		if (!validateXsrfToken(request, cookies)) {
			logger.warn('Logout refused without valid XSRF token', { operation: 'logout' });
			return json(
				{ error: { code: 'XSRF_ERROR', message: 'Invalid XSRF token' } },
				{ status: 403 }
			);
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
			userId: userId || 'unknown'
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
