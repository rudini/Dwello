/**
 * The search for new versions and the start of an update (#1453): once a day the backend asks GitHub for the newest
 * published version, only on an installation from the published images without a fixed version and while the
 * setting is on; an update starts only with a set-up Sicherung, through the update service
 */

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'bun:test';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { db } from '../db/connection';
import { backupCodes } from '../db/schema';
import { setConfig } from '../services/config.service';
import { checkForUpdate } from '../services/update.service';
import { callApi, sendJson } from './helpers/auth';

// GitHub and the update service, at the boundary
const asked: { path: string; agent: string | null }[] = [];
let updaterAnswer = 202;
const outside = Bun.serve({
	port: 0,
	fetch(request) {
		const path = new URL(request.url).pathname;
		asked.push({ path, agent: request.headers.get('user-agent') });
		if (path === '/releases/latest') return Response.json({ tag_name: 'v1.5.0', html_url: 'x' });
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
	for (const name of ['DWELLO_RELEASES', 'DWELLO_VERSION', 'UPDATER_URL', 'BACKUP_DIR']) delete process.env[name];
	await setConfig('update_check', 'on');
	await db.delete(backupCodes);
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

		expect(await update()).toMatchObject({ checks: true, latest: '1.5.0' });
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

