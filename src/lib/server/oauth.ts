/**
 * OAuth Provider Integration
 * Handles OAuth 2.0 flows for Google and Microsoft
 */

import { env } from '$env/dynamic/private';
import type { JwtPayload } from './auth';

export type OAuthProvider = 'google' | 'microsoft';

interface OAuthTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token?: string;
	scope?: string;
	id_token?: string;
}

interface GoogleUserProfile {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name?: string;
	family_name?: string;
}

interface MicrosoftUserProfile {
	id: string;
	displayName: string;
	givenName?: string;
	surname?: string;
	mail?: string;
	userPrincipalName: string;
}

/**
 * OAuth provider configurations
 */
const providerConfigs = {
	google: {
		authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
		tokenUrl: 'https://oauth2.googleapis.com/token',
		userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
		scopes: ['openid', 'email', 'profile']
	},
	microsoft: {
		get authorizeUrl() {
			const tenantId = env.OAUTH_MICROSOFT_TENANT_ID || 'common';
			return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
		},
		get tokenUrl() {
			const tenantId = env.OAUTH_MICROSOFT_TENANT_ID || 'common';
			return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
		},
		userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
		scopes: ['openid', 'email', 'profile', 'User.Read']
	}
};

/**
 * Get OAuth client credentials for a provider
 */
function getClientCredentials(provider: OAuthProvider): {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
} {
	if (provider === 'google') {
		return {
			clientId: env.OAUTH_GOOGLE_CLIENT_ID || '',
			clientSecret: env.OAUTH_GOOGLE_CLIENT_SECRET || '',
			redirectUri: env.OAUTH_GOOGLE_REDIRECT_URI || ''
		};
	} else {
		return {
			clientId: env.OAUTH_MICROSOFT_CLIENT_ID || '',
			clientSecret: env.OAUTH_MICROSOFT_CLIENT_SECRET || '',
			redirectUri: env.OAUTH_MICROSOFT_REDIRECT_URI || ''
		};
	}
}

/**
 * Validate provider credentials are configured
 */
export function validateProviderConfig(provider: OAuthProvider): boolean {
	const creds = getClientCredentials(provider);
	return !!(creds.clientId && creds.clientSecret && creds.redirectUri);
}

/**
 * Generate OAuth authorization URL
 * @param provider OAuth provider (google | microsoft)
 * @param state CSRF protection state parameter
 * @returns Authorization URL to redirect user to
 */
export function generateOAuthUrl(provider: OAuthProvider, state: string): string {
	const config = providerConfigs[provider];
	const creds = getClientCredentials(provider);

	if (!creds.clientId || !creds.redirectUri) {
		throw new Error(`OAuth credentials not configured for provider: ${provider}`);
	}

	const params = new URLSearchParams({
		client_id: creds.clientId,
		redirect_uri: creds.redirectUri,
		response_type: 'code',
		scope: config.scopes.join(' '),
		state: state
	});

	// Microsoft-specific parameters
	if (provider === 'microsoft') {
		params.set('response_mode', 'query');
	}

	return `${config.authorizeUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 * @param code Authorization code from OAuth callback
 * @param provider OAuth provider
 * @returns Access token and related data
 */
export async function exchangeCodeForToken(
	code: string,
	provider: OAuthProvider
): Promise<OAuthTokenResponse> {
	const config = providerConfigs[provider];
	const creds = getClientCredentials(provider);

	const params = new URLSearchParams({
		client_id: creds.clientId,
		client_secret: creds.clientSecret,
		code: code,
		redirect_uri: creds.redirectUri,
		grant_type: 'authorization_code'
	});

	const response = await fetch(config.tokenUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: params.toString()
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
	}

	return response.json();
}

/**
 * Fetch user profile from OAuth provider
 * @param accessToken Access token from token exchange
 * @param provider OAuth provider
 * @returns User profile data normalized to JwtPayload format
 */
export async function fetchUserProfile(
	accessToken: string,
	provider: OAuthProvider
): Promise<JwtPayload & { emailVerified: boolean }> {
	const config = providerConfigs[provider];

	const response = await fetch(config.userInfoUrl, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to fetch user profile: ${response.status} - ${errorText}`);
	}

	if (provider === 'google') {
		const profile: GoogleUserProfile = await response.json();
		return {
			sub: profile.id,
			email: profile.email,
			name: profile.name,
			provider: 'google',
			emailVerified: profile.verified_email // ALLOWED_EMAILS counts only verified addresses (#51)
		};
	} else {
		const profile: MicrosoftUserProfile = await response.json();
		return {
			sub: profile.id,
			email: profile.mail || profile.userPrincipalName,
			name: profile.displayName,
			provider: 'microsoft',
			emailVerified: false // `mail` / `userPrincipalName` of tenant `common` is not verified
		};
	}
}

/**
 * Check if a provider string is valid
 */
export function isValidProvider(provider: string): provider is OAuthProvider {
	return provider === 'google' || provider === 'microsoft';
}

/** How the login page and the privacy page name a provider */
export const PROVIDER_NAMES: Record<OAuthProvider, string> = {
	google: 'Google',
	microsoft: 'Microsoft'
};

/**
 * Get list of configured OAuth providers
 */
export function getConfiguredProviders(): OAuthProvider[] {
	const providers: OAuthProvider[] = [];

	if (validateProviderConfig('google')) {
		providers.push('google');
	}

	if (validateProviderConfig('microsoft')) {
		providers.push('microsoft');
	}

	return providers;
}
