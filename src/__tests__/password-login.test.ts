import { describe, it, expect, vi } from 'vitest';
import { actions, load } from '../routes/login/+page.server';
import { POST as refresh } from '../routes/auth/refresh/+server';
import { verifyJwt } from '$lib/server/auth';
import { isAllowed } from '$lib/server/allowed-emails';
import available from '../../tests/contracts/auth-password-available.json';
import account from '../../tests/contracts/auth-password.json';
import invalid from '../../tests/contracts/auth-password-invalid.json';
import locked from '../../tests/contracts/auth-password-locked.json';

// Konto mit Passwort (#576): the sign-in page asks the backend, issues the session itself, and names a Sperre's end
type Backend = (url: string, init?: RequestInit) => Response;

const cookieJar = () => {
	const jar = new Map<string, string>();
	return { jar, cookies: { set: (name: string, value: string) => jar.set(name, value), get: (name: string) => jar.get(name), delete: (name: string) => jar.delete(name) } };
};

const open = (page: string, backend: Backend = () => Response.json(available)) =>
	load({ url: new URL(page), fetch: async (url: string, init?: RequestInit) => backend(url, init) } as never) as Promise<
		Record<string, unknown>
	>;

async function signIn(backend: Backend, redirectTo = '') {
	const { jar, cookies } = cookieJar();
	const body = new FormData();
	body.set('email', 'helga@example.ch');
	body.set('password', 'ein-Passwort');
	if (redirectTo) body.set('redirectTo', redirectTo);
	const calls: { url: string; init?: RequestInit }[] = [];
	const fetch = async (url: string, init?: RequestInit) => {
		calls.push({ url, init });
		return backend(url, init);
	};
	let result: unknown;
	try {
		result = await actions.password({ request: new Request('http://localhost/login', { method: 'POST', body }), cookies, fetch } as never);
	} catch (thrown) {
		result = thrown;
	}
	return { result, jar, calls };
}

const answering = (status: number, json: object): Backend => (url) =>
	url.endsWith('/audit-log/logins') ? new Response(null, { status: 201 }) : Response.json(json, { status });

describe('Anmeldeseite mit Konto mit Passwort', () => {
	it('bietet das Passwort an, wenn es ein Konto mit Passwort gibt', async () => {
		expect((await open('http://localhost:3000/login')).password).toBe(true);
	});

	it('bietet kein Passwort an, wenn das Backend nicht antwortet', async () => {
		expect((await open('http://localhost:3000/login', () => new Response(null, { status: 500 }))).password).toBe(false);
	});

	it.each([
		['http://homeserver.local:3000/login', true],
		['http://192.168.1.20:3000/login', true],
		['http://localhost:3000/login', false],
		['http://127.0.0.1:3000/login', false],
		['https://dwello.example.ch/login', false]
	])('warnt bei %s vor einer unverschlüsselten Verbindung: %s', async (page, insecure) => {
		expect((await open(page)).insecure).toBe(insecure);
	});
});

describe('Anmeldung mit Passwort', () => {
	it('stellt die Sitzung mit dem Konto aus, protokolliert sie und führt zur verlangten Seite', async () => {
		const { result, jar, calls } = await signIn(answering(200, account), '/buildings');

		expect(result).toMatchObject({ status: 303, location: '/buildings' });
		const session = await verifyJwt(jar.get('dwello_session')!);
		expect(session).toMatchObject({ sub: account.sub, email: account.email, name: account.email, provider: 'local' });
		expect(jar.get('dwello_xsrf')).toBeTruthy();
		const audit = calls.find((call) => call.url.endsWith('/api/v1/audit-log/logins'));
		expect(JSON.parse(String(audit?.init?.body))).toEqual({ provider: 'local' });
		expect(JSON.parse(String(calls[0].init?.body))).toEqual({ email: 'helga@example.ch', password: 'ein-Passwort' });
	});

	it('schreibt die Anmeldung mit Kennung und E-Mail-Adresse ins Protokoll des Servers', async () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		try {
			await signIn(answering(200, account));

			const lines = info.mock.calls.map(([line]) => JSON.parse(String(line)));
			expect(lines).toContainEqual(
				expect.objectContaining({ context: expect.objectContaining({ event: 'login_complete', provider: 'local', userId: account.sub, email: account.email }) })
			);
		} finally {
			info.mockRestore();
		}
	});

	// code review 576 C-2: the backend ends the sessions from before a new password by the time of the sign-in
	it('behält beim Verlängern der Sitzung die Zeit der Anmeldung', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-21T10:00:00Z'), toFake: ['Date'] });
		try {
			const { jar } = await signIn(answering(200, account));
			const signedInAt = (await verifyJwt(jar.get('dwello_session')!)).auth_time;
			vi.setSystemTime(new Date('2026-10-21T10:50:00Z'));
			const cookies = { set: (name: string, value: string) => jar.set(name, value), get: (name: string) => jar.get(name), delete: () => {} };
			const request = new Request('http://localhost/auth/refresh', { method: 'POST', headers: { 'X-XSRF-TOKEN': jar.get('dwello_xsrf')! } });

			expect((await refresh({ request, cookies } as never)).status).toBe(200);

			const renewed = await verifyJwt(jar.get('dwello_session')!);
			expect(signedInAt).toBe(Date.parse('2026-10-21T10:00:00Z') / 1000);
			expect(renewed.iat).toBe(Date.parse('2026-10-21T10:50:00Z') / 1000);
			expect(renewed.auth_time).toBe(signedInAt);
		} finally {
			vi.useRealTimers();
		}
	});

	it('führt nur zu Seiten von Dwello', async () => {
		expect((await signIn(answering(200, account), '//boese.example')).result).toMatchObject({ location: '/dashboard' });
	});

	it('sagt bei falschem Passwort, was geschah und was zu tun ist', async () => {
		const { result, jar } = await signIn(answering(401, invalid));

		expect(result).toMatchObject({
			status: 400,
			data: { error: 'E-Mail-Adresse oder Passwort stimmen nicht. Prüfen Sie Ihre Eingabe und versuchen Sie es erneut.', email: 'helga@example.ch' }
		});
		expect(jar.has('dwello_session')).toBe(false);
	});

	it('nennt bei einer Sperre die Uhrzeit in der Schweiz', async () => {
		const { result } = await signIn(answering(423, locked));

		expect(result).toMatchObject({
			status: 423,
			data: {
				error:
					'Nach mehreren Fehlversuchen ist die Anmeldung gesperrt bis 14:45 Uhr. Versuchen Sie es danach erneut, oder lassen Sie die Sperre vom Betreiber Ihrer Dwello-Installation aufheben.'
			}
		});
	});

	it('meldet einen Fehler des Backends weder als falsches Passwort noch als Sperre', async () => {
		const { result } = await signIn(() => new Response(null, { status: 500 }));

		expect(result).toMatchObject({ status: 502, data: { error: 'Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.' } });
	});
});

describe('Zugang', () => {
	it('lässt ein Konto mit Passwort auch mit ALLOWED_EMAILS zu: das Backend hat es geprüft', () => {
		const list = process.env.ALLOWED_EMAILS;
		process.env.ALLOWED_EMAILS = 'verwalter@example.com';
		try {
			expect(isAllowed({ email: 'helga@example.ch', provider: 'local' })).toBe(true);
			expect(isAllowed({ email: 'helga@example.ch', provider: 'google' })).toBe(false);
		} finally {
			process.env.ALLOWED_EMAILS = list;
		}
	});
});
