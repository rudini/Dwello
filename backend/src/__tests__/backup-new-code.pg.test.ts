/**
 * A new Wiederherstellungscode (#718, part 3): only after signing in again (the password typed again, or a Google
 * sign-in of the last minutes); from its confirmation on Dwello backs up with it, and the backups from before stay
 * readable with the old code (A8)
 */

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import * as jose from 'jose';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { app } from '../app';
import { DATABASE_URL, db } from '../db/connection';
import { backupCodes, backupRuns, localAccounts } from '../db/schema';
import { decryptFile } from '../services/backup-crypto';
import { createBackup } from '../services/backup.service';
import { deleteLocalAccount, setLocalAccount } from '../services/local-account.service';
import { sendJson } from './helpers/auth';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'development-secret-key-change-in-production');
const email = `neuer-code-${crypto.randomUUID().slice(0, 8)}@dwello.test`;
const password = 'Passwort-für-den-Code';
let dir = '';

/** A session as the BFF issues it, signed in `minutesAgo` before now */
const session = (sub: string, provider: string, minutesAgo = 0) =>
	new jose.SignJWT({ email, name: email, provider, auth_time: Math.floor(Date.now() / 1000) - minutesAgo * 60 })
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject(sub)
		.setIssuer('dwello')
		.setAudience('dwello-app')
		.setIssuedAt()
		.setExpirationTime('1h')
		.sign(secret);

const call = async (token: string, path: string, body?: object) =>
	app.handle(
		new Request(`http://localhost${path}`, {
			method: body ? 'POST' : 'GET',
			headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
			body: body && JSON.stringify(body)
		})
	);

const localSession = async () => {
	const [account] = await db.select({ id: localAccounts.id }).from(localAccounts).where(eq(localAccounts.email, email));
	return session(`local:${account.id}`, 'local');
};

/** The code shown by «Sicherung einrichten», confirmed: Dwello backs up with it */
async function confirmedFirstCode() {
	const { code } = (await (await sendJson('GET', '/api/v1/backup')).json()) as { code: string };
	await sendJson('POST', '/api/v1/backup/confirm', { code });
	return code;
}

beforeAll(async () => {
	dir = await mkdtemp(join(tmpdir(), 'dwello-new-code-'));
	process.env.BACKUP_DIR = dir;
	await setLocalAccount(email, password);
});
afterEach(async () => {
	await db.delete(backupRuns);
	await db.delete(backupCodes);
});
afterAll(async () => {
	delete process.env.BACKUP_DIR;
	await deleteLocalAccount(email);
	await rm(dir, { recursive: true, force: true });
});

describe('Neuer Wiederherstellungscode', () => {
	it('zeigt nach dem richtigen Passwort einen neuen Code, der sich vom bestätigten unterscheidet', async () => {
		const first = await confirmedFirstCode();
		const token = await localSession();
		const response = await call(token, '/api/v1/backup/new-code', { password });
		expect(response.status).toBe(200);
		const { code } = (await response.json()) as { code: string };
		expect(code).toMatch(/^([2-9A-HJ-NP-Z]{4}-){5}[2-9A-HJ-NP-Z]{4}$/);
		expect(code).not.toBe(first);
		expect(await (await call(token, '/api/v1/backup')).json()).toMatchObject({ code });
	});

	it('lehnt ein falsches Passwort ab, zählt den Fehlversuch und zeigt keinen neuen Code', async () => {
		await confirmedFirstCode();
		const token = await localSession();
		const response = await call(token, '/api/v1/backup/new-code', { password: 'falsch' });
		expect(response.status).toBe(422);
		expect(await response.json()).toMatchObject({ code: 'BACKUP_PASSWORD_WRONG' });
		expect((await (await call(token, '/api/v1/backup')).json()).code).toBeUndefined();
		const [account] = await db.select().from(localAccounts).where(eq(localAccounts.email, email));
		expect(account.failedAttempts).toBe(1);
		await db.update(localAccounts).set({ failedAttempts: 0 }).where(eq(localAccounts.email, email));
	});

	it('verlangt mit Google eine Anmeldung der letzten 10 Minuten', async () => {
		await confirmedFirstCode();
		const old = await call(await session('google-verwalter', 'google', 60), '/api/v1/backup/new-code', {});
		expect(old.status).toBe(403);
		expect(await old.json()).toMatchObject({ code: 'BACKUP_SIGN_IN_AGAIN' });
		const fresh = await call(await session('google-verwalter', 'google', 2), '/api/v1/backup/new-code', {});
		expect(fresh.status).toBe(200);
	});

	it('sichert nach der Bestätigung mit dem neuen Code; die Sicherung von vorher bleibt mit dem alten lesbar', async () => {
		const first = await confirmedFirstCode();
		const before = await createBackup(DATABASE_URL, dir, {});
		const token = await localSession();
		const { code } = (await (await call(token, '/api/v1/backup/new-code', { password })).json()) as { code: string };
		expect((await call(token, '/api/v1/backup/confirm', { code })).status).toBe(200);
		const after = await createBackup(DATABASE_URL, dir, {}, new Date(Date.now() + 1000));

		await decryptFile(after, code, join(dir, 'after.plain'));
		await decryptFile(before, first, join(dir, 'before.plain'));
		await expect(decryptFile(after, first, join(dir, 'wrong.plain'))).rejects.toThrow();
		expect((await (await call(token, '/api/v1/backup')).json()).code).toBeUndefined();
	}, 60_000);

	it('vergisst einen neuen Code, der nach 30 Minuten noch nicht bestätigt ist', async () => {
		await confirmedFirstCode();
		const token = await localSession();
		const { code } = (await (await call(token, '/api/v1/backup/new-code', { password })).json()) as { code: string };
		await db.update(backupCodes).set({ createdAt: new Date(Date.now() - 31 * 60_000) }).where(eq(backupCodes.pendingCode, code));
		expect((await (await call(token, '/api/v1/backup')).json()).code).toBeUndefined();
		const confirm = await call(token, '/api/v1/backup/confirm', { code });
		expect(confirm.status).toBe(422);
	});
});
