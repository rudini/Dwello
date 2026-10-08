/**
 * Demo data for trying the app and showing it (bun run db:demo), never part of the migrations (real PostgreSQL)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { join } from 'path';
import pg from 'pg';

const server = 'postgresql://dwello:dwello@localhost:5432';
const name = `dwello_demo_${crypto.randomUUID().replace(/-/g, '')}`;
const script = join(import.meta.dir, '..', '..', 'scripts', 'demo-data.ts');

async function query(database: string, sql: string) {
	const client = new pg.Client({ connectionString: `${server}/${database}` });
	await client.connect();
	try {
		return (await client.query(sql)).rows;
	} finally {
		await client.end();
	}
}

// The command as `bun run db:demo` runs it, on its own database; its output tells why it failed
function loadDemoData() {
	const run = Bun.spawnSync(['bun', script], { env: { ...process.env, DATABASE_URL: `${server}/${name}` } });
	expect({ exitCode: run.exitCode, stderr: run.stderr.toString() }).toEqual({ exitCode: 0, stderr: '' });
}

// Loaded twice: the second run adds nothing
beforeAll(async () => {
	await query('postgres', `CREATE DATABASE "${name}"`);
	loadDemoData();
	loadDemoData();
});

afterAll(async () => {
	await query('postgres', `DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
});

describe('Demodaten', () => {
	it('legt Gebäude, Wohnungen, Mieter, Verträge, Rechnungen und Abrechnungen an, auch ein zweites Mal ohne Doppel', async () => {
		expect(
			await query(
				name,
				`SELECT (SELECT COUNT(*) FROM buildings)::int AS buildings, (SELECT COUNT(*) FROM apartments)::int AS apartments,
				(SELECT COUNT(*) FROM tenants)::int AS tenants, (SELECT COUNT(*) FROM rental_contracts)::int AS contracts,
				(SELECT COUNT(*) FROM invoices)::int AS invoices, (SELECT COUNT(*) FROM utility_statements)::int AS statements`
			)
		).toEqual([{ buildings: 3, apartments: 13, tenants: 9, contracts: 10, invoices: 14, statements: 3 }]);
	});

	// Wie eine echte Abrechnung: mit Positionen und PDF samt QR-Rechnung, in den Status, die die App kennt
	it('erstellt die Abrechnungen wie die App, mit Positionen und PDF', async () => {
		const statements = await query(
			name,
			`SELECT s.status, s.pdf_generated_at IS NOT NULL AS pdf, s.qr_bill_reference IS NOT NULL AS qr,
				(SELECT COUNT(*) FROM utility_statement_line_items l WHERE l.statement_id = s.id)::int > 0 AS items
			FROM utility_statements s ORDER BY s.status`
		);

		expect(statements).toEqual([
			{ status: 'draft', pdf: true, qr: true, items: true },
			{ status: 'paid', pdf: true, qr: true, items: true },
			{ status: 'sent', pdf: true, qr: true, items: true }
		]);
	});

	// Wie "Als bezahlt markieren" der App: nur das Datum; der Betrag zählte sonst im Dashboard als bezahlt
	it('markiert die bezahlte Abrechnung wie die App, mit Datum und ohne Betrag', async () => {
		const [paid] = await query(name, `SELECT paid_date IS NOT NULL AS dated, paid_amount FROM utility_statements WHERE status = 'paid'`);

		expect(paid).toEqual({ dated: true, paid_amount: null });
	});

	// Nur bei einer Nachzahlung trägt das PDF einen Einzahlungsschein
	it('zeigt eine Nachzahlung und eine Rückzahlung', async () => {
		const balances = await query(name, `SELECT balance::float > 0 AS owes FROM utility_statements`);

		expect(balances.map((row) => row.owes).sort()).toEqual([false, false, true]);
	});
});
