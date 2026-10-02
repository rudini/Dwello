/**
 * Recreates the E2E database from the migrations, so every E2E run starts from the same data
 * and test data that cannot be deleted (sent statements, reminders) never reaches the development database.
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import pg from 'pg';

const url = new URL(process.env.DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello_e2e');
const database = url.pathname.slice(1);
const migrations = join(import.meta.dir, '..', 'migrations');

async function run(connectionString: string, ...statements: string[]) {
	const client = new pg.Client({ connectionString });
	await client.connect();
	try {
		for (const statement of statements) await client.query(statement);
	} finally {
		await client.end();
	}
}

const maintenance = new URL(url);
maintenance.pathname = '/postgres';
await run(maintenance.href, `DROP DATABASE IF EXISTS "${database}" WITH (FORCE)`, `CREATE DATABASE "${database}"`);

const files = (await readdir(migrations)).filter((file) => file.endsWith('.sql')).sort();
await run(url.href, ...(await Promise.all(files.map((file) => readFile(join(migrations, file), 'utf8')))));

console.log(`E2E-Datenbank ${database} neu aufgesetzt (${files.length} Migrationen)`);
