/**
 * Mock environment variables for testing
 */

export const env: Record<string, string | undefined> = {
	JWT_SECRET: 'test-secret-key-that-is-at-least-32-characters-long-for-testing',
	JWT_EXPIRY: '1h',
	COOKIE_SECURE: 'false',
	COOKIE_SAME_SITE: 'lax',
	COOKIE_DOMAIN: 'localhost',
	OAUTH_GOOGLE_CLIENT_ID: 'google-client-id',
	OAUTH_GOOGLE_CLIENT_SECRET: 'google-client-secret',
	OAUTH_GOOGLE_REDIRECT_URI: 'http://localhost:3000/auth/callback',
	OAUTH_MICROSOFT_CLIENT_ID: 'microsoft-client-id',
	OAUTH_MICROSOFT_CLIENT_SECRET: 'microsoft-client-secret',
	OAUTH_MICROSOFT_REDIRECT_URI: 'http://localhost:3000/auth/callback',
	OAUTH_MICROSOFT_TENANT_ID: 'common',
	NODE_ENV: 'test',
	LOG_LEVEL: 'error'
};
