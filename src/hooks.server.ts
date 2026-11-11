import { json, type Handle, type HandleFetch, type ServerInit } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { decodeJwt } from 'jose';
import { getJwtFromCookie, setXsrfToken, verifyJwt } from '$lib/server/auth';
import { cookieConfig } from '$lib/server/jwt-config';
import { isAllowed } from '$lib/server/allowed-emails';
import { loginPage } from '$lib/server/login-flow';
import { getConfiguredProviders } from '$lib/server/oauth';
import { backupState } from '$lib/server/backup';

const BACKEND_ORIGIN = new URL(process.env.BACKEND_URL || 'http://localhost:3001').origin;

// Reachable without signing in: the login page, the OAuth round trip, the health check, help, the legal pages and
// /mcp, where the backend checks the Zugangsschlüssel (#817)
const isPublic = (path: string) =>
	['/login', '/setup', '/health', '/help', '/privacy', '/terms', '/mcp'].includes(path) || path.startsWith('/auth/');

async function sessionUser(cookies: Parameters<typeof getJwtFromCookie>[0]) {
	const jwt = getJwtFromCookie(cookies);
	if (!jwt) return undefined;
	try {
		const { sub, email, name, provider, auth_time, iat } = await verifyJwt(jwt);
		return { sub, email, name, provider, signedInAt: auth_time ?? iat };
	} catch {
		return undefined; // expired or forged
	}
}

// Production without ALLOWED_EMAILS would let every Google or Microsoft account in (#51); «*» says so on purpose. Without
// a provider only a Konto mit Passwort signs in, and the list has nothing to limit (#576)
export const init: ServerInit = () => {
	if (process.env.NODE_ENV === 'production' && getConfiguredProviders().length && !process.env.ALLOWED_EMAILS?.trim())
		throw new Error(
			'ALLOWED_EMAILS is not set: name the e-mail addresses that may sign in, or «*» for every account'
		);
};

// Every route param but the EGID (a number for the Gebäuderegister) is the UUID of a record and goes into a backend
// address: anything else («x%2Fexport», «..») would point the signed-in request at another path there (#1377)
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const foreignId = ({ egid: _egid, ...ids }: Partial<Record<string, string>>) =>
	!Object.values(ids).map(String).every(UUID.test, UUID);
const NOT_FOUND = { error: { code: 'NOT_FOUND', message: 'Not found' } };

const redirectTo = (location: string) => new Response(null, { status: 303, headers: { location } });

// Every page needs a valid session; without one, pages lead to the login page and API calls get 401.
// A session of an account no longer in ALLOWED_EMAILS counts as none, and its page says why (#51)
const session: Handle = async ({ event, resolve }) => {
	const user = await sessionUser(event.cookies);
	const refused = !!user && !isAllowed(user);
	event.locals.user = refused ? undefined : user;
	const { pathname, search } = event.url;

	if (event.locals.user) {
		// #1434: a browser that lost the XSRF cookie gets a new one, valid as long as the session (privacy statement)
		if (!event.cookies.get(cookieConfig.xsrfName))
			setXsrfToken(
				event.cookies,
				decodeJwt(getJwtFromCookie(event.cookies)!).exp! - Math.floor(Date.now() / 1000)
			);
		if (pathname === '/login') return redirectTo('/dashboard');
		// #718 (A8): until the landlord confirmed the Wiederherstellungscode, every page of the app leads to «Sicherung
		// einrichten»; help, the legal pages and the API stay reachable
		if (!isPublic(pathname) && !pathname.startsWith('/api/') && !pathname.startsWith('/backup') && (await backupState(event.fetch)).backup === 'setup')
			return redirectTo('/backup');
		return resolve(event);
	}
	if (isPublic(pathname)) return resolve(event);
	if (pathname.startsWith('/api/'))
		return json({ error: { code: 'JWT_ERROR', message: 'Not signed in' } }, { status: 401 });
	if (refused) return redirectTo(loginPage('not_allowed'));
	return redirectTo(`/login?redirectTo=${encodeURIComponent(pathname + search)}`);
};

// UI language from the cookie, else the browser's, else German, around the session check; <html lang> follows it
export const handle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;
		return session({
			event,
			resolve: async (event) => {
				const response =
					event.url.pathname.startsWith('/api/') && foreignId(event.params)
						? json(NOT_FOUND, { status: 404 })
						: await resolve(event, {
								transformPageChunk: ({ html }) => html.replace('%lang%', locale)
							});
				// Without a cookie the answer depends on the browser language: no cache may hand it to another
				response.headers.append('Vary', 'Accept-Language');
				// A landlord's own app: no page of it (the sign-in page included) belongs in a search engine
				response.headers.set('X-Robots-Tag', 'noindex, nofollow');
				// Private and changing data: back, forward and another tab load it anew, never a deleted record (#679)
				response.headers.set('Cache-Control', 'no-store');
				// a file (a Beleg, an export) is shown only as the kind it is sent with (#1377)
				response.headers.set('X-Content-Type-Options', 'nosniff');
				return response;
			}
		});
	});

// Server-side loads and actions call the backend directly; forward the session JWT, but only to the backend.
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (new URL(request.url).origin !== BACKEND_ORIGIN) return fetch(request);
	if (foreignId(event.params)) return json(NOT_FOUND, { status: 404 });
	const jwt = event.cookies.get(cookieConfig.sessionName);
	if (jwt) request.headers.set('Authorization', `Bearer ${jwt}`);
	return fetch(request);
};
