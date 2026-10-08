/**
 * Demo data for trying the app and showing it (bun run db:demo), never part of the migrations (real PostgreSQL)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { join } from 'path';
import pg from 'pg';
import { loadDemoData } from '../db/demo-data';
import { migrate } from '../db/migrate';

const server = 'postgresql://dwello:dwello@localhost:5432';
const name = `dwello_demo_${crypto.randomUUID().replace(/-/g, '')}`;

async function query(database: string, sql: string) {
	const client = new pg.Client({ connectionString: `${server}/${database}` });
	await client.connect();
	try {
		return (await client.query(sql)).rows;
	} finally {
		await client.end();
	}
}

afterAll(async () => {
	await query('postgres', `DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
});

describe('Demodaten', () => {
	it('legt Gebäude, Wohnungen, Mieter, Verträge, Rechnungen und Abrechnungen an, auch ein zweites Mal ohne Doppel', async () => {
		await query('postgres', `CREATE DATABASE "${name}"`);
		await migrate(`${server}/${name}`, join(import.meta.dir, '..', '..', 'migrations'));
		const counts = `SELECT (SELECT COUNT(*) FROM buildings)::int AS buildings, (SELECT COUNT(*) FROM apartments)::int AS apartments,
			(SELECT COUNT(*) FROM tenants)::int AS tenants, (SELECT COUNT(*) FROM rental_contracts)::int AS contracts,
			(SELECT COUNT(*) FROM invoices)::int AS invoices, (SELECT COUNT(*) FROM utility_statements)::int AS statements`;

		await loadDemoData(`${server}/${name}`);
		await loadDemoData(`${server}/${name}`);

		expect(await query(name, counts)).toEqual([
			{ buildings: 3, apartments: 13, tenants: 9, contracts: 10, invoices: 14, statements: 3 }
		]);
	});
});
