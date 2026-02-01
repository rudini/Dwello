/**
 * Root Layout Server Load
 * Loads user data from session cookie on every request
 */

import type { LayoutServerLoad } from './$types';
import { getJwtFromCookie, verifyJwt } from '$lib/server/auth';
import { env } from '$env/dynamic/private';

// E2E test mock user - used when E2E_TEST_MODE is enabled
const E2E_MOCK_USER = {
	sub: 'e2e-test-user-123',
	email: 'e2e-test@example.com',
	name: 'E2E Test User',
	provider: 'google',
	picture: 'https://example.com/avatar.jpg'
};

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	// Public paths that don't require authentication
	const publicPaths = ['/login', '/auth', '/error'];
	const isPublicPath = publicPaths.some((p) => url.pathname.startsWith(p));

	if (isPublicPath) {
		return { user: null };
	}

	// E2E test mode: bypass authentication and return mock user
	// Unless e2e-skip-auth cookie is set (for testing unauthenticated flows)
	if (env.E2E_TEST_MODE === 'true') {
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
