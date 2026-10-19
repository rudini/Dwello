import { afterEach, describe, it, expect, vi } from 'vitest';
import { generateJwt } from '$lib/server/auth';
import { handle, handleFetch, init } from '../hooks.server';

async function forwarded(url: string, session?: string) {
	let sent: Request | undefined;
	await handleFetch({
		event: {
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

describe('Start in Produktion (#51)', () => {
	afterEach(() => vi.unstubAllEnvs());

	it('verweigert den Start ohne ALLOWED_EMAILS', () => {
		vi.stubEnv('NODE_ENV', 'production');
		vi.stubEnv('ALLOWED_EMAILS', '');

		expect(() => init()).toThrow('ALLOWED_EMAILS');
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
