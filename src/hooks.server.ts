import { json, type Handle, type HandleFetch } from '@sveltejs/kit';
import { getJwtFromCookie, verifyJwt } from '$lib/server/auth';
import { cookieConfig } from '$lib/server/jwt-config';

const BACKEND_ORIGIN = new URL(process.env.BACKEND_URL || 'http://localhost:3001').origin;

// Reachable without signing in: the login page, the OAuth round trip and the health check
const isPublic = (path: string) =>
	path === '/login' || path.startsWith('/auth/') || path === '/health';

async function sessionUser(cookies: Parameters<typeof getJwtFromCookie>[0]) {
	const jwt = getJwtFromCookie(cookies);
	if (!jwt) return undefined;
	try {
		const { sub, email, name, provider, picture } = await verifyJwt(jwt);
		return { sub, email, name, provider, picture };
	} catch {
		return undefined; // expired or forged
	}
}

const redirectTo = (location: string) => new Response(null, { status: 303, headers: { location } });

// Every page needs a valid session; without one, pages lead to the login page and API calls get 401
export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = await sessionUser(event.cookies);
	const { pathname, search } = event.url;

	if (event.locals.user) return pathname === '/login' ? redirectTo('/dashboard') : resolve(event);
	if (isPublic(pathname)) return resolve(event);
	if (pathname.startsWith('/api/'))
		return json({ error: { code: 'JWT_ERROR', message: 'Nicht angemeldet' } }, { status: 401 });
	return redirectTo(`/login?redirectTo=${encodeURIComponent(pathname + search)}`);
};

// Server-side loads and actions call the backend directly; forward the session JWT, but only to the backend.
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const jwt = event.cookies.get(cookieConfig.sessionName);
	if (jwt && new URL(request.url).origin === BACKEND_ORIGIN) {
		request.headers.set('Authorization', `Bearer ${jwt}`);
	}
	return fetch(request);
};
