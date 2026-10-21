import { describe, it, expect, vi } from 'vitest';
import { env } from '../../tests/mocks/env'; // what vitest provides as $env/dynamic/private
import { m } from '$lib/paraglide/messages';
import { verifyJwt } from '$lib/server/auth';
import { actions, load } from '../routes/setup/+page.server';
import { load as loadLogin } from '../routes/login/+page.server';
import needed from '../../tests/contracts/setup-needed.json';
import account from '../../tests/contracts/setup.json';
import invalid from '../../tests/contracts/setup-code-invalid.json';
import available from '../../tests/contracts/auth-password-available.json';

// The setup on the first visit (#577): only while there is neither a Konto mit Passwort nor a provider like Google
type Backend = (url: string, init?: RequestInit) => Response;

const fresh: Backend = (url) =>
	url.endsWith('/auth/password')
		? Response.json({ ...available, available: false })
		: Response.json(needed);

/** Runs with no provider configured, as a fresh installation without a .env */
async function withoutProviders<T>(run: () => Promise<T>): Promise<T> {
	const kept = { google: env.OAUTH_GOOGLE_CLIENT_ID, microsoft: env.OAUTH_MICROSOFT_CLIENT_ID };
	env.OAUTH_GOOGLE_CLIENT_ID = '';
	env.OAUTH_MICROSOFT_CLIENT_ID = '';
	try {
		return await run();
	} finally {
		env.OAUTH_GOOGLE_CLIENT_ID = kept.google;
		env.OAUTH_MICROSOFT_CLIENT_ID = kept.microsoft;
	}
}

const thrown = async (run: () => unknown) => {
	try {
		return await run();
	} catch (error) {
		return error;
	}
};

const open = (backend: Backend) =>
	thrown(() =>
		load({
			url: new URL('http://localhost:3000/setup'),
			fetch: async (url: string) => backend(url)
		} as never)
	);

async function setUp(fields: Record<string, string>, backend: Backend) {
	const jar = new Map<string, string>();
	const cookies = {
		set: (name: string, value: string) => jar.set(name, value),
		get: (name: string) => jar.get(name),
		delete: () => {}
	};
	const body = new FormData();
	for (const [name, value] of Object.entries(fields)) body.set(name, value);
	const calls: { url: string; init?: RequestInit }[] = [];
	const fetch = async (url: string, init?: RequestInit) => (
		calls.push({ url, init }),
		backend(url, init)
	);
	const result = await thrown(() =>
		actions.default({
			request: new Request('http://localhost/setup', { method: 'POST', body }),
			cookies,
			fetch
		} as never)
	);
	return { result, jar, calls };
}

const fields = {
	code: 'E2E7-K4QX',
	email: account.email,
	password: 'ein-langes-Passwort',
	repeat: 'ein-langes-Passwort'
};
const answering =
	(status: number, json: object): Backend =>
	(url) =>
		url.endsWith('/audit-log/logins')
			? new Response(null, { status: 201 })
			: Response.json(json, { status });

describe('Einrichtung beim ersten Aufruf', () => {
	it('führt einen Besucher der frischen Installation von der Anmeldung zur Einrichtung', async () => {
		const result = await withoutProviders(() =>
			thrown(() =>
				loadLogin({
					url: new URL('http://localhost:3000/login'),
					fetch: async (url: string) => fresh(url)
				} as never)
			)
		);

		expect(result).toMatchObject({ status: 303, location: '/setup' });
	});

	it('zeigt die Einrichtung, solange Dwello nicht eingerichtet ist', async () => {
		expect(await withoutProviders(() => open(fresh))).toEqual({});
	});

	it('führt zur Anmeldung, sobald es ein Konto mit Passwort gibt', async () => {
		expect(
			await withoutProviders(() => open(() => Response.json({ ...needed, needed: false })))
		).toMatchObject({
			status: 303,
			location: '/login'
		});
	});

	it('führt zur Anmeldung, wenn ein Anbieter wie Google eingerichtet ist', async () => {
		expect(await open(fresh)).toMatchObject({ status: 303, location: '/login' });
	});

	it('legt das Konto an, meldet es an und führt zur Übersicht', async () => {
		const { result, jar, calls } = await setUp(fields, answering(201, account));

		expect(result).toMatchObject({ status: 303, location: '/dashboard' });
		expect(await verifyJwt(jar.get('dwello_session')!)).toMatchObject({
			sub: account.sub,
			email: account.email,
			provider: 'local'
		});
		expect(JSON.parse(String(calls[0].init?.body))).toEqual({
			code: fields.code,
			email: fields.email,
			password: fields.password
		});
		expect(
			JSON.parse(String(calls.find((call) => call.url.endsWith('/audit-log/logins'))?.init?.body))
		).toEqual({ provider: 'local' });
	});

	// fach review 577 R-4: the sign-in after the setup is in the Protokoll des Servers like every other
	it('schreibt die Anmeldung nach der Einrichtung ins Protokoll des Servers', async () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		try {
			await setUp(fields, answering(201, account));
			const lines = info.mock.calls.map(([line]) => JSON.parse(String(line)));

			expect(lines).toContainEqual(
				expect.objectContaining({
					context: expect.objectContaining({
						event: 'login_complete',
						provider: 'local',
						userId: account.sub,
						email: account.email
					})
				})
			);
		} finally {
			info.mockRestore();
		}
	});

	it('legt kein Konto an, wenn die beiden Passwörter nicht übereinstimmen', async () => {
		const { result, calls } = await setUp(
			{ ...fields, repeat: 'ein-anderes-Passwort' },
			answering(201, account)
		);

		expect(result).toMatchObject({
			status: 400,
			data: { error: m.setup_error_repeat(), email: account.email }
		});
		expect(calls).toEqual([]);
	});

	it('sagt bei einem falschen Einrichtungscode, wo der richtige steht', async () => {
		const { result, jar } = await setUp(fields, answering(403, invalid));

		expect(result).toMatchObject({
			status: 403,
			data: { error: m.backend_setup_code_invalid(), email: account.email }
		});
		expect(jar.has('dwello_session')).toBe(false);
	});
});
