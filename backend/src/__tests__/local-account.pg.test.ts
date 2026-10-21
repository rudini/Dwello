/**
 * Local sign-in with e-mail and password (#576): the account, its Argon2id hash, the lock after 5 failed attempts
 * for 15 minutes, and the public check the BFF calls before it issues a session (real PostgreSQL database)
 */

import { afterAll, afterEach, describe, expect, it, setSystemTime } from 'bun:test';
import { eq } from 'drizzle-orm';
import { app } from '../app';
import { db } from '../db/connection';
import { localAccounts } from '../db/schema';
import * as jose from 'jose';
import { callApi, sendJson } from './helpers/auth';

const emails: string[] = [];
const newEmail = () => {
	const email = `konto-${crypto.randomUUID()}@dwello.test`;
	emails.push(email);
	return email;
};

// the public check: no session, as the sign-in page sends it
const signIn = (email: string, password: string) =>
	app.handle(
		new Request('http://localhost/api/v1/auth/password', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ email, password })
		})
	);

// a session as the BFF issues it after a sign-in with password, issued now (Bun's clock)
const sessionOf = async (sub: string, email: string) =>
	new jose.SignJWT({ email, name: email, provider: 'local' })
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject(sub)
		.setIssuer('dwello')
		.setAudience('dwello-app')
		.setIssuedAt(Math.floor(Date.now() / 1000))
		.setExpirationTime('1h')
		.sign(new TextEncoder().encode(process.env.JWT_SECRET || 'development-secret-key-change-in-production'));
const withSession = async (token: string) =>
	app.handle(new Request('http://localhost/api/v1/buildings', { headers: { authorization: `Bearer ${token}` } }));

const codeOf = async (response: Response) => ((await response.json()) as { code: string }).code;

const account = async (email: string, password = 'richtiges-Passwort') => {
	const response = await sendJson('PUT', '/api/v1/local-accounts', { email, password });
	expect(response.status).toBe(204);
};

afterEach(() => setSystemTime());
afterAll(async () => {
	for (const email of emails) await callApi(`/api/v1/local-accounts/${encodeURIComponent(email)}`, { method: 'DELETE' });
});

describe('lokales Konto', () => {
	it('meldet mit dem richtigen Passwort an und nennt das Konto', async () => {
		const email = newEmail();
		await account(email);

		const response = await signIn(email, 'richtiges-Passwort');

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ sub: expect.stringMatching(/^local:/), email, name: email });
	});

	it('findet das Konto unabhängig von Gross- und Kleinschreibung und Leerzeichen der E-Mail-Adresse', async () => {
		const email = newEmail();
		await account(email);

		expect((await signIn(`  ${email.toUpperCase()} `, 'richtiges-Passwort')).status).toBe(200);
	});

	it('lehnt ein falsches Passwort und eine unbekannte Adresse gleich ab', async () => {
		const email = newEmail();
		await account(email);

		const wrong = await signIn(email, 'falsch');
		const unknown = await signIn(`unbekannt-${crypto.randomUUID()}@dwello.test`, 'falsch');

		expect(wrong.status).toBe(401);
		expect(unknown.status).toBe(401);
		expect(await codeOf(wrong)).toBe('INVALID_CREDENTIALS');
		expect(await codeOf(unknown)).toBe('INVALID_CREDENTIALS');
	});

	it('sperrt eine unbekannte Adresse nie, auch nach vielen Fehlversuchen', async () => {
		const email = `unbekannt-${crypto.randomUUID()}@dwello.test`;
		for (let attempt = 0; attempt < 6; attempt++) await signIn(email, 'falsch');

		const response = await signIn(email, 'falsch');

		expect(response.status).toBe(401);
		expect(await codeOf(response)).toBe('INVALID_CREDENTIALS');
	});

	it('nimmt eine Anmeldung mit Passwort ins Protokoll unter «Einstellungen» auf', async () => {
		const response = await sendJson('POST', '/api/v1/audit-log/logins', { provider: 'local' });

		expect(response.status).toBe(201);
	});

	it('speichert das Passwort nur als Argon2id-Hash', async () => {
		const email = newEmail();
		await account(email);

		const [row] = await db.select().from(localAccounts).where(eq(localAccounts.email, email));

		expect(row.passwordHash).not.toContain('richtiges-Passwort');
		expect(row.passwordHash).toStartWith('$argon2id$');
		expect(await Bun.password.verify('richtiges-Passwort', row.passwordHash)).toBe(true);
	});

	it('sperrt nach 5 Fehlversuchen für 15 Minuten, auch das richtige Passwort', async () => {
		const email = newEmail();
		await account(email);
		const now = new Date();
		setSystemTime(now);
		for (let attempt = 0; attempt < 5; attempt++) await signIn(email, 'falsch');

		const locked = await signIn(email, 'richtiges-Passwort');

		expect(locked.status).toBe(423);
		const body = (await locked.json()) as { code: string; params: { until: string } };
		expect(body.code).toBe('ACCOUNT_LOCKED');
		expect(new Date(body.params.until).getTime()).toBe(now.getTime() + 15 * 60_000);
	});

	it('gibt die Anmeldung nach 15 Minuten wieder frei', async () => {
		const email = newEmail();
		await account(email);
		const now = new Date();
		setSystemTime(now);
		for (let attempt = 0; attempt < 5; attempt++) await signIn(email, 'falsch');

		setSystemTime(new Date(now.getTime() + 15 * 60_000 + 1000));

		expect((await signIn(email, 'richtiges-Passwort')).status).toBe(200);
	});

	it('zählt die Fehlversuche nach einer gelungenen Anmeldung neu', async () => {
		const email = newEmail();
		await account(email);
		for (let attempt = 0; attempt < 4; attempt++) await signIn(email, 'falsch');
		expect((await signIn(email, 'richtiges-Passwort')).status).toBe(200);

		for (let attempt = 0; attempt < 4; attempt++) await signIn(email, 'falsch');

		expect((await signIn(email, 'richtiges-Passwort')).status).toBe(200);
	});

	it('setzt mit einem neuen Passwort auch die Sperre zurück', async () => {
		const email = newEmail();
		await account(email);
		for (let attempt = 0; attempt < 5; attempt++) await signIn(email, 'falsch');

		await account(email, 'neues-Passwort-2026');

		expect((await signIn(email, 'richtiges-Passwort')).status).toBe(401);
		expect((await signIn(email, 'neues-Passwort-2026')).status).toBe(200);
	});

	it('verlangt ein Passwort mit mindestens 8 Zeichen', async () => {
		const response = await sendJson('PUT', '/api/v1/local-accounts', { email: newEmail(), password: 'kurz' });

		expect(response.status).toBe(400);
		expect(await codeOf(response)).toBe('PASSWORD_TOO_SHORT');
	});

	it('lässt Konten nur mit einer Sitzung anlegen und löschen', async () => {
		const email = newEmail();
		const put = await app.handle(
			new Request('http://localhost/api/v1/local-accounts', {
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email, password: 'richtiges-Passwort' })
			})
		);

		expect(put.status).toBe(401);
		expect((await signIn(email, 'richtiges-Passwort')).status).toBe(401);
	});

	it('sagt der Anmeldeseite, ob es ein lokales Konto gibt', async () => {
		const email = newEmail();
		await account(email);

		const response = await app.handle(new Request('http://localhost/api/v1/auth/password'));

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ available: true });
	});

	it('beendet die Sitzungen eines Kontos, dessen Passwort neu gesetzt wurde', async () => {
		const email = newEmail();
		const start = Date.now();
		setSystemTime(new Date(start - 60_000));
		await account(email);
		const { sub } = (await (await signIn(email, 'richtiges-Passwort')).json()) as { sub: string };
		setSystemTime(new Date(start - 30_000));
		const token = await sessionOf(sub, email);
		setSystemTime();
		expect((await withSession(token)).status).toBe(200);

		await account(email, 'neues-Passwort-2026');

		expect((await withSession(token)).status).toBe(401);
	});

	it('beendet die Sitzungen eines gelöschten Kontos', async () => {
		const email = newEmail();
		await account(email);
		const { sub } = (await (await signIn(email, 'richtiges-Passwort')).json()) as { sub: string };
		const token = await sessionOf(sub, email);

		await callApi(`/api/v1/local-accounts/${encodeURIComponent(email)}`, { method: 'DELETE' });

		expect((await withSession(token)).status).toBe(401);
	});

	it('meldet ein gelöschtes Konto nicht mehr an', async () => {
		const email = newEmail();
		await account(email);

		await callApi(`/api/v1/local-accounts/${encodeURIComponent(email)}`, { method: 'DELETE' });

		expect((await signIn(email, 'richtiges-Passwort')).status).toBe(401);
	});
});
