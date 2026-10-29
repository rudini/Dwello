/**
 * Sicherung and Wiederherstellung (#718, R1) against real PostgreSQL databases: one per case, made from the migrations
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import pg from 'pg';
import { migrate } from '../db/migrate';
import { generateCode, recipientOf } from '../services/backup-crypto';
import {
	backupBeforeMigration,
	backupIfDue,
	backupState,
	createBackup,
	restoreBackup
} from '../services/backup.service';

const server = 'postgresql://dwello:dwello@localhost:5432';
const migrations = join(import.meta.dir, '..', '..', 'migrations');
const databases: string[] = [];
const dirs: string[] = [];

async function query(database: string, sql: string, values: unknown[] = []) {
	const client = new pg.Client({ connectionString: `${server}/${database}` });
	await client.connect();
	try {
		return (await client.query(sql, values)).rows;
	} finally {
		await client.end();
	}
}

async function database() {
	const name = `dwello_backup_${crypto.randomUUID().replace(/-/g, '')}`;
	await query('postgres', `CREATE DATABASE "${name}"`);
	databases.push(name);
	await migrate(`${server}/${name}`, migrations);
	return name;
}

async function folder() {
	const dir = await mkdtemp(join(tmpdir(), 'dwello-backups-'));
	dirs.push(dir);
	return dir;
}

/** A database whose Wiederherstellungscode the landlord confirmed */
async function secured() {
	const name = await database();
	const code = generateCode();
	const { publicKey, salt } = await recipientOf(code);
	await query(
		name,
		'INSERT INTO backup_codes (public_key, salt, confirmed_at) VALUES ($1, $2, now())',
		[publicKey.toString('base64'), salt.toString('base64')]
	);
	await query(
		name,
		`INSERT INTO buildings (name, address, postal_code, city, canton) VALUES ('Lindenhof', 'Lindenweg 3', '8400', 'Winterthur', 'ZH')`
	);
	return { name, code };
}

const secrets = {
	encryption_key: 'schluessel-der-installation',
	jwt_secret: 'jwt-der-installation'
};

afterAll(async () => {
	for (const name of databases)
		await query('postgres', `DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
	for (const dir of dirs) await rm(dir, { recursive: true, force: true });
}, 60_000);

describe('Sicherung', () => {
	it('legt eine verschlüsselte Sicherung an, die mit dem Code Daten und Schlüssel wiederherstellt', async () => {
		const { name, code } = await secured();
		const dir = await folder();
		const file = await createBackup(`${server}/${name}`, dir, secrets);
		expect(await readdir(dir)).toEqual([file.split('/').pop()!]);
		expect(await readFile(file, 'latin1')).not.toContain('Lindenhof');

		const empty = `dwello_backup_${crypto.randomUUID().replace(/-/g, '')}`;
		await query('postgres', `CREATE DATABASE "${empty}"`);
		databases.push(empty);
		const keys = await folder();
		await restoreBackup(file, code, `${server}/${empty}`, keys, migrations);

		expect(await query(empty, 'SELECT name FROM buildings')).toEqual([{ name: 'Lindenhof' }]);
		expect(await readFile(join(keys, 'encryption_key'), 'utf8')).toBe(secrets.encryption_key);
		expect(await readFile(join(keys, 'jwt_secret'), 'utf8')).toBe(secrets.jwt_secret);
	}, 60_000);

	it('ersetzt bei der Wiederherstellung den neueren Stand und zieht spätere Migrationen nach', async () => {
		// a Sicherung of the release before 0037, restored by this one
		const older = await mkdtemp(join(tmpdir(), 'dwello-migrations-'));
		dirs.push(older);
		await cp(migrations, older, {
			recursive: true,
			filter: (file) => !file.endsWith('0037_heating_profile_source.sql')
		});
		const name = `dwello_backup_${crypto.randomUUID().replace(/-/g, '')}`;
		await query('postgres', `CREATE DATABASE "${name}"`);
		databases.push(name);
		await migrate(`${server}/${name}`, older);
		const code = generateCode();
		const { publicKey, salt } = await recipientOf(code);
		await query(
			name,
			'INSERT INTO backup_codes (public_key, salt, confirmed_at) VALUES ($1, $2, now())',
			[publicKey.toString('base64'), salt.toString('base64')]
		);
		const file = await createBackup(`${server}/${name}`, await folder(), secrets);
		await query(
			name,
			`INSERT INTO buildings (name, address, postal_code, city, canton) VALUES ('Ahornhof', 'Testweg 1', '8400', 'Winterthur', 'ZH')`
		);

		await restoreBackup(file, code, `${server}/${name}`, await folder(), migrations);

		expect(await query(name, 'SELECT name FROM buildings')).toEqual([]);
		expect(
			await query(
				name,
				`SELECT name FROM schema_migrations WHERE name = '0037_heating_profile_source.sql'`
			)
		).toEqual([{ name: '0037_heating_profile_source.sql' }]);
	}, 60_000);

	it('schreibt die Schlüssel zurück, auch wenn danach eine Migration scheitert', async () => {
		const { name, code } = await secured();
		const file = await createBackup(`${server}/${name}`, await folder(), secrets);
		const broken = await mkdtemp(join(tmpdir(), 'dwello-migrations-'));
		dirs.push(broken);
		await cp(migrations, broken, { recursive: true });
		await writeFile(join(broken, '9999_broken.sql'), 'SELECT no_such_column FROM buildings;');
		const keys = await folder();

		await expect(restoreBackup(file, code, `${server}/${name}`, keys, broken)).rejects.toThrow(
			'9999_broken.sql'
		);
		expect(await readFile(join(keys, 'encryption_key'), 'utf8')).toBe(secrets.encryption_key);
		expect(await query(name, 'SELECT name FROM buildings')).toEqual([{ name: 'Lindenhof' }]);
	}, 60_000);

	it('lässt keine Datei liegen und vermerkt die Ursache, wenn pg_dump scheitert', async () => {
		const { name } = await secured();
		const dir = await folder();
		const bin = await folder();
		await writeFile(
			join(bin, 'pg_dump'),
			'#!/bin/sh\necho "pg_dump: error: connection refused" >&2\nexit 1\n',
			{ mode: 0o755 }
		);
		const path = process.env.PATH;
		process.env.PATH = `${bin}:${path}`;
		try {
			await expect(createBackup(`${server}/${name}`, dir, secrets)).rejects.toThrow(
				'pg_dump: error: connection refused'
			);
		} finally {
			process.env.PATH = path;
		}
		expect(await readdir(dir)).toEqual([]);
		expect(await query(name, 'SELECT error FROM backup_runs')).toEqual([
			{ error: 'pg_dump: pg_dump: error: connection refused' }
		]);
	}, 60_000);

	// PR #940, Copilot: a half file blocks the disk also when the next run fails
	it('löscht eine halbe Datei schon vor dem nächsten Lauf, auch wenn dieser scheitert', async () => {
		const { name } = await secured();
		const dir = await folder();
		await writeFile(join(dir, 'dwello-2026-10-27T02-00-00Z.backup.part'), 'halb');
		const bin = await folder();
		await writeFile(join(bin, 'pg_dump'), '#!/bin/sh\nexit 1\n', { mode: 0o755 });
		const path = process.env.PATH;
		process.env.PATH = `${bin}:${path}`;
		try {
			await expect(createBackup(`${server}/${name}`, dir, secrets)).rejects.toThrow('pg_dump');
		} finally {
			process.env.PATH = path;
		}
		expect(await readdir(dir)).toEqual([]);
	}, 60_000);

	// 718b review C-2: a run that fails while encrypting (a broken key, a full disk) must not leave pg_dump waiting
	it('beendet pg_dump, wenn das Verschlüsseln scheitert', async () => {
		const name = await database();
		await query(name, `INSERT INTO backup_codes (public_key, salt, confirmed_at) VALUES ('', '', now())`);
		const bin = await folder();
		await writeFile(join(bin, 'pg_dump'), `#!/bin/sh\necho $$ > ${bin}/pid\nexec yes\n`, { mode: 0o755 });
		const path = process.env.PATH;
		process.env.PATH = `${bin}:${path}`;
		try {
			await expect(createBackup(`${server}/${name}`, await folder(), secrets)).rejects.toThrow();
		} finally {
			process.env.PATH = path;
		}
		// the shell writes its pid as it starts, which can be after the refusal: wait for it (718b review 2, C-13); none
		// after 2 s means it was stopped before it got there
		let pid = 0;
		for (let i = 0; i < 20 && !pid; i++)
			pid = Number(await readFile(join(bin, 'pid'), 'utf8').catch(() => '0')) || (await Bun.sleep(100), 0);
		const alive = () => {
			if (!pid) return false;
			try {
				return process.kill(pid, 0);
			} catch {
				return false;
			}
		};
		for (let i = 0; i < 20 && alive(); i++) await Bun.sleep(100);
		const running = alive();
		if (running) process.kill(pid);
		expect(running).toBe(false);
	}, 60_000);

	// 718b review 2, C-14: without pg_dump its exit fails after the encryption did; nothing may stay unhandled
	it('lässt ohne pg_dump keine unbehandelte Ablehnung zurück, wenn das Verschlüsseln scheitert', async () => {
		const name = await database();
		await query(name, `INSERT INTO backup_codes (public_key, salt, confirmed_at) VALUES ('', '', now())`);
		const unhandled: unknown[] = [];
		const note = (reason: unknown) => unhandled.push(reason);
		process.on('unhandledRejection', note);
		const path = process.env.PATH;
		process.env.PATH = await folder();
		try {
			await expect(createBackup(`${server}/${name}`, await folder(), secrets)).rejects.toThrow();
			await Bun.sleep(500);
		} finally {
			process.env.PATH = path;
			process.off('unhandledRejection', note);
		}
		expect(unhandled).toEqual([]);
	}, 60_000);

	// PR #940, Copilot: the restore runs as root; a forged Sicherung must not write outside the two keys
	it('schreibt bei der Wiederherstellung nur die beiden Schlüssel, keine anderen Namen aus der Sicherung', async () => {
		const { name, code } = await secured();
		const forged = { ...secrets, '../ausserhalb': 'x', db_password: 'fremd' } as typeof secrets;
		const file = await createBackup(`${server}/${name}`, await folder(), forged);
		const parent = await folder();
		const keys = join(parent, 'keys');
		await mkdir(keys);
		await restoreBackup(file, code, `${server}/${name}`, keys, migrations);
		expect((await readdir(keys)).sort()).toEqual(['encryption_key', 'jwt_secret']);
		expect(await readdir(parent)).toEqual(['keys']);
	}, 60_000);

	it('löscht eine halbe Datei, die ein abgebrochener Lauf hinterliess', async () => {
		const { name } = await secured();
		const dir = await folder();
		await writeFile(join(dir, 'dwello-2026-10-27T02-00-00Z.backup.part'), 'halb');
		const file = await createBackup(`${server}/${name}`, dir, secrets);
		expect(await readdir(dir)).toEqual([file.split('/').pop()!]);
	}, 60_000);

	it('lehnt die Wiederherstellung mit einem anderen Code ab und lässt die Datenbank, wie sie ist', async () => {
		const { name } = await secured();
		const file = await createBackup(`${server}/${name}`, await folder(), secrets);
		await expect(
			restoreBackup(file, generateCode(), `${server}/${name}`, await folder(), migrations)
		).rejects.toThrow('Der Wiederherstellungscode passt nicht zu dieser Sicherung');
		expect(await query(name, 'SELECT name FROM buildings')).toEqual([{ name: 'Lindenhof' }]);
	}, 60_000);

	it('sichert nicht, solange kein Wiederherstellungscode bestätigt ist', async () => {
		const name = await database();
		const dir = await folder();
		await expect(createBackup(`${server}/${name}`, dir, secrets)).rejects.toThrow(
			'kein Wiederherstellungscode bestätigt'
		);
		expect(await readdir(dir)).toEqual([]);
	});

	it('behält die letzten 7 täglichen und je eine pro Monat während 12 Monaten', async () => {
		const { name } = await secured();
		const dir = await folder();
		const days = [
			'2026-10-27',
			'2026-10-26',
			'2026-10-25',
			'2026-10-24',
			'2026-10-23',
			'2026-10-22',
			'2026-10-21',
			'2026-10-20'
		];
		for (const day of [...days, '2026-09-30', '2026-09-15', '2025-11-30', '2025-10-30'])
			await writeFile(join(dir, `dwello-${day}T01-00-00Z.backup`), '');
		const file = await createBackup(
			`${server}/${name}`,
			dir,
			secrets,
			new Date('2026-10-28T02:00:00Z')
		);

		expect((await readdir(dir)).sort()).toEqual(
			[file.split('/').pop()!, ...days.slice(0, 6), '2026-09-30', '2025-11-30']
				.map((d) => (d.startsWith('dwello-') ? d : `dwello-${d}T01-00-00Z.backup`))
				.sort()
		);
	}, 60_000);
});

describe('Zeitplan der Sicherung', () => {
	it('sichert, wenn noch keine gelungen ist, und danach am selben Tag nicht wieder', async () => {
		const { name } = await secured();
		const dir = await folder();
		expect(await backupIfDue(`${server}/${name}`, dir)).toBeString();
		expect(await backupIfDue(`${server}/${name}`, dir)).toBeUndefined();
		expect(await readdir(dir)).toHaveLength(1);
	}, 60_000);

	it('sichert nicht, solange kein Code bestätigt ist', async () => {
		const dir = await folder();
		expect(await backupIfDue(`${server}/${await database()}`, dir)).toBeUndefined();
	});
});

describe('Zustand der Sicherung', () => {
	it('wartet auf die Einrichtung, solange kein Code bestätigt ist', async () => {
		expect((await backupState(`${server}/${await database()}`, await folder())).backup).toBe(
			'setup'
		);
	});

	it('ist veraltet, wenn seit mehr als einem Tag keine Sicherung gelungen ist, und nennt den Tag der letzten', async () => {
		const { name } = await secured();
		const dir = await folder();
		await createBackup(`${server}/${name}`, dir, secrets);
		const now = Date.now();
		expect(
			(await backupState(`${server}/${name}`, dir, new Date(now + 23 * 3600_000))).backup
		).toBe('ok');
		const stale = await backupState(`${server}/${name}`, dir, new Date(now + 25 * 3600_000));
		expect(stale.backup).toBe('stale');
		expect((stale as { since?: string }).since?.slice(0, 10)).toBe(
			new Date(now).toISOString().slice(0, 10)
		);
	}, 60_000);

	it('zählt ohne gelungene Sicherung ab der Bestätigung des Codes', async () => {
		const { name } = await secured();
		const later = new Date(Date.now() + 25 * 3600_000);
		expect((await backupState(`${server}/${name}`, await folder(), later)).backup).toBe('stale');
	});
});

describe('Sicherung vor einer Migration', () => {
	it('legt vor der Migration eine Sicherung an', async () => {
		const { name } = await secured();
		const dir = await folder();
		await backupBeforeMigration(`${server}/${name}`, dir, secrets);
		expect(await readdir(dir)).toHaveLength(1);
	}, 60_000);

	it('bricht ab, wenn die Sicherung scheitert', async () => {
		const { name } = await secured();
		await expect(
			backupBeforeMigration(`${server}/${name}`, join(await folder(), 'fehlt', 'nicht'), secrets)
		).rejects.toThrow(
			'Die Sicherung vor der Migration ist fehlgeschlagen; Dwello wendet keine Migration an.'
		);
	}, 60_000);

	it('migriert ohne Sicherung, solange kein Code bestätigt ist, und schreibt das ins Protokoll', async () => {
		const name = await database();
		const dir = await folder();
		const logged: string[] = [];
		const log = console.log;
		console.log = (line: string) => logged.push(line);
		try {
			await backupBeforeMigration(`${server}/${name}`, dir, secrets);
		} finally {
			console.log = log;
		}
		expect(await readdir(dir)).toEqual([]);
		expect(logged).toContain(
			'Keine Sicherung vor der Migration: Es ist noch kein Wiederherstellungscode bestätigt.'
		);
	});
});

// 718b review C-4: the scripts reach the app's database through its pool, which must not keep them running
it('beendet db:migrate gleich nach der Migration, auch mit Ordner für die Sicherung', async () => {
	const older = await mkdtemp(join(tmpdir(), 'dwello-migrations-'));
	dirs.push(older);
	await cp(migrations, older, { recursive: true, filter: (file) => !file.endsWith('0038_backups.sql') && !file.includes('0039') });
	const name = `dwello_backup_${crypto.randomUUID().replace(/-/g, '')}`;
	await query('postgres', `CREATE DATABASE "${name}"`);
	databases.push(name);
	await migrate(`${server}/${name}`, older);
	const started = Date.now();
	const run = Bun.spawn(['bun', 'scripts/migrate.ts'], {
		cwd: join(import.meta.dir, '..', '..'),
		env: { ...process.env, DATABASE_URL: `${server}/${name}`, BACKUP_DIR: await folder() },
		stdout: 'pipe'
	});
	expect(await run.exited).toBe(0);
	expect(await new Response(run.stdout).text()).toContain('Migrationen angewendet');
	expect(Date.now() - started).toBeLessThan(15_000);
}, 60_000);

describe('Health-Check und Sicherung', () => {
	it('meldet mit dem Tag der letzten, wenn seit mehr als einem Tag keine Sicherung gelungen ist, und bleibt gesund', async () => {
		const { app } = await import('../app');
		const { db } = await import('../db/connection');
		const { backupCodes } = await import('../db/schema');
		const { eq } = await import('drizzle-orm');
		const { publicKey, salt } = await recipientOf(generateCode());
		const confirmedAt = new Date(Date.now() - 25 * 3600_000);
		const [row] = await db
			.insert(backupCodes)
			.values({
				publicKey: publicKey.toString('base64'),
				salt: salt.toString('base64'),
				confirmedAt
			})
			.returning();
		process.env.BACKUP_DIR = await folder();
		try {
			const response = await app.handle(new Request('http://localhost/health'));
			// 200, so the frontend still starts (it waits for a healthy backend) and shows the hint
			expect(response.status).toBe(200);
			expect(await response.json()).toMatchObject({
				backup: 'stale',
				since: confirmedAt.toISOString()
			});
		} finally {
			delete process.env.BACKUP_DIR;
			await db.delete(backupCodes).where(eq(backupCodes.id, row.id));
		}
		expect(await (await app.handle(new Request('http://localhost/health'))).json()).toMatchObject({
			backup: 'off'
		});
	});
});
