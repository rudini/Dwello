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
	// #91: a contract with statements agrees what it was billed and what it could have been billed until its last
	// statement, one without statements every umlagefähige category; stored statements stay as they are
	it('übernimmt die vereinbarten Nebenkosten bestehender Mietverträge aus ihren Abrechnungen', async () => {
		const name = await database();
		const before = await mkdtemp(join(tmpdir(), 'dwello-migrations-'));
		for (const file of files.filter((file) => file < '0020_contract_categories.sql')) {
			await copyFile(join(migrations, file), join(before, file));
		}
		await migrate(`${server}/${name}`, before);
		await query(
			name,
			`WITH b AS (INSERT INTO buildings (name, address, postal_code, city, canton) VALUES ('Testhof', 'Testweg 1', '8400', 'Winterthur', 'ZH') RETURNING id),
			a AS (INSERT INTO apartments (building_id, number, area, rooms) SELECT id, n, 50, 2 FROM b, (VALUES ('1.01'), ('1.02')) AS x (n) RETURNING id, number),
			t AS (INSERT INTO tenants (first_name, last_name) VALUES ('Billed', 'Mieter'), ('Fresh', 'Mieter') RETURNING id, first_name),
			c AS (INSERT INTO rental_contracts (apartment_id, tenant_id, start_date, base_rent, monthly_advance_payment)
				SELECT a.id, t.id, '2020-01-01', 900, 20 FROM a, t WHERE (a.number = '1.01') = (t.first_name = 'Billed') RETURNING id, apartment_id, tenant_id),
			s AS (INSERT INTO utility_statements (tenant_id, apartment_id, contract_id, statement_number, period_start, period_end,
				statement_date, rental_days, rental_start, rental_end, total_costs, total_advance_payments, balance, status)
				SELECT c.tenant_id, c.apartment_id, c.id, 'S-1', '2024-01-01', '2024-12-31', '2025-01-15', 366, '2024-01-01', '2024-12-31', 500, 240, 260, 'sent'
				FROM c JOIN t ON t.id = c.tenant_id WHERE t.first_name = 'Billed' RETURNING id)
			INSERT INTO utility_statement_line_items (statement_id, category_id, description, total_amount, tenant_share)
			SELECT s.id, categories.id, categories.name, 1000, 500 FROM s, categories WHERE categories.name IN ('Caretaker', 'Administration')`
		);
		// a position of a category no longer umlagefähig gives no agreement (code review C-2); recorded after the statement,
		// in its period: it could have been billed; one after the last period or before the contract could not
		await query(
			name,
			`INSERT INTO invoices (building_id, category_id, billing_entity_name, description, amount, invoice_date, is_valid_utility_cost)
			SELECT buildings.id, categories.id, 'Muster AG', categories.name, 400, d::date, true FROM buildings, categories,
				(VALUES ('Elevator', '2024-06-30'), ('Garden Maintenance', '2025-03-31'), ('Snow Removal', '2019-12-31')) AS x (category, d) WHERE categories.name = x.category`
		);

		await migrate(`${server}/${name}`, migrations);

		const agreed = async (firstName: string) =>
			(
				await query(
					name,
					`SELECT categories.name FROM contract_categories JOIN categories ON categories.id = category_id
					JOIN rental_contracts ON rental_contracts.id = contract_id JOIN tenants ON tenants.id = tenant_id
					WHERE tenants.first_name = '${firstName}' AND agreed ORDER BY categories.name`
				)
			).map((row) => row.name);
		const umlagefaehig = (await query(name, 'SELECT name FROM categories WHERE is_allowed_utility_cost ORDER BY name')).map((row) => row.name);
		expect(await agreed('Billed')).toEqual(['Caretaker', 'Elevator']);
		expect(await agreed('Fresh')).toEqual(umlagefaehig);
		expect(await query(name, 'SELECT total_costs, agreed_category_ids FROM utility_statements')).toEqual([
			{ total_costs: '500.00', agreed_category_ids: null }
		]);
	});

	// #100: Brennstoff ist die Heizung und jede Kategorie, die schon einen Tankbestand hat; sonst liesse sich ihr
	// nächster Endbestand nicht mehr erfassen
	it('kennzeichnet die Heizung und Kategorien mit Tankbestand als Brennstoff', async () => {
		const name = await database();
		const before = await mkdtemp(join(tmpdir(), 'dwello-migrations-'));
		for (const file of files.filter((file) => file < '0024_category_fuel.sql')) {
			await copyFile(join(migrations, file), join(before, file));
		}
		await migrate(`${server}/${name}`, before);
		await query(
			name,
			`WITH b AS (INSERT INTO buildings (name, address, postal_code, city, canton) VALUES ('Testhof', 'Testweg 1', '8400', 'Winterthur', 'ZH') RETURNING id),
			wood AS (INSERT INTO categories (name, name_de, is_heating_cost, type) VALUES ('Holz', 'Holz', true, 'custom') RETURNING id),
			service AS (INSERT INTO categories (name, name_de, is_heating_cost, type) VALUES ('Service', 'Service', true, 'custom') RETURNING id)
			INSERT INTO fuel_stocks (building_id, category_id, reading_date, amount) SELECT b.id, wood.id, '2025-12-31', 900 FROM b, wood`
		);

		await migrate(`${server}/${name}`, migrations);

		expect(await query(name, `SELECT name FROM categories WHERE is_fuel ORDER BY name`)).toEqual([{ name: 'Heating' }, { name: 'Holz' }]);
	});
});
