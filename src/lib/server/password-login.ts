import { m } from '$lib/paraglide/messages';
import { getLocale } from '$lib/paraglide/runtime';
import { fail, redirect, type Cookies } from '@sveltejs/kit';
import { generateJwt, setSessionCookie, setXsrfToken } from './auth';
import { logOAuthEvent } from './error-handler';
import { recordLogin, safeTarget } from './login-flow';
import { getConfiguredProviders } from './oauth';
import { backendMessage, type BackendError } from '$lib/backend-error';

// Konto mit Passwort (#576): the backend checks the password, the BFF issues the session as after OAuth
const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/auth/password`;

type Fetch = typeof fetch;

/** Whether the sign-in page offers the password: a Konto mit Passwort exists (false when the backend does not answer) */
export async function passwordAvailable(fetch: Fetch): Promise<boolean> {
	try {
		const response = await fetch(API);
		return response.ok && ((await response.json()) as { available: boolean }).available;
	} catch {
		return false;
	}
}

/** Plain http to another machine: the password and every page cross the network unencrypted (fach review 576 R-1) */
export const insecureConnection = (url: URL) =>
	url.protocol === 'http:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);

// the end of a Sperre in the Swiss time, whatever the server's zone (fach review 576 V-5)
const swissTime = (iso: string) =>
	new Intl.DateTimeFormat(getLocale(), {
		timeZone: 'Europe/Zurich',
		hour: '2-digit',
		minute: '2-digit'
	}).format(new Date(iso));

export async function signInWithPassword(fetch: Fetch, cookies: Cookies, form: FormData) {
	const email = String(form.get('email') ?? '');
	const password = String(form.get('password') ?? '');
	// empty fields are a wrong input, not a failed check (personas Marco and Sven 576 P-1)
	if (!email.trim() || !password) return fail(400, { email, error: m.login_error_invalid() });
	const response = await fetch(API, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	}).catch(() => null);
	if (response?.status === 401) return fail(400, { email, error: m.login_error_invalid() });
	if (response?.status === 423) {
		const { params } = (await response.json()) as { params: { until: string } };
		return fail(423, { email, error: m.login_error_locked({ time: swissTime(params.until) }) });
	}
	// a failing backend is neither a wrong password nor a Sperre, and the backend counted no failed attempt
	if (!response?.ok) return fail(502, { email, error: m.login_error_failed() });
	await startSession(await response.json(), fetch, cookies);
	redirect(303, safeTarget(form.get('redirectTo') as string | null));
}

/** The session of a Konto mit Passwort, as after OAuth, in the Protokoll des Servers too (fach review 576 R-8, 577 R-4) */
async function startSession(account: { sub: string; email: string; name: string }, fetch: Fetch, cookies: Cookies) {
	const jwt = await generateJwt({ ...account, provider: 'local' });
	logOAuthEvent('login_complete', 'local', { userId: account.sub, email: account.email });
	await recordLogin(jwt, 'local', fetch);
	setSessionCookie(cookies, jwt);
	setXsrfToken(cookies);
}

// The setup on the first visit (#577): only while there is neither a Konto mit Passwort nor a provider like Google
const SETUP = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/setup`;

/** Whether a fresh installation still has to be set up (false when the backend does not answer) */
export async function setupNeeded(fetch: Fetch): Promise<boolean> {
	if (getConfiguredProviders().length) return false;
	try {
		const response = await fetch(SETUP);
		return response.ok && ((await response.json()) as { needed: boolean }).needed;
	} catch {
		return false;
	}
}

export async function setUpDwello(fetch: Fetch, cookies: Cookies, form: FormData) {
	const [code, email, password, repeat] = ['code', 'email', 'password', 'repeat'].map((name) => String(form.get(name) ?? ''));
	// empty fields are a missing input, not an invalid request (persona Anna 577 P-1)
	if (!code.trim() || !email.trim() || !password.trim()) return fail(400, { email, error: m.setup_error_empty() });
	if (password !== repeat) return fail(400, { email, error: m.setup_error_repeat() });
	const response = await fetch(SETUP, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ code, email, password })
	}).catch(() => null);
	if (!response) return fail(502, { email, error: m.login_error_failed() });
	if (response.status !== 201) {
		const refusal = (await response.json().catch(() => ({}))) as BackendError;
		if (refusal.code === 'SETUP_DONE') redirect(303, '/login');
		const error =
			refusal.code === 'SETUP_LOCKED'
				? m.setup_error_locked({ time: swissTime(String(refusal.params?.until)) })
				: backendMessage(refusal, m.login_error_failed());
		return fail(response.status, { email, error });
	}
	await startSession(await response.json(), fetch, cookies);
	redirect(303, '/dashboard');
}
