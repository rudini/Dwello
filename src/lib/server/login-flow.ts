import { m } from '$lib/paraglide/messages';
import type { Cookies } from '@sveltejs/kit';
import { cookieConfig } from './jwt-config';
import { logAuthError } from './error-handler';
import { isValidProvider, type OAuthProvider } from './oauth';

// Remembers, during the OAuth round trip, which provider was chosen and which page to open afterwards
const COOKIE = 'dwello_login';

// Getters: read while the login page is rendered, in that request's language
export const LOGIN_ERRORS = {
	get cancelled() {
		return m.login_error_cancelled();
	},
	get failed() {
		return m.login_error_failed();
	},
	get unavailable() {
		return m.login_error_unavailable();
	},
	get not_allowed() {
		return m.login_error_not_allowed(); // #51: not in ALLOWED_EMAILS
	}
};

export const loginPage = (error: keyof typeof LOGIN_ERRORS) => `/login?error=${error}`;

/** Only pages of this app: a relative path, never "//host" or "/\host" */
const safeTarget = (target: string | null) =>
	target && /^\/(?![/\\])/.test(target) ? target : '/dashboard';

export function rememberLoginFlow(
	cookies: Cookies,
	provider: OAuthProvider,
	redirectTo: string | null
) {
	cookies.set(COOKIE, JSON.stringify({ provider, redirectTo: safeTarget(redirectTo) }), {
		path: '/',
		httpOnly: true,
		secure: cookieConfig.secure,
		sameSite: 'lax',
		maxAge: 600 // the OAuth round trip
	});
}

/** The flow started by /auth/login, read once; null if none was started */
export function takeLoginFlow(
	cookies: Cookies
): { provider: OAuthProvider; redirectTo: string } | null {
	const stored = cookies.get(COOKIE);
	cookies.delete(COOKIE, { path: '/' });
	try {
		const { provider, redirectTo } = JSON.parse(stored ?? '');
		return isValidProvider(provider) ? { provider, redirectTo: safeTarget(redirectTo) } : null;
	} catch {
		return null;
	}
}

/**
 * The login goes into the Protokoll under «Einstellungen» (#357), with its provider only; a backend that cannot record
 * it does not stop the login
 */
export async function recordLogin(jwt: string, provider: OAuthProvider) {
	const timeout = new AbortController();
	const timer = setTimeout(() => timeout.abort(), 5000); // a hanging backend does not hold up the login
	try {
		await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/audit-log/logins`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ provider }),
			signal: timeout.signal
		});
	} catch (error) {
		logAuthError(error instanceof Error ? error : new Error(String(error)), {
			operation: 'record_login'
		});
	} finally {
		clearTimeout(timer);
	}
}
