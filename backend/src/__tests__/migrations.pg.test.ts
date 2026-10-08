/**
 * Applying the SQL migrations to a database (real PostgreSQL, one throwaway database per case)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { readdir, readFile } from 'fs/promises';
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

// Empty database, or one set up the old way: the given migrations run by hand, without bookkeeping
async function database(applyByHand: string[] = []) {
	const name = `dwello_migrate_${crypto.randomUUID().replace(/-/g, '')}`;
	await query('postgres', `CREATE DATABASE "${name}"`);
	databases.push(name);
	for (const file of applyByHand) await query(name, await readFile(join(migrations, file), 'utf8'));
	return name;
}

const files = (await readdir(migrations)).filter((file) => file.endsWith('.sql')).sort();
const upTo = (prefix: string) => files.filter((file) => file <= `${prefix}~`);

afterAll(async () => {
	for (const name of databases) await query('postgres', `DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
});

describe('Migrationen anwenden', () => {
	it('richtet eine leere Datenbank mit allen Migrationen ein und wiederholt nichts', async () => {
		const name = await database();

		expect(await migrate(`${server}/${name}`, migrations)).toEqual(files);
		expect(await migrate(`${server}/${name}`, migrations)).toEqual([]);
	});

	it('ergänzt bei einer von Hand migrierten Datenbank nur die fehlenden Migrationen', async () => {
		const name = await database(upTo('0004'));

		const applied = await migrate(`${server}/${name}`, migrations);

		// Whether 0004 ran cannot be told apart; it only corrects wrong totals, so it runs again
		expect(applied).toEqual(files.filter((file) => file > '0003~'));
		// The statement page reads the tenant's correspondence channel and the documents
		expect(await query(name, `SELECT to_regclass('documents') AS documents`)).toEqual([{ documents: 'documents' }]);
		// 0004 must not raise the corrected heating profiles a second time
		const totals = await query(
			name,
			`SELECT january_pct + february_pct + march_pct + april_pct + may_pct + june_pct + july_pct + august_pct
			  + september_pct + october_pct + november_pct + december_pct AS total FROM heating_profiles WHERE type = 'predefined'`
		);
		expect(totals.map((row) => Number(row.total))).toEqual(totals.map(() => 100));
	});

	it('entfernt bei einer von Hand bis 0006 migrierten Datenbank die Schlüssel pro Person und nach Verbrauch', async () => {
		const name = await database(upTo('0006'));

		expect(await migrate(`${server}/${name}`, migrations)).toEqual(files.filter((file) => file > '0006~'));
		const removed = await query(name, `SELECT name FROM distribution_keys WHERE name IN ('Per Person', 'By Consumption')`);
		expect(removed).toEqual([]);
	});

	it('ergänzt bei einer von Hand bis 0007 migrierten Datenbank den Zeitpunkt der PDF-Erstellung', async () => {
		const name = await database(upTo('0007'));

		expect(await migrate(`${server}/${name}`, migrations)).toEqual(files.filter((file) => file > '0007~'));
		const columns = await query(
			name,
			`SELECT column_name FROM information_schema.columns WHERE table_name = 'utility_statements' AND column_name = 'pdf_generated_at'`
		);
		expect(columns).toEqual([{ column_name: 'pdf_generated_at' }]);
	});

	it('ergänzt bei einer von Hand bis 0008 migrierten Datenbank den Grund für das Überschreiben der KI-Kategorie', async () => {
		const name = await database(upTo('0008'));

		expect(await migrate(`${server}/${name}`, migrations)).toEqual(files.filter((file) => file > '0008~'));
		const columns = await query(
			name,
			`SELECT column_name FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'manual_override_reason'`
		);
		expect(columns).toEqual([{ column_name: 'manual_override_reason' }]);
	});

	// Vor der Prüfung im Backend konnte eine Rechnung einer nicht umlagefähigen Kategorie umlagefähig gespeichert werden
	it('nimmt bei einer bis 0010 migrierten Datenbank Rechnungen nicht umlagefähiger Kategorien aus den umlagefähigen Kosten', async () => {
		const name = await database(upTo('0010'));
		const wronglyAllocable = `SELECT COUNT(*)::int AS invoices FROM invoices i JOIN categories c ON c.id = i.category_id
			WHERE NOT c.is_allowed_utility_cost AND i.is_valid_utility_cost`;
		await query(name, `UPDATE invoices SET is_valid_utility_cost = true`);
		expect((await query(name, wronglyAllocable))[0].invoices).toBeGreaterThan(0);

		expect(await migrate(`${server}/${name}`, migrations)).toEqual(files.filter((file) => file > '0010~'));
		expect(await query(name, wronglyAllocable)).toEqual([{ invoices: 0 }]);
	});

	it('erkennt eine von Hand vollständig migrierte Datenbank', async () => {
		const name = await database(files);

		// 0011 only corrects data and cannot be told apart, so it runs again (changing nothing)
		expect(await migrate(`${server}/${name}`, migrations)).toEqual(files.filter((file) => file > '0010~'));
	});
});
