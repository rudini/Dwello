import { describe, it, expect, vi } from 'vitest';
import { SignJWT } from 'jose';
import { env } from '../../tests/mocks/env'; // what vitest provides as $env/dynamic/private
import { generateJwt } from '$lib/server/auth';
import { handle } from '../hooks.server';

const user = { sub: 'user-1', email: 'verwalter@example.com', name: 'Vera Verwalter', provider: 'google' as const };
const token = () => generateJwt(user);
// Signed like a session, but expired a minute ago
const expiredToken = () =>
	new SignJWT({ ...user })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuer('dwello')
		.setAudience('dwello-app')
		.setExpirationTime(Math.floor(Date.now() / 1000) - 60)
		.sign(new TextEncoder().encode(env.JWT_SECRET));

// Runs the server hook for a request; `resolve` stands for rendering the page
async function request(path: string, session?: string) {
	const url = new URL(`http://localhost:3000${path}`);
	const event = {
		url,
		request: new Request(url),
		cookies: { get: (name: string) => (name === 'dwello_session' ? session : undefined) },
		locals: {} as App.Locals
	};
	const resolve = vi.fn(async () => new Response('Seite'));
	const response = await handle({ event, resolve } as never);
	return { response, resolve, locals: event.locals };
}

describe('Zugang nur mit Anmeldung', () => {
	it('öffnet geschützte Seiten mit gültiger Sitzung und kennt den Benutzer', async () => {
		const { response, locals } = await request('/buildings', await token());

		expect(await response.text()).toBe('Seite');
		expect(locals.user).toMatchObject({ sub: 'user-1', name: 'Vera Verwalter', email: 'verwalter@example.com' });
	});

	it('schickt ohne Anmeldung zur Anmeldeseite und merkt sich die verlangte Seite', async () => {
		const { response, resolve } = await request('/statements?status=overdue');

		expect(response.status).toBe(303);
		expect(response.headers.get('location')).toBe('/login?redirectTo=%2Fstatements%3Fstatus%3Doverdue');
		expect(resolve).not.toHaveBeenCalled();
	});

	it('behandelt eine abgelaufene Sitzung wie keine Anmeldung', async () => {
		const expired = await expiredToken();

		const { response } = await request('/dashboard', expired);

		expect(response.status).toBe(303);
		expect(response.headers.get('location')).toBe('/login?redirectTo=%2Fdashboard');
	});

	it('beantwortet API-Aufrufe ohne Anmeldung mit 401', async () => {
		const { response } = await request('/api/buildings');

		expect(response.status).toBe(401);
	});

	it.each(['/login', '/auth/login?provider=google', '/auth/callback?code=x', '/health'])(
		'lässt %s ohne Anmeldung zu',
		async (path) => {
			const { response } = await request(path);

			expect(await response.text()).toBe('Seite');
		}
	);

	it('führt Angemeldete von der Anmeldeseite zum Dashboard', async () => {
		const { response } = await request('/login', await token());

		expect(response.status).toBe(303);
		expect(response.headers.get('location')).toBe('/dashboard');
	});
});
