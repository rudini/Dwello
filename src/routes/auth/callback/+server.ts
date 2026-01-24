/**
 * Auth Callback Endpoint
 * GET /auth/callback?code=xxx&state=xxx
 * Handles OAuth callback, exchanges code for token, creates session
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
import {
	exchangeCodeForToken,
	fetchUserProfile
} from '$lib/server/oauth';
import {
	ValidationError,
	OAuthError,
	handleRequestError,
	logOAuthEvent,
	logAuthError
} from '$lib/server/error-handler';
import { cookieConfig } from '$lib/server/jwt-config';

export const GET: RequestHandler = async ({ url, cookies }) => {
	try {
		// Extract parameters from callback
		const code = url.searchParams.get('code');
		const state = url.searchParams.get('state');
		const error = url.searchParams.get('error');
		const errorDescription = url.searchParams.get('error_description');

		// Handle OAuth provider errors
		if (error) {
			throw new OAuthError(
				errorDescription || `OAuth error: ${error}`,
				'unknown',
				400
			);
		}

		// Validate required parameters
		if (!code) {
			throw new ValidationError('Authorization code is required', 'code');
		}

		if (!state) {
			throw new ValidationError('State parameter is required', 'state');
		}

		// Validate state parameter (CSRF protection)
		if (!validateOAuthState(cookies, state)) {
			logAuthError(
				new Error('OAuth state mismatch'),
				{ operation: 'callback_state_validation' }
			);
			throw new OAuthError(
				'Invalid state parameter. Possible CSRF attack.',
				'unknown',
				400
			);
		}

		logOAuthEvent('callback_received', 'unknown', { hasCode: !!code });

		// Determine provider from stored session or default
		// In a real app, you might store the provider in the state or a separate cookie
		// For now, we'll try both providers (Google first, then Microsoft)
		let userPayload;
		let successProvider: string = 'google';

		try {
			// Try Google first
			const tokenResponse = await exchangeCodeForToken(code, 'google');
			logOAuthEvent('token_exchanged', 'google');

			userPayload = await fetchUserProfile(tokenResponse.access_token, 'google');
			logOAuthEvent('profile_fetched', 'google', { userId: userPayload.sub });
		} catch {
			// Try Microsoft if Google fails
			try {
				const tokenResponse = await exchangeCodeForToken(code, 'microsoft');
				logOAuthEvent('token_exchanged', 'microsoft');

				userPayload = await fetchUserProfile(tokenResponse.access_token, 'microsoft');
				successProvider = 'microsoft';
				logOAuthEvent('profile_fetched', 'microsoft', { userId: userPayload.sub });
			} catch {
				throw new OAuthError(
					'Failed to exchange authorization code with any provider',
					'unknown',
					400
				);
			}
		}

		// Generate JWT
		const jwt = await generateJwt(userPayload);

		// Clear OAuth state cookie
		cookies.delete(cookieConfig.oauthStateName, {
			path: cookieConfig.path,
			domain: cookieConfig.domain
		});

		// Set session cookie (HTTPOnly, Secure, SameSite=Lax)
		setSessionCookie(cookies, jwt);

		// Set XSRF token cookie (readable by JavaScript)
		setXsrfToken(cookies);

		logOAuthEvent('login_complete', successProvider, {
			userId: userPayload.sub,
			email: userPayload.email
		});

		// Redirect to dashboard
		throw redirect(302, '/dashboard');
	} catch (error) {
		// Re-throw redirects
		if (error instanceof Response || (error && typeof error === 'object' && 'status' in error)) {
			throw error;
		}

		// Clear any partial auth state on error
		clearAuthCookies(cookies);

		return handleRequestError(error, 'callback');
	}
};
