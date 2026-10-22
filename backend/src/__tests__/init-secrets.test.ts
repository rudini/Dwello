/**
 * The keys of an installation (#577): docker/init-secrets.sh runs before Dwello starts and writes the JWT secret,
 * the database password and the encryption key of stored secrets (#580) into the volume once; nobody types a key.
 * A value the operator sets in .env (older installations) wins.
 */

import { afterEach, describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const SCRIPT = join(import.meta.dir, '../../../docker/init-secrets.sh');
const KEYS = ['jwt_secret', 'db_password', 'encryption_key'];
let dir = '';
afterEach(() => rmSync(dir, { recursive: true, force: true }));

// the script gets the key directory and the database's data directory (a fresh one is empty)
function run(env: Record<string, string> = {}) {
	const result = Bun.spawnSync(['sh', SCRIPT, dir, join(dir, 'pgdata')], { env: { PATH: process.env.PATH!, ...env } });
	if (result.exitCode !== 0) throw new Error(result.stderr.toString());
}
const read = (key: string) => readFileSync(join(dir, key), 'utf8');

describe('Schlüssel der Installation', () => {
	// the frontend and backend run as their own users (Dockerfile, backend/Dockerfile): they read the keys, only the
	// script writes them; the volume is mounted into Dwello's containers only
	it('erzeugt jeden Schlüssel lang und zufällig, änderbar nur vom Skript', () => {
		dir = mkdtempSync(join(tmpdir(), 'dwello-secrets-'));
		run();

		for (const key of KEYS) {
			expect(read(key)).toMatch(/^[A-Za-z0-9]{43,}$/);
			expect(statSync(join(dir, key)).mode & 0o777).toBe(0o444);
		}
		expect(new Set(KEYS.map(read)).size).toBe(3);
	});

	it('behält die Schlüssel bei jedem weiteren Start', () => {
		dir = mkdtempSync(join(tmpdir(), 'dwello-secrets-'));
		run();
		const first = KEYS.map(read);

		run();

		expect(KEYS.map(read)).toEqual(first);
	});

	it('nimmt den Schlüssel und das Datenbankpasswort aus der .env einer älteren Installation', () => {
		dir = mkdtempSync(join(tmpdir(), 'dwello-secrets-'));
		run();
		const encryption = read('encryption_key');

		run({ JWT_SECRET: 'ein-geheimer-Schluessel-aus-der-env-0123456789', POSTGRES_PASSWORD: 'passwort-aus-der-env' });

		expect(read('jwt_secret')).toBe('ein-geheimer-Schluessel-aus-der-env-0123456789');
		expect(read('db_password')).toBe('passwort-aus-der-env');
		expect(read('encryption_key')).toBe(encryption);
	});

	// docker-compose.prod.yml set the password «dwello» when .env named none: that database keeps it
	it('behält das Passwort einer Datenbank, die ohne Passwort in der .env eingerichtet wurde', () => {
		dir = mkdtempSync(join(tmpdir(), 'dwello-secrets-'));
		mkdirSync(join(dir, 'pgdata'));
		writeFileSync(join(dir, 'pgdata', 'PG_VERSION'), '16\n');

		run();

		expect(read('db_password')).toBe('dwello');
		expect(read('jwt_secret')).toMatch(/^[A-Za-z0-9]{43,}$/);
	});
});
