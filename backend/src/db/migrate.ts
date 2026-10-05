/**
 * Applies the SQL files in backend/migrations that a database does not have yet.
 * schema_migrations records each applied file; a file and its record commit together.
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import pg from 'pg';

/**
 * Databases set up before schema_migrations existed ran the files by hand.
 * The newest marker found tells how far: 0010 added management_fee_percent, 0009 added manual_override_reason,
 * 0008 added pdf_generated_at,
 * 0007 deleted the "Per Person" and "By Consumption" keys,
 * 0006 changed the apartment status check,
 * 0005 created the documents table, 0001-0003 created and filled the schema
 * (0004 only corrects rows that still have the wrong total, so it may run again).
 */
const ALREADY_APPLIED = `
	SELECT CASE
		WHEN EXISTS (SELECT 1 FROM information_schema.columns
			WHERE table_name = 'utility_statements' AND column_name = 'management_fee_percent') THEN '0010'
		WHEN EXISTS (SELECT 1 FROM information_schema.columns
			WHERE table_name = 'invoices' AND column_name = 'manual_override_reason') THEN '0009'
		WHEN EXISTS (SELECT 1 FROM information_schema.columns
			WHERE table_name = 'utility_statements' AND column_name = 'pdf_generated_at') THEN '0008'
		WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'apartments_status_check'
			AND pg_get_constraintdef(oid) NOT LIKE '%occupied%') THEN '0006'
		WHEN to_regclass('documents') IS NOT NULL THEN '0005'
		WHEN to_regclass('buildings') IS NOT NULL THEN '0003'
		ELSE '' END AS latest`;

/** Returns the files applied by this run, in order */
export async function migrate(connectionString: string, directory: string) {
	const client = new pg.Client({ connectionString });
	await client.connect();
	try {
		const files = (await readdir(directory)).filter((file) => file.endsWith('.sql')).sort();
		const tracked = (await client.query(`SELECT to_regclass('schema_migrations') AS name`)).rows[0].name;
		if (!tracked) {
			let { latest } = (await client.query(ALREADY_APPLIED)).rows[0];
			if (latest === '0006') {
				const removed = `SELECT 1 FROM distribution_keys WHERE name IN ('Per Person', 'By Consumption')`;
				if ((await client.query(removed)).rowCount === 0) latest = '0007';
			}
			await client.query('CREATE TABLE schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
			for (const file of files.filter((file) => latest && file <= `${latest}~`)) {
				await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
			}
		}

		const done = new Set((await client.query('SELECT name FROM schema_migrations')).rows.map((row) => row.name));
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
