import { m } from '$lib/paraglide/messages';
import { getLocale } from '$lib/paraglide/runtime';
import { fail, redirect, type Cookies } from '@sveltejs/kit';
import { generateJwt, setSessionCookie, setXsrfToken } from './auth';
import { recordLogin, safeTarget } from './login-flow';

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
	new Intl.DateTimeFormat(getLocale(), { timeZone: 'Europe/Zurich', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

export async function signInWithPassword(fetch: Fetch, cookies: Cookies, form: FormData) {
	const email = String(form.get('email') ?? '');
	const response = await fetch(API, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password: String(form.get('password') ?? '') })
	}).catch(() => null);
	if (response?.status === 401) return fail(400, { email, error: m.login_error_invalid() });
	if (response?.status === 423) {
		const { params } = (await response.json()) as { params: { until: string } };
		return fail(423, { email, error: m.login_error_locked({ time: swissTime(params.until) }) });
	}
	// a failing backend is neither a wrong password nor a Sperre, and the backend counted no failed attempt
	if (!response?.ok) return fail(502, { email, error: m.login_error_failed() });
	const account = (await response.json()) as { sub: string; email: string; name: string };
	const jwt = await generateJwt({ ...account, provider: 'local' });
	await recordLogin(jwt, 'local', fetch);
	setSessionCookie(cookies, jwt);
	setXsrfToken(cookies);
	redirect(303, safeTarget(form.get('redirectTo') as string | null));
}
