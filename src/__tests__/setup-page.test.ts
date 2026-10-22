import { describe, it, expect, vi } from 'vitest';
import { env } from '../../tests/mocks/env'; // what vitest provides as $env/dynamic/private
import { m } from '$lib/paraglide/messages';
import { verifyJwt } from '$lib/server/auth';
import { actions, load } from '../routes/setup/+page.server';
import { load as loadLogin } from '../routes/login/+page.server';
import needed from '../../tests/contracts/setup-needed.json';
import account from '../../tests/contracts/setup.json';
import invalid from '../../tests/contracts/setup-code-invalid.json';
import locked from '../../tests/contracts/setup-locked.json';
import done from '../../tests/contracts/setup-done.json';
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

async function send(fields: Record<string, string>, backend: Backend) {
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

/** The setup form of a fresh installation, which has no provider */
const setUp = (fields: Record<string, string>, backend: Backend) =>
	withoutProviders(() => send(fields, backend));

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
		expect(await withoutProviders(() => open(fresh))).toEqual({ kiChoice: true });
	});

	// #620: hat der Betreiber die KI festgelegt, gibt es bei der Einrichtung nichts zu wählen
	it('bietet keine Wahl der KI, wenn der Betreiber sie festgelegt hat', async () => {
		const operator: Backend = (url) => (url.endsWith('/setup') ? Response.json({ ...needed, kiChoice: false }) : fresh(url));

		expect(await withoutProviders(() => open(operator))).toEqual({ kiChoice: false });
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

	// code review 577 C-8: the setup exists only without a provider, also for a form sent to it directly
	it('legt mit einem eingerichteten Anbieter kein Konto an, sondern führt zur Anmeldung', async () => {
		const { result, calls } = await send(fields, answering(201, account));

		expect(result).toMatchObject({ status: 303, location: '/login' });
		expect(calls.filter((call) => call.init?.method === 'POST')).toEqual([]);
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

	// #620: «Später entscheiden» geht mit dem Konto an das Backend, das «Keine KI» speichert
	it('schickt die gewählte KI mit', async () => {
		const { calls } = await setUp({ ...fields, ki: 'none' }, answering(201, account));

		expect(JSON.parse(String(calls[0].init?.body))).toMatchObject({ ki: 'none' });
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

	// persona Anna 577 P-1: an empty form is a missing input, not an invalid request to reload
	it.each(['code', 'email', 'password'])(
		'sagt bei leerem Feld %s, was fehlt, ohne das Backend zu fragen',
		async (field) => {
			const { result, calls } = await setUp(
				{ ...fields, [field]: ' ', ...(field === 'password' && { repeat: ' ' }) },
				answering(201, account)
			);

			expect(result).toMatchObject({ status: 400, data: { error: m.setup_error_empty() } });
			expect(calls).toEqual([]);
		}
	);

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

	// code review 577 C-4: the refusals no scenario reaches (the lock would hold the fresh installation for 15 minutes)
	it('nennt bei einer Sperre der Einrichtung die Uhrzeit in der Schweiz', async () => {
		const { result } = await setUp(fields, answering(423, locked));

		expect(result).toMatchObject({
			status: 423,
			data: { error: m.setup_error_locked({ time: '14:45' }) }
		});
	});

	it('führt zur Anmeldung, wenn Dwello inzwischen eingerichtet ist', async () => {
		expect((await setUp(fields, answering(409, done))).result).toMatchObject({
			status: 303,
			location: '/login'
		});
	});

	it('meldet ein Backend, das nicht antwortet, nicht als falschen Code', async () => {
		const { result } = await setUp(fields, () => {
			throw new TypeError('fetch failed');
		});

		expect(result).toMatchObject({ status: 502, data: { error: m.login_error_failed() } });
	});
});
