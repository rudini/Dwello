/**
 * Recreates the database in DATABASE_URL (default: the E2E database) from the migrations, so every E2E or
 * PostgreSQL test run starts from the same data
 * and test data that cannot be deleted (sent statements, reminders) never reaches the development database.
 */

import { join } from 'path';
import pg from 'pg';
import { migrate } from '../src/db/migrate';

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

const applied = await migrate(url.href, migrations);

console.log(`Datenbank ${database} neu aufgesetzt (${applied.length} Migrationen)`);
