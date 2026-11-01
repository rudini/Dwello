/**
 * scripts/e2e-sent-days-ago.ts moves a sending back by Swiss days, as the E2E step «vor 40 Tagen» expects them (#1004):
 * across a change of summer time a day is not 24 hours
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { join } from 'path';
import pg from 'pg';

const script = join(import.meta.dir, '..', '..', 'scripts', 'e2e-sent-days-ago.ts');
const server = new URL(process.env.DATABASE_URL!);
const database = `dwello_e2e_sent_days_${process.pid}`;
const url = Object.assign(new URL(server), { pathname: `/${database}` }).toString();

async function onServer(sql: string) {
	const client = new pg.Client({ connectionString: Object.assign(new URL(server), { pathname: '/postgres' }).toString() });
	await client.connect();
	await client.query(sql).finally(() => client.end());
}

beforeAll(async () => {
	await onServer(`CREATE DATABASE ${database}`);
	const client = new pg.Client({ connectionString: url });
	await client.connect();
	// only the columns the script changes
	await client.query(`
		CREATE TABLE utility_statements (id int PRIMARY KEY, statement_date date, payment_deadline date);
		CREATE TABLE documents (statement_id int, type text, sent_at timestamptz, payment_deadline date);
		INSERT INTO utility_statements VALUES (1, '2026-10-31', '2026-11-30');
		INSERT INTO documents VALUES (1, 'statement', '2026-10-31T22:12:00Z', '2026-11-30');`);
	await client.end();
});

afterAll(() => onServer(`DROP DATABASE IF EXISTS ${database} WITH (FORCE)`));

describe('Versand für den E2E-Test zurückdatieren', () => {
	it('verschiebt den Versand um Schweizer Tage, auch um 23 Uhr über die Zeitumstellung', async () => {
		const run = Bun.spawnSync(['bun', script, '1', '40'], { env: { ...process.env, DATABASE_URL: url } });
		expect(run.exitCode).toBe(0);

		const client = new pg.Client({ connectionString: url });
		await client.connect();
		const { rows } = await client
			.query(`SELECT to_char(sent_at AT TIME ZONE 'Europe/Zurich', 'YYYY-MM-DD HH24:MI') AS sent FROM documents`)
			.finally(() => client.end());
		// 31.10.2026 23:12 in Zurich, 40 Swiss days back
		expect(rows[0].sent).toBe('2026-09-21 23:12');
	});
});
