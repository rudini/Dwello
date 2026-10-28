/**
 * The Sicherung (#718, R1, O1): a pg_dump of the whole database (documents included, they are stored in it) and the keys of
 * the installation, encrypted to the confirmed Wiederherstellungscode, in BACKUP_DIR (the folder `backups` next to
 * docker-compose.prod.yml). Daily at 03:00 Swiss time, at start when the last one is older than a day, and before a
 * migration. The Wiederherstellung is a command of the Betreiber (scripts/restore.ts).
 */

import { spawn } from 'child_process';
import { createReadStream } from 'fs';
import { chmod, mkdtemp, open, readdir, rename, rm, unlink, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import pg from 'pg';
import { Readable } from 'stream';
import { migrate } from '../db/migrate';
import { decryptFile, encryptStream } from './backup-crypto';

const DAY = 24 * 3600_000;
type Secrets = { encryption_key?: string; jwt_secret?: string };

const envSecrets = (): Secrets => ({
	encryption_key: process.env.ENCRYPTION_KEY,
	jwt_secret: process.env.JWT_SECRET
});

async function withClient<T>(url: string, work: (client: pg.Client) => Promise<T>) {
	const client = new pg.Client({ connectionString: url });
	await client.connect();
	try {
		return await work(client);
	} finally {
		await client.end();
	}
}

/** The newest confirmed code; none before 0038 or before the landlord confirmed one */
const confirmedCode = (client: pg.Client) =>
	client
		.query(`SELECT to_regclass('backup_codes') AS t`)
		.then(async ({ rows }) =>
			rows[0].t
				? ((
						await client.query(
							'SELECT public_key, salt, confirmed_at FROM backup_codes WHERE confirmed_at IS NOT NULL ORDER BY confirmed_at DESC LIMIT 1'
						)
					).rows[0] as { public_key: string; salt: string; confirmed_at: Date } | undefined)
				: undefined
		);

const swiss = (date: Date) => date.toLocaleString('sv-SE', { timeZone: 'Europe/Zurich' }); // «2026-10-28 03:00:00»
const stamp = (date: Date) => date.toISOString().slice(0, 19).replaceAll(':', '-') + 'Z';
const dateOf = (file: string) =>
	new Date(file.slice(7, 27).replace(/T(\d\d)-(\d\d)-(\d\d)Z/, 'T$1:$2:$3Z'));
const isBackup = (file: string) => /^dwello-\d{4}-\d\d-\d\dT\d\d-\d\d-\d\dZ\.backup$/.test(file);

/** The newest per Swiss day for the last 7 days with one, and the newest per month for the 12 months up to now */
function kept(files: string[], now: Date) {
	const newestFirst = [...files].sort().reverse();
	const newestPer = (key: (day: string) => string) => {
		const seen = new Set<string>();
		return newestFirst.filter(
			(file) => !seen.has(key(swiss(dateOf(file)))) && seen.add(key(swiss(dateOf(file))))
		);
	};
	const [year, month] = swiss(now).slice(0, 7).split('-').map(Number);
	const oldest = month === 12 ? `${year}-01` : `${year - 1}-${String(month + 1).padStart(2, '0')}`;
	return new Set([
		...newestPer((day) => day.slice(0, 10)).slice(0, 7),
		...newestPer((day) => day.slice(0, 7)).filter(
			(file) => swiss(dateOf(file)).slice(0, 7) >= oldest
		)
	]);
}

/** Makes a Sicherung in dir and deletes the ones the retention no longer keeps; returns its path */
export async function createBackup(
	url: string,
	dir: string,
	secrets: Secrets = envSecrets(),
	now = new Date()
) {
	return withClient(url, async (client) => {
		const code = await confirmedCode(client);
		if (!code) throw new Error('Keine Sicherung: Es ist kein Wiederherstellungscode bestätigt.');
		const run = (
			await client.query('INSERT INTO backup_runs (started_at) VALUES ($1) RETURNING id', [now])
		).rows[0].id;
		const file = join(dir, `dwello-${stamp(now)}.backup`);
		try {
			const dump = spawn('pg_dump', [
				'--format=custom',
				'--no-owner',
				'--no-acl',
				`--dbname=${url}`
			]);
			let stderr = '';
			dump.stderr.on('data', (chunk) => (stderr += chunk));
			const exited = new Promise<number>((resolve, reject) =>
				dump.on('close', resolve).on('error', reject)
			);
			const head = Buffer.from(
				JSON.stringify({ version: 1, createdAt: now.toISOString(), secrets })
			);
			const length = Buffer.alloc(4);
			length.writeUInt32BE(head.length);
			const payload = Readable.from(
				(async function* () {
					yield Buffer.concat([length, head]);
					yield* dump.stdout;
				})()
			);
			await encryptStream(payload, `${file}.part`, {
				publicKey: Buffer.from(code.public_key, 'base64'),
				salt: Buffer.from(code.salt, 'base64')
			});
			if ((await exited) !== 0) throw new Error(`pg_dump: ${stderr.trim()}`);
			await rename(`${file}.part`, file);
			const files = (await readdir(dir)).filter(isBackup);
			const keep = kept(files, now);
			for (const old of files) if (!keep.has(old)) await unlink(join(dir, old));
			await client.query('UPDATE backup_runs SET finished_at = now(), file = $2 WHERE id = $1', [
				run,
				file
			]);
			return file;
		} catch (error) {
			await rm(`${file}.part`, { force: true });
			await client.query('UPDATE backup_runs SET finished_at = now(), error = $2 WHERE id = $1', [
				run,
				String(error instanceof Error ? error.message : error)
			]);
			throw error;
		}
	});
}

/** Replaces database and keys with a Sicherung, then applies the migrations it does not have yet */
export async function restoreBackup(
	file: string,
	code: string,
	url: string,
	secretsDir: string | undefined,
	migrations: string
) {
	const work = await mkdtemp(join(tmpdir(), 'dwello-restore-'));
	try {
		await decryptFile(file, code, join(work, 'plain'));
		const handle = await open(join(work, 'plain'));
		const length = Buffer.alloc(4);
		await handle.read(length, 0, 4, 0);
		const head = Buffer.alloc(length.readUInt32BE());
		await handle.read(head, 0, head.length, 4);
		await handle.close();
		const { secrets } = JSON.parse(head.toString()) as { secrets: Secrets };
		await withClient(url, (client) =>
			client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
		);
		const restore = spawn('pg_restore', [
			'--no-owner',
			'--no-acl',
			'--exit-on-error',
			`--dbname=${url}`
		]);
		let stderr = '';
		restore.stderr.on('data', (chunk) => (stderr += chunk));
		createReadStream(join(work, 'plain'), { start: 4 + head.length }).pipe(restore.stdin);
		if (
			(await new Promise<number>((resolve, reject) =>
				restore.on('close', resolve).on('error', reject)
			)) !== 0
		)
			throw new Error(`pg_restore: ${stderr.trim()}`);
		await migrate(url, migrations);
		if (secretsDir)
			for (const [name, value] of Object.entries(secrets)) {
				if (!value) continue;
				await rm(join(secretsDir, name), { force: true });
				await writeFile(join(secretsDir, name), value);
				await chmod(join(secretsDir, name), 0o444);
			}
	} finally {
		await rm(work, { recursive: true, force: true });
	}
}

const lastSuccess = async (client: pg.Client) =>
	((
		await client.query(
			'SELECT max(started_at) AS at FROM backup_runs WHERE finished_at IS NOT NULL AND error IS NULL'
		)
	).rows[0].at as Date | null) ?? undefined;

/** off: no BACKUP_DIR or no confirmed code; stale: no Sicherung succeeded for more than a day (since: the last one, else the confirmation) */
export async function backupState(url: string, dir = process.env.BACKUP_DIR, now = new Date()) {
	if (!dir) return { backup: 'off' as const };
	return withClient(url, async (client) => {
		const code = await confirmedCode(client);
		if (!code) return { backup: 'off' as const };
		const since = (await lastSuccess(client)) ?? code.confirmed_at;
		return {
			backup: now.getTime() - since.getTime() > DAY ? ('stale' as const) : ('ok' as const),
			since: since.toISOString()
		};
	});
}

/** Due when no Sicherung succeeded for a day, or after 03:00 Swiss time none did since then */
export function backupDue(last: Date | undefined, now: Date) {
	if (!last || now.getTime() - last.getTime() >= DAY) return true;
	const today = swiss(now);
	return today.slice(11) >= '03:00' && swiss(last) < `${today.slice(0, 10)} 03:00`;
}

/** One tick of the schedule: a Sicherung when a code is confirmed and one is due; returns its path */
export async function backupIfDue(url: string, dir: string, now = new Date()) {
	const due = await withClient(
		url,
		async (client) =>
			(await confirmedCode(client)) !== undefined && backupDue(await lastSuccess(client), now)
	);
	return due ? createBackup(url, dir, envSecrets(), now) : undefined;
}

/** At start and every 15 minutes (index.ts); a failure goes to the log and is tried again at the next tick */
export function startBackups(url: string, dir = process.env.BACKUP_DIR) {
	if (!dir) return;
	let running = false;
	const tick = async () => {
		if (running) return;
		running = true;
		try {
			const file = await backupIfDue(url, dir);
			if (file) console.log(`Sicherung erstellt: ${file}`);
		} catch (error) {
			console.error(`Sicherung fehlgeschlagen: ${error instanceof Error ? error.message : error}`);
		} finally {
			running = false;
		}
	};
	void tick();
	setInterval(tick, 15 * 60_000);
}

/** Before a migration (scripts/migrate.ts): a Sicherung, or none with a line in the log while no code is confirmed */
export async function backupBeforeMigration(
	url: string,
	dir = process.env.BACKUP_DIR,
	secrets = envSecrets()
) {
	if (!dir) return;
	if (!(await withClient(url, confirmedCode))) {
		console.log(
			'Keine Sicherung vor der Migration: Es ist noch kein Wiederherstellungscode bestätigt.'
		);
		return;
	}
	try {
		await createBackup(url, dir, secrets);
	} catch (error) {
		throw new Error(
			`Die Sicherung vor der Migration ist fehlgeschlagen; Dwello wendet keine Migration an. Ursache: ${error instanceof Error ? error.message : error}`,
			{ cause: error }
		);
	}
}
