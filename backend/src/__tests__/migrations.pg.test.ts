/**
 * Applying the SQL migrations to a database (real PostgreSQL, one throwaway database per case)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { copyFile, mkdtemp, readdir } from 'fs/promises';
import { tmpdir } from 'os';
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
			'Die Datenbank stammt von Migrationen, die es nicht mehr gibt (0001_initial_schema.sql). Eine lokale Datenbank neu aufsetzen: bun run db:reset. Eine Installation nicht zurücksetzen (alle Daten gingen verloren), sondern mit der Version starten, mit der sie zuletzt lief.'
		);
	});

	// Eine früher von docker-compose (initdb) eingerichtete Datenbank hat Tabellen, aber keine Buchführung
	it('lehnt eine Datenbank mit Tabellen, aber ohne Buchführung der Migrationen ab', async () => {
		const name = await database();
		await query(name, 'CREATE TABLE buildings (id uuid PRIMARY KEY)');

		await expect(migrate(`${server}/${name}`, migrations)).rejects.toThrow(
			'Die Datenbank wurde ohne diese Migrationen eingerichtet. Eine lokale Datenbank neu aufsetzen: bun run db:reset. Eine Installation nicht zurücksetzen (alle Daten gingen verloren), sondern mit der Version starten, mit der sie zuletzt lief.'
		);
	});

	// #63: Rätoromanisch ist keine Sprache des Mieters mehr; wer sie hatte, erhält Deutsch
	it('setzt Mieter auf Rätoromanisch auf Deutsch und nimmt die Sprache nicht mehr an', async () => {
		const name = await database();
		const before = await mkdtemp(join(tmpdir(), 'dwello-migrations-'));
		for (const file of files.filter((file) => file < '0012_tenant_language_without_rm.sql')) {
			await copyFile(join(migrations, file), join(before, file));
		}
		await migrate(`${server}/${name}`, before);
		await query(name, `INSERT INTO tenants (first_name, last_name, language) VALUES ('Gian', 'Caduff', 'rm'), ('Lea', 'Rossi', 'it')`);
		await query(name, `INSERT INTO configuration (key, value) VALUES ('default_language', 'rm')`);

		await migrate(`${server}/${name}`, migrations);

		expect(await query(name, 'SELECT first_name, language FROM tenants ORDER BY first_name')).toEqual([
			{ first_name: 'Gian', language: 'de' },
			{ first_name: 'Lea', language: 'it' }
		]);
		expect(await query(name, `SELECT value FROM configuration WHERE key = 'default_language'`)).toEqual([{ value: 'de' }]);
		await expect(query(name, `UPDATE tenants SET language = 'rm'`)).rejects.toThrow('tenants_language_check');
	});
	// #79: ein Entwurf erhält die Rundung zugunsten des Mieters; was versendet ist, behält den Saldo, den der Mieter erhielt
	it('rundet den Saldo der Entwürfe neu und lässt versendete Abrechnungen, wie sie sind', async () => {
		const name = await database();
		const before = await mkdtemp(join(tmpdir(), 'dwello-migrations-'));
		for (const file of files.filter((file) => file < '0016_statement_balance_tenant_favour.sql')) {
			await copyFile(join(migrations, file), join(before, file));
		}
		await migrate(`${server}/${name}`, before);
		await query(
			name,
			`WITH b AS (INSERT INTO buildings (name, address, postal_code, city, canton) VALUES ('Testhof', 'Testweg 1', '8400', 'Winterthur', 'ZH') RETURNING id),
			a AS (INSERT INTO apartments (building_id, number, area, rooms) SELECT id, '1.01', 50, 2 FROM b RETURNING id),
			t AS (INSERT INTO tenants (first_name, last_name) VALUES ('Test', 'Mieter') RETURNING id),
			c AS (INSERT INTO rental_contracts (apartment_id, tenant_id, start_date, base_rent, monthly_advance_payment)
				SELECT a.id, t.id, '2020-01-01', 900, 20 FROM a, t RETURNING id, apartment_id, tenant_id)
			INSERT INTO utility_statements (tenant_id, apartment_id, contract_id, statement_number, period_start, period_end,
				statement_date, rental_days, rental_start, rental_end, total_costs, total_advance_payments, balance, status, pdf_blob)
			SELECT tenant_id, apartment_id, id, n, '2024-01-01', '2024-12-31', '2025-01-15', 366, '2024-01-01', '2024-12-31', 1031.03, advance, balance, status, 'pdf'
			FROM c, (VALUES ('S-1', 240, 791.05, 'draft'), ('S-2', 1080, -48.95, 'draft'), ('S-3', 1031.00, 0.05, 'draft'),
				('S-4', 1031.04, 0.00, 'draft'), ('S-5', 1031.03, 0.00, 'draft'), ('S-6', 240, 791.05, 'sent'), ('S-7', 1080, -48.95, 'paid'))
				AS s (n, advance, balance, status)`
		);

		await migrate(`${server}/${name}`, migrations);

		expect(await query(name, 'SELECT statement_number, balance, pdf_blob FROM utility_statements ORDER BY statement_number')).toEqual([
			{ statement_number: 'S-1', balance: '791.00', pdf_blob: null },
			{ statement_number: 'S-2', balance: '-49.00', pdf_blob: null },
			{ statement_number: 'S-3', balance: '0.00', pdf_blob: null },
			{ statement_number: 'S-4', balance: '-0.05', pdf_blob: null },
			{ statement_number: 'S-5', balance: '0.00', pdf_blob: 'pdf' },
			{ statement_number: 'S-6', balance: '791.05', pdf_blob: 'pdf' },
			{ statement_number: 'S-7', balance: '-48.95', pdf_blob: 'pdf' }
		]);
	});
});
