/**
 * Root Layout Server Load
 * Loads user data from session cookie on every request
 */

import type { LayoutServerLoad } from './$types';
import { getJwtFromCookie, verifyJwt } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	// Public paths that don't require authentication
	const publicPaths = ['/login', '/auth', '/error'];
	const isPublicPath = publicPaths.some((p) => url.pathname.startsWith(p));

	if (isPublicPath) {
		return { user: null };
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
