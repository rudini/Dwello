/**
 * POST /api/update/later - «Später»: no notice of a new version until the next sign-in (#1453), at most as long as
 * the session (privacy statement, «Cookies»)
 */

import type { RequestHandler } from './$types';
import { validateXsrfForMutation, handleProxyError } from '$lib/server/api-proxy';
import { cookieConfig, jwtConfig } from '$lib/server/jwt-config';
import { LATER_COOKIE } from '$lib/server/update';

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	try {
		validateXsrfForMutation(request, cookies, 'POST');
		const { secure, sameSite, domain, path } = cookieConfig;
		cookies.set(LATER_COOKIE, String(locals.user!.signedInAt), {
			httpOnly: true,
			secure,
			sameSite,
			domain,
			path,
			maxAge: jwtConfig.expirySeconds
		});
		return new Response(null, { status: 204 });
	} catch (error) {
		return handleProxyError(error, 'POST /update/later');
	}
};
