/**
 * Auth Refresh Endpoint
 * POST /auth/refresh
 * Refreshes the session token if current token is valid
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getJwtFromCookie,
	verifyJwt,
	generateJwt,
	setSessionCookie,
	setXsrfToken,
	validateXsrfToken
} from '$lib/server/auth';
import { isAllowed } from '$lib/server/allowed-emails';
import { JWTError, ValidationError, handleRequestError, logger } from '$lib/server/error-handler';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// Validate XSRF token for mutation requests
		if (!validateXsrfToken(request, cookies)) {
			throw new ValidationError('Invalid XSRF token');
		}

		// Extract JWT from session cookie
		const jwt = getJwtFromCookie(cookies);

		if (!jwt) {
			throw new JWTError('Not authenticated', 401);
		}

		// Verify current JWT
		let payload;
		try {
			payload = await verifyJwt(jwt);
		} catch (error) {
			logger.debug('JWT verification failed during refresh', {
				error: error instanceof Error ? error.message : 'Unknown error'
			});
			throw new JWTError('Invalid or expired token', 401);
		}
		// #51: /auth/* passes the session check of hooks.server.ts, so the account is checked here
		if (!isAllowed(payload)) throw new JWTError('Account not allowed', 401);

		// Generate new JWT with same user data
		const newJwt = await generateJwt({
			sub: payload.sub,
			email: payload.email,
			name: payload.name,
			provider: payload.provider,
			auth_time: payload.auth_time ?? payload.iat
		});

		// Set new session cookie
		setSessionCookie(cookies, newJwt);

		// Generate and set new XSRF token
		const xsrfToken = setXsrfToken(cookies);

		logger.info('Token refreshed', {
			userId: payload.sub,
			email: payload.email
		});

		return json({
			success: true,
			xsrfToken // Return new XSRF token so client can update
		});
	} catch (error) {
		return handleRequestError(error, 'refresh');
	}
};
