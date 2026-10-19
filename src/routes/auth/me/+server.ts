/**
 * Auth Me Endpoint
 * GET /auth/me
 * Returns current authenticated user information
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getJwtFromCookie, verifyJwt } from '$lib/server/auth';
import { JWTError, handleRequestError, logger } from '$lib/server/error-handler';
import { isAllowed } from '$lib/server/allowed-emails';

/**
 * User response structure (safe to expose to client)
 */
interface UserResponse {
	sub: string;
	email: string;
	name: string;
	provider: string;
}

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		// Extract JWT from session cookie
		const jwt = getJwtFromCookie(cookies);

		if (!jwt) {
			throw new JWTError('Not authenticated', 401);
		}

		// Verify JWT signature and expiration
		let payload;
		try {
			payload = await verifyJwt(jwt);
		} catch (error) {
			logger.debug('JWT verification failed', {
				error: error instanceof Error ? error.message : 'Unknown error'
			});
			throw new JWTError('Invalid or expired token', 401);
		}
		// #51: /auth/* passes the session check of hooks.server.ts, so the account is checked here
		if (!isAllowed(payload)) throw new JWTError('Account not allowed', 401);

		// Return user information (sanitized)
		const user: UserResponse = {
			sub: payload.sub,
			email: payload.email,
			name: payload.name,
			provider: payload.provider
		};

		return json({ user });
	} catch (error) {
		return handleRequestError(error, 'me');
	}
};
