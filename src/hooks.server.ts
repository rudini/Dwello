import type { HandleFetch } from '@sveltejs/kit';
import { cookieConfig } from '$lib/server/jwt-config';

const BACKEND_ORIGIN = new URL(process.env.BACKEND_URL || 'http://localhost:3001').origin;

// Server-side loads and actions call the backend directly; forward the session JWT, but only to the backend.
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const jwt = event.cookies.get(cookieConfig.sessionName);
	if (jwt && new URL(request.url).origin === BACKEND_ORIGIN) {
		request.headers.set('Authorization', `Bearer ${jwt}`);
	}
	return fetch(request);
};
