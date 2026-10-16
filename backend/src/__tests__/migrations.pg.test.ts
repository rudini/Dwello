/**
 * Applying the SQL migrations to a database (real PostgreSQL, one throwaway database per case)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { cp, mkdtemp, readdir, rm } from 'fs/promises';
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

	// Die Beschreibungen gehen in jeden KI-Prompt; eine vom Vermieter geänderte bleibt (#204, #220)
	it('ergänzt die Beschreibungen vordefinierter Kategorien nur, wo noch der gelieferte Text steht', async () => {
		const name = await database();
		const before = await mkdtemp(join(tmpdir(), 'dwello-migrations-'));
		try {
			await cp(migrations, before, { recursive: true, filter: (file) => !file.endsWith('0007_category_descriptions.sql') });
			await migrate(`${server}/${name}`, before);
		} finally {
			await rm(before, { recursive: true });
		}
		await query(name, `UPDATE categories SET description = 'Unser Gärtner Huber' WHERE name = 'Garden Maintenance'`);

		await migrate(`${server}/${name}`, migrations);

		const rows = await query(
			name,
			`SELECT name, description FROM categories WHERE name IN ('Heating', 'Garden Maintenance', 'Waste Disposal', 'TV/Cable', 'Building Insurance', 'Administration', 'Elevator') ORDER BY sort_order`
		);
		expect(rows).toEqual([
			{ name: 'Heating', description: 'Brennstoff, Energie, Wartung und Betrieb der Heizung, auch Versicherung nur der Heizungsanlage und Verwaltungsarbeit für den Heizbetrieb; ohne Reparatur, Erneuerung, Verzinsung und Abschreibung der Anlage' },
			{ name: 'Elevator', description: 'Strom, Notruftelefon und reine Wartung des Lifts; ohne Reparaturen, Ersatzteile und Serviceabos mit Reparaturen' },
			{ name: 'Garden Maintenance', description: 'Unser Gärtner Huber' },
			{ name: 'Waste Disposal', description: 'Kehrichtgebühren und Grünabfuhr; ohne Räumungen, die der Vermieter bestellt' },
			{ name: 'TV/Cable', description: 'Laufende Grundgebühr des Kabelnetzes; ohne Installation des Anschlusses' },
			{ name: 'Building Insurance', description: 'Prämien der Gebäudeversicherung; ohne Prämien, die nur die Heizungsanlage versichern (gehören zur Heizung)' },
			{ name: 'Administration', description: 'Allgemeine Verwaltungskosten; ohne Verwaltungsarbeit für den Heizbetrieb, z. B. Brennstoff bestellen (gehört zur Heizung), und ohne Verwaltungspauschale' }
		]);
	});
});
