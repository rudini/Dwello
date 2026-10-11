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
}, 60_000); // two loads take some seconds

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
		).toEqual([{ buildings: 3, apartments: 13, tenants: 10, contracts: 11, invoices: 83, statements: 17 }]);
	});

	// Wie eine echte Abrechnung: mit Positionen und PDF samt QR-Rechnung, in den Status, die die App kennt
	it('erstellt die Abrechnungen wie die App, mit Positionen und PDF', async () => {
		const statements = await query(
			name,
			`SELECT s.status, s.pdf_generated_at IS NOT NULL AS pdf, s.qr_bill_reference IS NOT NULL AS qr,
				(SELECT COUNT(*) FROM utility_statement_line_items l WHERE l.statement_id = s.id)::int > 0 AS items
			FROM utility_statements s ORDER BY s.status`
		);

		expect(statements.every((s) => s.pdf && s.qr && s.items)).toBe(true);
		const count = (status: string) => statements.filter((s) => s.status === status).length;
		// 2024 abgeschlossen; 2025 für Musterhaus (eine versendet) und Seepark erstellt
		expect({ paid: count('paid'), sent: count('sent'), draft: count('draft') }).toEqual({ paid: 9, sent: 1, draft: 7 });
	});

	// Wie "Als bezahlt markieren" der App: nur das Datum; der Betrag zählte sonst im Dashboard als bezahlt
	it('markiert die bezahlte Abrechnung wie die App, mit Datum und ohne Betrag', async () => {
		const paid = await query(name, `SELECT paid_date IS NOT NULL AS dated, paid_amount FROM utility_statements WHERE status = 'paid'`);

		expect(paid).toEqual(Array(9).fill({ dated: true, paid_amount: null }));
	});

	// Nur bei einer Nachzahlung trägt das PDF einen Einzahlungsschein
	it('zeigt eine Nachzahlung und eine Rückzahlung', async () => {
		const balances = await query(name, `SELECT balance::float > 0 AS owes FROM utility_statements`);

		expect(new Set(balances.map((row) => row.owes))).toEqual(new Set([true, false]));
	});

	// Eine Abrechnung entsteht nach dem Ende ihrer Periode, mit 30 Tagen Zahlungsfrist
	it('datiert die Abrechnungen nach dem Ende ihrer Abrechnungsperiode', async () => {
		const rows = await query(
			name,
			`SELECT bool_and(statement_date > period_end) AS after, bool_and(payment_deadline = statement_date + 30) AS deadline FROM utility_statements`
		);

		expect(rows).toEqual([{ after: true, deadline: true }]);
	});

	// Wie damals versendet und bezahlt: das Datum hängt nicht vom Tag ab, an dem die Demodaten geladen werden
	it('behält das Datum der versendeten und bezahlten Abrechnungen', async () => {
		const rows = await query(
			name,
			`SELECT status, statement_date::text AS date, bool_and(paid_date IS NULL OR paid_date > statement_date) AS paid_after
			FROM utility_statements WHERE status <> 'draft' GROUP BY 1, 2 ORDER BY 1`
		);

		expect(rows).toEqual([
			{ status: 'paid', date: '2025-04-14', paid_after: true },
			{ status: 'sent', date: '2026-09-28', paid_after: true }
		]);
	});

	// Ohne Adresse fehlte im PDF und auf der QR-Rechnung der Empfänger
	it('gibt jedem Mieter eine Postadresse', async () => {
		const [row] = await query(name, `SELECT COUNT(*)::int AS missing FROM tenants WHERE address IS NULL OR postal_code IS NULL OR city IS NULL`);

		expect(row).toEqual({ missing: 0 });
	});

	// Ein Abrechnungslauf erstellt die Abrechnungen aller Mietverträge eines Gebäudes in der Periode
	it('erstellt pro Gebäude und Jahr die Abrechnungen aller Mietverträge', async () => {
		const rows = await query(
			name,
			`SELECT a.building_id, s.period_start::text AS period, COUNT(*)::int AS statements FROM utility_statements s
			JOIN apartments a ON a.id = s.apartment_id GROUP BY 1, 2 ORDER BY 1, 2`
		);

		expect(rows.map((row) => `${row.building_id.slice(0, 2)} ${row.period} ${row.statements}`)).toEqual([
			'11 2024-01-01 4',
			'11 2025-01-01 4',
			'22 2024-01-01 3',
			'22 2025-01-01 4',
			'33 2024-01-01 2'
		]);
	});

	// Bei einem Mieterwechsel erhält jeder Mietvertrag eine eigene Abrechnung über seine Mietstage
	it('rechnet den Mieterwechsel in Seepark A2 mit zwei Abrechnungen ab', async () => {
		const rows = await query(
			name,
			`SELECT t.last_name, s.rental_days FROM utility_statements s JOIN tenants t ON t.id = s.tenant_id
			WHERE s.apartment_id = 'aaaa2222-2222-2222-2222-222222222222' AND s.period_start = '2025-01-01' ORDER BY s.rental_days`
		);

		expect(rows).toEqual([
			{ last_name: 'Meier', rental_days: 181 },
			{ last_name: 'Brunner', rental_days: 184 }
		]);
	});
});
