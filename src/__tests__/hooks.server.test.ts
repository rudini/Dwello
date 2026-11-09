import { afterEach, describe, it, expect, vi } from 'vitest';
import { generateJwt } from '$lib/server/auth';
import { handle, handleFetch, init } from '../hooks.server';
import { env as mockEnv } from '../../tests/mocks/env'; // what vitest provides as $env/dynamic/private

async function forwarded(url: string, session?: string) {
	let sent: Request | undefined;
	await handleFetch({
		event: {
			params: {},
			cookies: { get: (name: string) => (name === 'dwello_session' ? session : undefined) }
		},
		request: new Request(url),
		fetch: async (request: Request) => {
			sent = request;
			return new Response('{}');
		}
	} as never);
	return sent!.headers.get('authorization');
}

describe('Server-seitige Backend-Aufrufe', () => {
	it('senden das Sitzungs-Token an das Backend', async () => {
		expect(await forwarded('http://localhost:3001/api/v1/buildings', 'jwt-123')).toBe(
			'Bearer jwt-123'
		);
	});

	it('senden das Sitzungs-Token nie an andere Server', async () => {
		expect(await forwarded('https://openplzapi.org/ch/Localities', 'jwt-123')).toBeNull();
	});

	it('senden ohne Sitzung kein Token', async () => {
		expect(await forwarded('http://localhost:3001/api/v1/buildings')).toBeNull();
	});
});

describe('Sitzung eines Kontos ohne Zugang (#51)', () => {
	afterEach(() => vi.unstubAllEnvs());

	async function answer(path: string, email: string) {
		vi.stubEnv('ALLOWED_EMAILS', 'verwalter@example.com');
		const jwt = await generateJwt({ sub: 's-1', email, name: 'Vera', provider: 'google' });
		const url = new URL(`http://localhost${path}`);
		return handle({
			event: {
				url,
				request: new Request(url),
				cookies: { get: (name: string) => (name === 'dwello_session' ? jwt : undefined) },
				locals: {}
			},
			resolve: async () => new Response('page')
		} as never);
	}

	it('führt eine Seite zur Anmeldung mit dem Grund', async () => {
		const response = await answer('/dashboard', 'fremd@example.com');

		expect(response.status).toBe(303);
		expect(response.headers.get('location')).toBe('/login?error=not_allowed');
	});

	it('beantwortet einen API-Aufruf mit 401', async () => {
		expect((await answer('/api/buildings', 'fremd@example.com')).status).toBe(401);
	});

	it('lässt ein erlaubtes Konto wie bisher durch', async () => {
		expect(await (await answer('/dashboard', 'verwalter@example.com')).text()).toBe('page');
	});
});

describe('Suchmaschinen', () => {
	it('nehmen die Anmeldeseite nicht in ihren Index auf', async () => {
		const url = new URL('http://localhost/login');
		const response = await handle({
			event: { url, request: new Request(url), cookies: { get: () => undefined }, locals: {} },
			resolve: async () => new Response('page')
		} as never);

		expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
	});
});

describe('Start in Produktion (#51)', () => {
	afterEach(() => vi.unstubAllEnvs());

	it('verweigert den Start ohne ALLOWED_EMAILS', () => {
		vi.stubEnv('NODE_ENV', 'production');
		vi.stubEnv('ALLOWED_EMAILS', '');

		expect(() => init()).toThrow('ALLOWED_EMAILS');
	});

	// #576: ALLOWED_EMAILS names who may sign in through a provider; a Konto mit Passwort needs no list
	it('startet ohne ALLOWED_EMAILS, wenn kein Anbieter eingerichtet ist', () => {
		vi.stubEnv('NODE_ENV', 'production');
		vi.stubEnv('ALLOWED_EMAILS', '');
		const ids = [mockEnv.OAUTH_GOOGLE_CLIENT_ID, mockEnv.OAUTH_MICROSOFT_CLIENT_ID];
		mockEnv.OAUTH_GOOGLE_CLIENT_ID = '';
		mockEnv.OAUTH_MICROSOFT_CLIENT_ID = '';
		try {
			expect(() => init()).not.toThrow();
		} finally {
			[mockEnv.OAUTH_GOOGLE_CLIENT_ID, mockEnv.OAUTH_MICROSOFT_CLIENT_ID] = ids;
		}
	});

	it('startet mit einer Liste und ausserhalb der Produktion auch ohne', () => {
		vi.stubEnv('NODE_ENV', 'production');
		vi.stubEnv('ALLOWED_EMAILS', '*');
		expect(() => init()).not.toThrow();

		vi.stubEnv('NODE_ENV', 'development');
		vi.stubEnv('ALLOWED_EMAILS', '');
		expect(() => init()).not.toThrow();
	});
});

describe('Browser-Cache (#679)', () => {
	it('bewahrt keine Seite auf, damit Zurück eine gelöschte Abrechnung nicht mehr zeigt', async () => {
		const jwt = await generateJwt({
			sub: 's-1',
			email: 'verwalter@example.com',
			name: 'Vera',
			provider: 'google'
		});
		const url = new URL('http://localhost/statements/s-1');
		const response = await handle({
			event: { url, request: new Request(url), cookies: { get: () => jwt }, locals: {} },
			resolve: async () => new Response('page')
		} as never);

		expect(await response.text()).toBe('page');
		expect(response.headers.get('cache-control')).toBe('no-store');
	});
});

describe('Dateien der App (#1377)', () => {
	it('lässt den Browser die Art einer Datei nicht erraten', async () => {
		const url = new URL('http://localhost/help');
		const response = await handle({
			event: { url, request: new Request(url), cookies: { get: () => undefined }, locals: {} },
			resolve: async () =>
				new Response('<p>', { headers: { 'content-type': 'application/octet-stream' } })
		} as never);

		expect(response.headers.get('x-content-type-options')).toBe('nosniff');
	});
});

// #1377: a decoded «%2F» or «..» in an address would point the signed-in request at another path of the backend
describe('Adresse mit einer ID, die keine ist', () => {
	const id = '3f2a7c1e-9b4d-4e8a-a1c2-5d6e7f809a1b';

	async function fetched(params: Record<string, string>) {
		let sent = false;
		const response = await handleFetch({
			event: { params, cookies: { get: () => 'jwt-123' } },
			request: new Request('http://localhost:3001/api/v1/tenants/x'),
			fetch: async () => {
				sent = true;
				return new Response('{}');
			}
		} as never);
		return { sent, status: response.status };
	}

	it('fragt das Backend aus einer Seite nicht an', async () => {
		expect(await fetched({ id: '../buildings' })).toEqual({ sent: false, status: 404 });
	});

	it('fragt das Backend mit einer echten ID an', async () => {
		expect(await fetched({ id })).toEqual({ sent: true, status: 200 });
	});

	it('beantwortet einen API-Aufruf mit 404, ohne ihn weiterzugeben', async () => {
		const jwt = await generateJwt({
			sub: 's-1',
			email: 'verwalter@example.com',
			name: 'Vera',
			provider: 'google'
		});
		const url = new URL('http://localhost/api/tenants/x%2Fexport');
		let resolved = false;
		const response = await handle({
			event: {
				url,
				params: { id: 'x/export' },
				request: new Request(url),
				cookies: { get: () => jwt },
				locals: {}
			},
			resolve: async () => {
				resolved = true;
				return new Response('{}');
			}
		} as never);

		expect({ resolved, status: response.status }).toEqual({ resolved: false, status: 404 });
	});
});
