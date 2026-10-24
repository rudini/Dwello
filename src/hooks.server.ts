import { json, type Handle, type HandleFetch, type ServerInit } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { getJwtFromCookie, verifyJwt } from '$lib/server/auth';
import { cookieConfig } from '$lib/server/jwt-config';
import { isAllowed } from '$lib/server/allowed-emails';
import { loginPage } from '$lib/server/login-flow';
import { getConfiguredProviders } from '$lib/server/oauth';

const BACKEND_ORIGIN = new URL(process.env.BACKEND_URL || 'http://localhost:3001').origin;

// Reachable without signing in: the login page, the OAuth round trip, the health check, help and the legal pages
const isPublic = (path: string) =>
	['/login', '/setup', '/health', '/help', '/privacy', '/terms'].includes(path) || path.startsWith('/auth/');

async function sessionUser(cookies: Parameters<typeof getJwtFromCookie>[0]) {
	const jwt = getJwtFromCookie(cookies);
	if (!jwt) return undefined;
	try {
		const { sub, email, name, provider } = await verifyJwt(jwt);
		return { sub, email, name, provider };
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

const redirectTo = (location: string) => new Response(null, { status: 303, headers: { location } });

// Every page needs a valid session; without one, pages lead to the login page and API calls get 401.
// A session of an account no longer in ALLOWED_EMAILS counts as none, and its page says why (#51)
const session: Handle = async ({ event, resolve }) => {
	const user = await sessionUser(event.cookies);
	const refused = !!user && !isAllowed(user);
	event.locals.user = refused ? undefined : user;
	const { pathname, search } = event.url;

	if (event.locals.user) return pathname === '/login' ? redirectTo('/dashboard') : resolve(event);
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
				const response = await resolve(event, {
					transformPageChunk: ({ html }) => html.replace('%lang%', locale)
				});
				// Without a cookie the answer depends on the browser language: no cache may hand it to another
				response.headers.append('Vary', 'Accept-Language');
				// A landlord's own app: no page of it (the sign-in page included) belongs in a search engine
				response.headers.set('X-Robots-Tag', 'noindex, nofollow');
				return response;
			}
		});
	});

// Server-side loads and actions call the backend directly; forward the session JWT, but only to the backend.
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const jwt = event.cookies.get(cookieConfig.sessionName);
	if (jwt && new URL(request.url).origin === BACKEND_ORIGIN) {
		request.headers.set('Authorization', `Bearer ${jwt}`);
	}
	return fetch(request);
};
