/**
 * Applying the SQL migrations to a database (real PostgreSQL, one throwaway database per case)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { readdir } from 'fs/promises';
import { join } from 'path';
import pg from 'pg';
import { migrate } from '../db/migrate';

const server = 'postgresql://dwello:dwello@localhost:5432';
const migrations = join(import.meta.dir, '..', '..', 'migrations');
const databases: string[] = [];

async function query(database: string, sql: string) {
	const client = new pg.Client({ connectionString: `${server}/${database}` });
	await client.connect();
	try {
		return (await client.query(sql)).rows;
	} finally {
		await client.end();
	}
}

async function database() {
	const name = `dwello_migrate_${crypto.randomUUID().replace(/-/g, '')}`;
	await query('postgres', `CREATE DATABASE "${name}"`);
	databases.push(name);
	return name;
}

const files = (await readdir(migrations)).filter((file) => file.endsWith('.sql')).sort();

afterAll(async () => {
	for (const name of databases) await query('postgres', `DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
});

describe('Migrationen anwenden', () => {
	it('richtet eine leere Datenbank mit allen Migrationen ein und wiederholt nichts', async () => {
		const name = await database();

		expect(await migrate(`${server}/${name}`, migrations)).toEqual(files);
		expect(await migrate(`${server}/${name}`, migrations)).toEqual([]);
	});

	// Die Migrationen wurden im Oktober 2026 zu einer neuen Basis zusammengefasst; eine ältere Datenbank bekäme sonst
	// die Stammdaten ein zweites Mal
	it('lehnt eine Datenbank ab, die Migrationen kennt, die es nicht mehr gibt', async () => {
		const name = await database();
		await query(name, 'CREATE TABLE schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
		await query(name, `INSERT INTO schema_migrations (name) VALUES ('0001_initial_schema.sql')`);

		await expect(migrate(`${server}/${name}`, migrations)).rejects.toThrow(
			'Die Datenbank stammt von Migrationen, die es nicht mehr gibt (0001_initial_schema.sql). Bitte neu aufsetzen: bun run db:reset'
		);
	});
});
