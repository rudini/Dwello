/**
 * Auth Login Endpoint
 * GET /auth/login?provider=google|microsoft
 * Initiates OAuth flow by redirecting to the OAuth provider
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateOAuthState, setOAuthStateCookie } from '$lib/server/auth';
import { generateOAuthUrl, isValidProvider, validateProviderConfig } from '$lib/server/oauth';
import { ValidationError, handleRequestError, logOAuthEvent } from '$lib/server/error-handler';
import { loginPage, rememberLoginFlow } from '$lib/server/login-flow';

export const GET: RequestHandler = async ({ url, cookies }) => {
	try {
		// Extract provider from query params
		const provider = url.searchParams.get('provider');

		// Validate provider parameter
		if (!provider) {
			throw new ValidationError('Provider parameter is required', 'provider');
		}

		if (!isValidProvider(provider)) {
			throw new ValidationError('Invalid provider. Must be "google" or "microsoft"', 'provider');
		}

		// The login page offers configured providers only; anything else leads back to it
		if (!validateProviderConfig(provider)) {
			throw redirect(303, loginPage('unavailable'));
		}

		// Generate CSRF protection state
		const state = generateOAuthState();

		// Store state in secure cookie
		setOAuthStateCookie(cookies, state);
		rememberLoginFlow(cookies, provider, url.searchParams.get('redirectTo'));

		// Log the event
		logOAuthEvent('login_initiated', provider, {
			stateLength: state.length
		});

		// Generate OAuth URL and redirect
		const authUrl = generateOAuthUrl(provider, state, { again: url.searchParams.get('reauth') === '1' });

		// Redirect to OAuth provider
		throw redirect(302, authUrl);
	} catch (error) {
		// Re-throw redirects
		if (error instanceof Response || (error && typeof error === 'object' && 'status' in error)) {
			throw error;
		}

		return handleRequestError(error, 'login');
	}
};
