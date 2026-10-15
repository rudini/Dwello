/**
 * Applies the SQL files in backend/migrations that a database does not have yet.
 * schema_migrations records each applied file; a file and its record commit together.
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import pg from 'pg';

// db:reset deletes every record, so an installation must never follow it
const RESET_HINT =
	'Eine lokale Datenbank neu aufsetzen: bun run db:reset. Eine Installation nicht zurücksetzen, sonst gehen ihre Daten verloren.';

/** Returns the files applied by this run, in order */
export async function migrate(connectionString: string, directory: string) {
	const client = new pg.Client({ connectionString });
	await client.connect();
	try {
		const files = (await readdir(directory)).filter((file) => file.endsWith('.sql')).sort();
		const tracked = (await client.query(`SELECT to_regclass('schema_migrations') AS name`)).rows[0].name;
		if (!tracked && (await client.query(`SELECT to_regclass('buildings') AS name`)).rows[0].name) {
			throw new Error(`Die Datenbank wurde ohne diese Migrationen eingerichtet. ${RESET_HINT}`);
		}
		await client.query(
			'CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())'
		);

		const done = new Set((await client.query('SELECT name FROM schema_migrations')).rows.map((row) => row.name));
		// The migrations were merged into a new baseline in October 2026; older databases are set up anew
		const unknown = [...done].filter((name) => !files.includes(name));
		if (unknown.length) {
			throw new Error(
				`Die Datenbank stammt von Migrationen, die es nicht mehr gibt (${unknown.join(', ')}). ${RESET_HINT}`
			);
		}

		const pending = files.filter((file) => !done.has(file));
		for (const file of pending) {
			await client.query('BEGIN');
			try {
				await client.query(await readFile(join(directory, file), 'utf8'));
				await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
				await client.query('COMMIT');
			} catch (error) {
				await client.query('ROLLBACK');
				throw new Error(`Migration ${file} fehlgeschlagen: ${error instanceof Error ? error.message : error}`);
			}
		}
		return pending;
	} finally {
		await client.end();
	}
}
