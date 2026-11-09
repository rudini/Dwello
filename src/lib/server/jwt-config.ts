/**
 * JWT Configuration
 * Exports JWT secret and configuration for token handling
 */

import { env } from '$env/dynamic/private';

const MIN_SECRET_LENGTH = 32;

/**
 * Validates and returns the JWT secret
 * @throws Error if JWT_SECRET is not set or too short
 */
function getJwtSecret(): string {
	// development without a JWT_SECRET uses the backend's fallback (backend/src/middleware/auth.ts); an installation
	// makes its own (docker/init-secrets.sh, #577)
	const secret =
		env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'development-secret-key-change-in-production');

	if (!secret) {
		throw new Error('JWT_SECRET environment variable is required');
	}

	if (secret.length < MIN_SECRET_LENGTH) {
		throw new Error(`JWT_SECRET must be at least ${MIN_SECRET_LENGTH} characters long`);
	}

	return secret;
}

/**
 * Parses JWT expiry string (e.g., "7d", "1h", "30m") to seconds
 */
function parseExpiry(expiry: string): number {
	const match = expiry.match(/^(\d+)([smhd])$/);
	if (!match) {
		return 7 * 24 * 60 * 60; // Default 7 days
	}

	const value = parseInt(match[1], 10);
	const unit = match[2];

	switch (unit) {
		case 's':
			return value;
		case 'm':
			return value * 60;
		case 'h':
			return value * 60 * 60;
		case 'd':
			return value * 24 * 60 * 60;
		default:
			return 7 * 24 * 60 * 60;
	}
}

export const jwtConfig = {
	get secret() {
		return getJwtSecret();
	},
	get expirySeconds() {
		return parseExpiry(env.JWT_EXPIRY || '7d');
	},
	algorithm: 'HS256' as const,
	issuer: 'dwello',
	audience: 'dwello-app'
};

export const cookieConfig = {
	sessionName: 'dwello_session',
	xsrfName: 'dwello_xsrf',
	oauthStateName: 'dwello_oauth_state',
	get secure() {
		return env.COOKIE_SECURE === 'true';
	},
	get sameSite() {
		return (env.COOKIE_SAME_SITE || 'lax') as 'lax' | 'strict' | 'none';
	},
	get domain() {
		return env.COOKIE_DOMAIN || undefined;
	},
	path: '/'
};
