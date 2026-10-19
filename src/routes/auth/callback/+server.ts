/**
 * Auth Callback Endpoint
 * GET /auth/callback?code=xxx&state=xxx
 * Handles the OAuth callback: exchanges the code with the provider the login started with,
 * creates the session and opens the page that was asked for before signing in.
 * Any failure leads back to the login page with a message.
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	validateOAuthState,
	generateJwt,
	setSessionCookie,
	setXsrfToken,
	clearAuthCookies
} from '$lib/server/auth';
import { exchangeCodeForToken, fetchUserProfile } from '$lib/server/oauth';
import { isAllowed } from '$lib/server/allowed-emails';
import { logAuthError, logOAuthEvent } from '$lib/server/error-handler';
import { cookieConfig } from '$lib/server/jwt-config';
import { loginPage, recordLogin, takeLoginFlow } from '$lib/server/login-flow';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const flow = takeLoginFlow(cookies);

	// The user cancelled at the provider (e.g. access_denied)
	if (url.searchParams.get('error')) {
		clearAuthCookies(cookies);
		throw redirect(303, loginPage('cancelled'));
	}

	// CSRF protection: the state must be the one this browser started the login with
	if (!code || !state || !flow || !validateOAuthState(cookies, state)) {
		logAuthError(new Error('OAuth callback without a matching login'), {
			operation: 'callback_state_validation'
		});
		clearAuthCookies(cookies);
		throw redirect(303, loginPage('failed'));
	}

	let user: Awaited<ReturnType<typeof fetchUserProfile>>;
	let jwt: string;
	try {
		const token = await exchangeCodeForToken(code, flow.provider);
		user = await fetchUserProfile(token.access_token, flow.provider);
		jwt = await generateJwt(user);
	} catch (error) {
		logAuthError(error instanceof Error ? error : new Error(String(error)), {
			operation: 'callback'
		});
		clearAuthCookies(cookies);
		throw redirect(303, loginPage('failed'));
	}

	// #51: an account outside ALLOWED_EMAILS gets no session
	if (!isAllowed(user)) {
		logOAuthEvent('login_failed', flow.provider, { reason: 'not_allowed', email: user.email });
		clearAuthCookies(cookies);
		throw redirect(303, loginPage('not_allowed'));
	}
	logOAuthEvent('login_complete', flow.provider, { userId: user.sub, email: user.email });

	cookies.delete(cookieConfig.oauthStateName, {
		path: cookieConfig.path,
		domain: cookieConfig.domain
	});
	await recordLogin(jwt, flow.provider);
	setSessionCookie(cookies, jwt);
	setXsrfToken(cookies);
	throw redirect(303, flow.redirectTo);
};
