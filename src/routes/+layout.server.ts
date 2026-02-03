/**
 * Root Layout Server Load
 * Loads user data from session cookie on every request
 */

import type { LayoutServerLoad } from './$types';
import { getJwtFromCookie, verifyJwt } from '$lib/server/auth';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

/**
 * E2E Test Mode Configuration
 *
 * SECURITY WARNING: E2E_TEST_MODE bypasses all authentication!
 * This should ONLY be enabled in development/test environments.
 *
 * The following safeguards are in place:
 * 1. Only works when NODE_ENV is not 'production'
 * 2. Requires explicit E2E_TEST_MODE=true environment variable
 * 3. Logs a warning when enabled
 */
const E2E_MOCK_USER = {
	sub: 'e2e-test-user-123',
	email: 'e2e-test@example.com',
	name: 'E2E Test User',
	provider: 'google',
	picture: 'https://example.com/avatar.jpg'
};

/**
 * Check if E2E test mode is safely enabled
 * Only allows E2E mode in non-production environments
 */
function isE2ETestModeEnabled(): boolean {
	// CRITICAL: Never allow E2E test mode in production
	if (env.NODE_ENV === 'production' || !dev) {
		if (env.E2E_TEST_MODE === 'true') {
			console.error(
				'SECURITY ERROR: E2E_TEST_MODE is set but blocked in production environment'
			);
		}
		return false;
	}

	return env.E2E_TEST_MODE === 'true';
}

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	// Public paths that don't require authentication
	const publicPaths = ['/login', '/auth', '/error'];
	const isPublicPath = publicPaths.some((p) => url.pathname.startsWith(p));

	if (isPublicPath) {
		return { user: null };
	}

	// E2E test mode: bypass authentication and return mock user
	// Unless e2e-skip-auth cookie is set (for testing unauthenticated flows)
	// SECURITY: This is only enabled in non-production environments
	if (isE2ETestModeEnabled()) {
		if (cookies.get('e2e-skip-auth') === 'true') {
			return { user: null };
		}
		return { user: E2E_MOCK_USER };
	}

	const jwt = getJwtFromCookie(cookies);

	if (!jwt) {
		return { user: null };
	}

	try {
		const payload = await verifyJwt(jwt);
		return {
			user: {
				sub: payload.sub,
				email: payload.email,
				name: payload.name,
				provider: payload.provider,
				picture: payload.picture
			}
		};
	} catch {
		return { user: null };
	}
};
