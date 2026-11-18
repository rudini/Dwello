/**
 * The search for new versions and the start of an update (#1453): once a day the backend asks GitHub for the newest
 * published version, only on an installation from the published images without a fixed version and while the
 * setting is on; an update starts only with a set-up Sicherung, through the update service
 */

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'bun:test';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { backupCodes } from '../db/schema';
import { setConfig } from '../services/config.service';
import { checkForUpdate } from '../services/update.service';
import { callApi, sendJson, signToken } from './helpers/auth';

// GitHub and the update service, at the boundary
const asked: { path: string; agent: string | null }[] = [];
let updaterAnswer = 202;
let whenAsked = async () => {};
const outside = Bun.serve({
	port: 0,
	async fetch(request) {
		const path = new URL(request.url).pathname;
		asked.push({ path, agent: request.headers.get('user-agent') });
		await whenAsked();
		if (path === '/releases/latest') return Response.json({ tag_name: 'v1.5.0', html_url: 'https://github.com/rudini/Dwello/releases/tag/v1.5.0' });
		return new Response(null, { status: updaterAnswer });
	}
});
const RELEASES = `http://localhost:${outside.port}/releases/latest`;

let dir = '';
beforeAll(async () => {
	dir = await mkdtemp(join(tmpdir(), 'dwello-update-'));
});
afterEach(async () => {
	asked.length = 0;
	updaterAnswer = 202;
	whenAsked = async () => {};
	for (const name of ['DWELLO_RELEASES', 'DWELLO_VERSION', 'UPDATER_URL', 'BACKUP_DIR']) delete process.env[name];
	await setConfig('update_check', 'on');
	await db.delete(backupCodes);
	await db.execute(sql`DELETE FROM backup_runs`);
	await checkForUpdate();
});
afterAll(async () => {
	outside.stop(true);
	await rm(dir, { recursive: true, force: true });
});

const update = async () => (await (await callApi('/api/v1/update')).json()) as { checks: boolean; latest: string | null };

describe('Suche nach neuen Versionen', () => {
	it('fragt GitHub nach der neuesten Version, nur mit «Dwello» als Absender', async () => {
		process.env.DWELLO_RELEASES = RELEASES;
		await checkForUpdate();

		expect(await update()).toMatchObject({
			checks: true,
			latest: '1.5.0',
			releaseUrl: 'https://github.com/rudini/Dwello/releases/tag/v1.5.0'
		});
		expect(asked).toEqual([{ path: '/releases/latest', agent: 'Dwello' }]);
	});

	it('fragt nicht und vergisst die bekannte Version, wenn die Suche ausgeschaltet ist', async () => {
		process.env.DWELLO_RELEASES = RELEASES;
		await checkForUpdate();
		asked.length = 0;

		await sendJson('PUT', '/api/v1/config', { update_check: 'off' });

		expect(await update()).toMatchObject({ checks: true, latest: null });
		expect(asked).toEqual([]);
	});

	// fallback review of #1455: saving other settings asks GitHub no more often than once a day
	it('fragt nicht, wenn die gespeicherten Einstellungen die Suche nicht ändern', async () => {
		process.env.DWELLO_RELEASES = RELEASES;
		await checkForUpdate();
		asked.length = 0;

		// the settings form sends the search with every save; other settings are global records of parallel tests
		expect((await sendJson('PUT', '/api/v1/config', { update_check: 'on' })).status).toBe(200);

		expect(asked).toEqual([]);
	});

	it('fragt nicht mit einer festen Version und nicht in einer Installation aus einem Klon', async () => {
		process.env.DWELLO_RELEASES = RELEASES;
		process.env.DWELLO_VERSION = '1.4.0';
		await checkForUpdate();
		expect(await update()).toMatchObject({ checks: false, latest: null });

		delete process.env.DWELLO_VERSION;
		delete process.env.DWELLO_RELEASES;
		await checkForUpdate();
		expect(await update()).toMatchObject({ checks: false, latest: null });
		expect(asked).toEqual([]);
	});

	it('sagt auch ohne Anmeldung, ob die Installation GitHub fragt, für die Datenschutzerklärung', async () => {
		const { app } = await import('../app');
		const ask = async () => (await app.handle(new Request('http://localhost/api/v1/update/checks'))).json();
		expect(await ask()).toEqual({ checks: false });
		process.env.DWELLO_RELEASES = RELEASES;
		expect(await ask()).toEqual({ checks: true });
	});
});

describe('Update starten', () => {
	const UPDATER = () => `http://localhost:${outside.port}`;
	const confirmBackup = async () => {
		process.env.BACKUP_DIR = dir;
		const { code } = (await (await callApi('/api/v1/backup')).json()) as { code: string };
		await sendJson('POST', '/api/v1/backup/confirm', { code });
	};

	it('nennt den Update-Dienst, wenn es einen gibt', async () => {
		expect(await update()).toMatchObject({ updater: false });
		process.env.UPDATER_URL = UPDATER();
		expect(await update()).toMatchObject({ updater: true });
	});

	it('beauftragt den Update-Dienst, wenn die Sicherung eingerichtet ist', async () => {
		process.env.UPDATER_URL = UPDATER();
		await confirmBackup();
		asked.length = 0;

		const response = await sendJson('POST', '/api/v1/update');
		expect(response.status).toBe(202);
		expect(asked).toEqual([{ path: '/update', agent: expect.anything() }]);
	});

	// #1457: also a version that does not change the database
	it('erstellt eine Sicherung, bevor es den Update-Dienst beauftragt', async () => {
		process.env.UPDATER_URL = UPDATER();
		await confirmBackup();
		// the first Sicherung, made when the code is confirmed, and the one before this update: one at a time, in order
		const succeeded = async () =>
			(await db.execute(sql`SELECT 1 FROM backup_runs WHERE finished_at IS NOT NULL AND error IS NULL`)).rows.length;
		let whenUpdaterAsked = -1;
		whenAsked = async () => void (whenUpdaterAsked = await succeeded());

		expect((await sendJson('POST', '/api/v1/update')).status).toBe(202);
		expect(whenUpdaterAsked).toBe(2);
	});

	it('lehnt ab und beauftragt den Update-Dienst nicht, wenn die Sicherung fehlschlägt', async () => {
		process.env.UPDATER_URL = UPDATER();
		await confirmBackup();
		// a key that cannot encrypt, as backend/scripts/e2e-backup-reset.ts sets it
		await db.execute(sql`UPDATE backup_codes SET public_key = ''`);
		asked.length = 0;

		const response = await sendJson('POST', '/api/v1/update');
		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'UPDATE_BACKUP_FAILED' });
		expect(asked).toEqual([]);
	});

	// code review backup-first-1 C-1: the server ends a connection on which nothing was sent for a while (here 1 s),
	// and the Sicherung of a large database takes longer; cut off, the landlord would read an error while the update starts
	it('hält die Anfrage offen, solange die Sicherung dauert', async () => {
		const { app } = await import('../app');
		const listening = app.listen({ port: 0, idleTimeout: 1 });
		process.env.UPDATER_URL = UPDATER();
		await confirmBackup();
		whenAsked = () => Bun.sleep(2500);
		try {
			const response = await fetch(`http://localhost:${listening.server!.port}/api/v1/update`, {
				method: 'POST',
				headers: { authorization: `Bearer ${await signToken()}` }
			});
			expect(response.status).toBe(202);
		} finally {
			await listening.stop();
		}
	});

	// code review backup-first-1 C-2: a click in a second tab while the first still backs up
	it('sichert und beauftragt nur einmal, wenn zwei Anfragen zugleich kommen', async () => {
		process.env.UPDATER_URL = UPDATER();
		await confirmBackup();
		asked.length = 0;

		const answers = await Promise.all([sendJson('POST', '/api/v1/update'), sendJson('POST', '/api/v1/update')]);
		const bodies = await Promise.all(answers.map((answer) => answer.json()));

		// whichever arrives first starts it
		expect(bodies).toEqual(expect.arrayContaining([{ started: true }, expect.objectContaining({ code: 'UPDATE_RUNNING' })]));
		expect(asked.map(({ path }) => path)).toEqual(['/update']);
	});

	it('lehnt ab ohne eingerichtete Sicherung, ohne Update-Dienst und während ein Update läuft', async () => {
		process.env.UPDATER_URL = UPDATER();
		process.env.BACKUP_DIR = dir;
		expect(await (await sendJson('POST', '/api/v1/update')).json()).toMatchObject({ code: 'UPDATE_BACKUP_MISSING' });
		delete process.env.BACKUP_DIR;
		expect(await (await sendJson('POST', '/api/v1/update')).json()).toMatchObject({ code: 'UPDATE_BACKUP_MISSING' });

		await confirmBackup();
		updaterAnswer = 409;
		const running = await sendJson('POST', '/api/v1/update');
		expect(running.status).toBe(409);
		expect(await running.json()).toMatchObject({ code: 'UPDATE_RUNNING' });

		delete process.env.UPDATER_URL;
		expect(await (await sendJson('POST', '/api/v1/update')).json()).toMatchObject({ code: 'UPDATE_UNAVAILABLE' });
		expect(asked.filter(({ path }) => path === '/update')).toHaveLength(1);
	});
});

