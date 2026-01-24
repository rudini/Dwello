/**
 * Auth Login Endpoint
 * GET /auth/login?provider=google|microsoft
 * Initiates OAuth flow by redirecting to the OAuth provider
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateOAuthState, setOAuthStateCookie } from '$lib/server/auth';
import {
	generateOAuthUrl,
	isValidProvider,
	validateProviderConfig
} from '$lib/server/oauth';
import {
	ValidationError,
	OAuthError,
	handleRequestError,
	logOAuthEvent
} from '$lib/server/error-handler';

export const GET: RequestHandler = async ({ url, cookies }) => {
	try {
		// Extract provider from query params
		const provider = url.searchParams.get('provider');

		// Validate provider parameter
		if (!provider) {
			throw new ValidationError('Provider parameter is required', 'provider');
		}

		if (!isValidProvider(provider)) {
			throw new ValidationError(
				'Invalid provider. Must be "google" or "microsoft"',
				'provider'
			);
		}

		// Check if provider is configured
		if (!validateProviderConfig(provider)) {
			throw new OAuthError(
				`OAuth provider "${provider}" is not configured`,
				provider
			);
		}

		// Generate CSRF protection state
		const state = generateOAuthState();

		// Store state in secure cookie
		setOAuthStateCookie(cookies, state);

		// Log the event
		logOAuthEvent('login_initiated', provider, {
			stateLength: state.length
		});

		// Generate OAuth URL and redirect
		const authUrl = generateOAuthUrl(provider, state);

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
