/**
 * Auth Callback Endpoint
 * GET /auth/callback?code=xxx&state=xxx
 * Handles the OAuth callback: exchanges the code with the provider the login started with,
 * creates the session and opens the page that was asked for before signing in.
 * Any failure leads back to the login page with a message.
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateOAuthState, generateJwt, setSessionCookie, setXsrfToken, clearAuthCookies } from '$lib/server/auth';
import { exchangeCodeForToken, fetchUserProfile } from '$lib/server/oauth';
import { logAuthError, logOAuthEvent } from '$lib/server/error-handler';
import { cookieConfig } from '$lib/server/jwt-config';
import { loginPage, takeLoginFlow } from '$lib/server/login-flow';

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
		logAuthError(new Error('OAuth callback without a matching login'), { operation: 'callback_state_validation' });
		clearAuthCookies(cookies);
		throw redirect(303, loginPage('failed'));
	}

	let jwt: string;
	try {
		const token = await exchangeCodeForToken(code, flow.provider);
		const user = await fetchUserProfile(token.access_token, flow.provider);
		jwt = await generateJwt(user);
		logOAuthEvent('login_complete', flow.provider, { userId: user.sub, email: user.email });
	} catch (error) {
		logAuthError(error instanceof Error ? error : new Error(String(error)), { operation: 'callback' });
		clearAuthCookies(cookies);
		throw redirect(303, loginPage('failed'));
	}

	cookies.delete(cookieConfig.oauthStateName, { path: cookieConfig.path, domain: cookieConfig.domain });
	setSessionCookie(cookies, jwt);
	setXsrfToken(cookies);
	throw redirect(303, flow.redirectTo);
};
