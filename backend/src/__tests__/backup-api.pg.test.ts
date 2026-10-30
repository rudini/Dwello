/**
 * «Sicherung einrichten» through the API (#718, A8): the Wiederherstellungscode is shown until the landlord types it
 * again; then Dwello keeps only its public key, never the code (Fachreview 718b R-3)
 */

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'bun:test';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { db } from '../db/connection';
import { backupCodes, backupRuns } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { readPdf } from './helpers/pdf-text';

let dir = '';
beforeAll(async () => {
	dir = await mkdtemp(join(tmpdir(), 'dwello-backup-api-'));
	process.env.BACKUP_DIR = dir;
});
afterEach(async () => {
	await db.delete(backupRuns);
	await db.delete(backupCodes);
});
afterAll(async () => {
	delete process.env.BACKUP_DIR;
	await rm(dir, { recursive: true, force: true });
});

const state = async () =>
	(await (await callApi('/api/v1/backup')).json()) as {
		backup: string;
		code?: string;
		createdAt?: string;
	};

describe('Sicherung einrichten', () => {
	it('zeigt einen Wiederherstellungscode, solange keiner bestätigt ist, und beim nächsten Aufruf denselben', async () => {
		const first = await state();
		expect(first.backup).toBe('setup');
		expect(first.code).toMatch(/^([2-9A-HJ-NP-Z]{4}-){5}[2-9A-HJ-NP-Z]{4}$/);
		expect((await state()).code).toBe(first.code);
	});

	it('bestätigt den Code, auch klein und ohne Bindestriche getippt, und behält danach keinen Klartext', async () => {
		const { code } = await state();
		const response = await sendJson('POST', '/api/v1/backup/confirm', {
			code: code!.toLowerCase().replaceAll('-', ' ')
		});
		expect(response.status).toBe(200);

		const after = await state();
		expect(after.backup).not.toBe('setup');
		expect(after.code).toBeUndefined();
		const rows = await db.select().from(backupCodes);
		expect(rows).toHaveLength(1);
		expect(JSON.stringify(rows)).not.toContain(code!.replaceAll('-', ''));
		expect(JSON.stringify(rows)).not.toContain(code!);
	});

	it('lehnt einen anderen Code ab und zeigt weiter den ersten', async () => {
		const { code } = await state();
		const response = await sendJson('POST', '/api/v1/backup/confirm', {
			code: 'AAAA-BBBB-CCCC-DDDD-EEEE-FFFF'
		});
		expect(response.status).toBe(422);
		expect(await response.json()).toMatchObject({ code: 'BACKUP_CODE_MISMATCH' });
		expect(await state()).toMatchObject({ backup: 'setup', code });
	});

	it('ist ohne Ordner für die Sicherung aus und zeigt keinen Code', async () => {
		delete process.env.BACKUP_DIR;
		try {
			expect(await state()).toEqual({ backup: 'off' });
		} finally {
			process.env.BACKUP_DIR = dir;
		}
	});
});

describe('Notfallblatt', () => {
	it('nennt Code, Datum, Webadresse, Ort der Sicherungen und das Vorgehen im Notfall', async () => {
		const { code, createdAt } = await state();
		const response = await callApi(
			'/api/v1/backup/emergency-sheet?language=de&address=https%3A%2F%2Fdwello.example.ch'
		);
		expect(response.headers.get('content-type')).toBe('application/pdf');
		const text = readPdf(Buffer.from(await response.arrayBuffer())).flowing;
		expect(text).toContain(code!);
		// the Swiss day of the code, not its UTC day: after midnight in Zurich they differ
		expect(text).toContain(
			new Date(createdAt!).toLocaleDateString('de-CH', {
				timeZone: 'Europe/Zurich',
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})
		);
		expect(text).toContain('https://dwello.example.ch');
		expect(text).toContain('im Ordner «backups»');
		expect(text).toContain('Im Notfall: Geben Sie dieses Blatt der Person, die Dwello betreut.');
		expect(text).toContain('https://github.com/rudini/Dwello/blob/main/docs/installation.md');
	});

	it('steht in der Sprache des Liegenschaftsverwalters', async () => {
		await state();
		const french = readPdf(
			Buffer.from(
				await (
					await callApi(
						'/api/v1/backup/emergency-sheet?language=fr&address=https%3A%2F%2Fdwello.example.ch'
					)
				).arrayBuffer()
			)
		).flowing;
		expect(french).toContain(
			'En cas d’urgence : remettez cette fiche à la personne qui s’occupe de Dwello.'
		);
	});

	it('gibt es nach der Bestätigung nicht mehr, weil Dwello den Code dann nicht mehr kennt', async () => {
		const { code } = await state();
		await sendJson('POST', '/api/v1/backup/confirm', { code });
		expect((await callApi('/api/v1/backup/emergency-sheet?language=de&address=x')).status).toBe(
			409
		);
	});
});
