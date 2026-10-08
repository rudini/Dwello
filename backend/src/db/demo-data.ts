/**
 * Loads the demo data (demo/demo-data.sql) after the migrations: for trying the app and showing it.
 * Never part of the migrations, so production starts without it; loading it again adds nothing.
 */

import { join } from 'path';
import pg from 'pg';
import { migrate } from './migrate';

const backend = join(import.meta.dir, '..', '..');

export async function loadDemoData(connectionString: string) {
	await migrate(connectionString, join(backend, 'migrations'));
	const client = new pg.Client({ connectionString });
	await client.connect();
	try {
		await client.query(await Bun.file(join(backend, 'demo', 'demo-data.sql')).text());
	} finally {
		await client.end();
	}
}
