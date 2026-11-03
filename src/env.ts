import { defineEnvVars } from '@sveltejs/kit/env';

// The server's variables, read when the app runs; an unset one is '', and its reader falls back with ||
export const variables = defineEnvVars({
	UI_GALLERY: { schema: (input) => input ?? '' },
	BACKEND_API_TIMEOUT: { schema: (input) => input ?? '' },
	JWT_SECRET: { schema: (input) => input ?? '' },
	JWT_EXPIRY: { schema: (input) => input ?? '' },
	COOKIE_SECURE: { schema: (input) => input ?? '' },
	COOKIE_SAME_SITE: { schema: (input) => input ?? '' },
	COOKIE_DOMAIN: { schema: (input) => input ?? '' },
	OAUTH_MICROSOFT_TENANT_ID: { schema: (input) => input ?? '' },
	OAUTH_GOOGLE_CLIENT_ID: { schema: (input) => input ?? '' },
	OAUTH_GOOGLE_CLIENT_SECRET: { schema: (input) => input ?? '' },
	OAUTH_GOOGLE_REDIRECT_URI: { schema: (input) => input ?? '' },
	OAUTH_MICROSOFT_CLIENT_ID: { schema: (input) => input ?? '' },
	OAUTH_MICROSOFT_CLIENT_SECRET: { schema: (input) => input ?? '' },
	OAUTH_MICROSOFT_REDIRECT_URI: { schema: (input) => input ?? '' }
});
