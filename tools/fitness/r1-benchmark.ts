// R1 / A2 (docs/architecture/utility-tree.md, #974): the Sicherung and the restore of a database as an installation
// holds it after 10 years, through tools/fitness/restore-check.ts (which fails above 5 minutes).
// bun run fitness:r1 [-- --belege <per building and year> --beleg-kb <size> --pdf-kb <size of a sent statement PDF>]
// Defaults lean to the worst case: random file content, which neither the database nor the Sicherung can compress.
// PostgreSQL on localhost:5432, user and password dwello; the databases dwello_r1 and dwello_restore are recreated.
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdtempSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const { values: opts } = parseArgs({
	options: {
		belege: { type: 'string', default: '40' },
		'beleg-kb': { type: 'string', default: '400' },
		'pdf-kb': { type: 'string', default: '150' }
	}
});
const belege = Number(opts.belege);
const [belegBytes, pdfBytes] = [Number(opts['beleg-kb']) * 1024, Number(opts['pdf-kb']) * 1024];
const YEARS = Array.from({ length: 10 }, (_, i) => 2016 + i);
const BUILDINGS = 5;
const APARTMENTS = 10;

const server = 'postgresql://dwello:dwello@localhost:5432';
const url = `${server}/dwello_r1`;
process.env.DATABASE_URL = url;
const backend = fileURLToPath(new URL('../../backend', import.meta.url));
execFileSync('psql', [`${server}/postgres`, '-qc', 'DROP DATABASE IF EXISTS dwello_r1 WITH (FORCE)', '-c', 'CREATE DATABASE dwello_r1']);

const { migrate } = await import(join(backend, 'src/db/migrate.ts'));
await migrate(url, join(backend, 'migrations'));
const { pool } = await import(join(backend, 'src/db/connection.ts'));
const { createBuilding } = await import(join(backend, 'src/services/building.service.ts'));
const { createApartment } = await import(join(backend, 'src/services/apartment.service.ts'));
const { createTenant } = await import(join(backend, 'src/services/tenant.service.ts'));
const { createContract } = await import(join(backend, 'src/services/contract.service.ts'));

/** A file of the given size as the database stores it (Base64 of random bytes) */
const file = (bytes: number) => randomBytes(bytes).toString('base64');
const started = Date.now();

const { rows: categories } = await pool.query('SELECT id FROM categories WHERE is_allowed_utility_cost ORDER BY name');
const { rows: keys } = await pool.query('SELECT id FROM distribution_keys ORDER BY name LIMIT 1');
for (let b = 0; b < BUILDINGS; b++) {
	const building = await createBuilding({ name: `R1 ${b + 1}`, address: `Testweg ${b + 1}`, postalCode: '8400', city: 'Winterthur', canton: 'ZH' });
	for (let a = 0; a < APARTMENTS; a++) {
		const apartment = await createApartment({ buildingId: building.id, number: `${a + 1}.01`, floor: a, area: String(60 + a * 5), rooms: '3.5' });
		// long names: restore-check.ts looks for one in the encrypted Sicherung, where «0-0» turns up by chance in a GB
		// a tenant from 2016, every second one replaced by a new tenant in 2021: 75 contracts
		const terms = { apartmentId: apartment.id, baseRent: '1500', monthlyAdvancePayment: '200' };
		const moves = a % 2 === 0;
		const tenants = [{ tenant: await createTenant({ firstName: 'Mieter', lastName: `Benchmark-${b}-${a}` }), years: moves ? YEARS.slice(0, 5) : YEARS }];
		await createContract({ ...terms, tenantId: tenants[0].tenant.id, startDate: '2016-01-01', ...(moves && { endDate: '2020-12-31' }) });
		if (moves) {
			const next = await createTenant({ firstName: 'Nachmieter', lastName: `Benchmark-${b}-${a}` });
			await createContract({ ...terms, tenantId: next.id, startDate: '2021-01-01' });
			tenants.push({ tenant: next, years: YEARS.slice(5) });
		}
		// the statement PDF sent each year (#449 keeps it), as the tenant's documents
		for (const { tenant, years } of tenants)
			for (const year of years)
				await pool.query(
					`INSERT INTO documents (tenant_id, type, title, file_name, content) VALUES ($1, 'upload', $2, $3, $4)`,
					[tenant.id, `Abrechnung ${year}`, `abrechnung-${year}.pdf`, file(pdfBytes)]
				);
	}
	for (const year of YEARS)
		for (let i = 0; i < belege; i++) {
			const { rows } = await pool.query(
				`INSERT INTO invoices (building_id, category_id, distribution_key_id, billing_entity_name, description, amount, invoice_date, is_valid_utility_cost)
				 VALUES ($1, $2, $3, 'R1 AG', $4, $5, $6, true) RETURNING id`,
				[building.id, categories[i % categories.length].id, keys[0].id, `Rechnung ${year}-${i + 1}`, String(100 + i), `${year}-${String((i % 12) + 1).padStart(2, '0')}-15`]
			);
			await pool.query(`INSERT INTO invoice_documents (invoice_id, file_name, mime_type, content) VALUES ($1, 'beleg.pdf', 'application/pdf', $2)`, [rows[0].id, file(belegBytes)]);
		}
}
const { rows: [size] } = await pool.query(`SELECT pg_size_pretty(pg_database_size('dwello_r1')) AS db, (SELECT count(*) FROM invoice_documents) AS belege, (SELECT count(*) FROM documents) AS pdfs`);
await pool.end();
console.log(`Data: ${size.belege} Belege of ${opts['beleg-kb']} KB, ${size.pdfs} statement PDFs of ${opts['pdf-kb']} KB, database ${size.db} (${Math.round((Date.now() - started) / 1000)} s)`);

// the Sicherung with this checkout's backend, then the restore into an empty database (restore-check.ts measures it)
const dir = mkdtempSync(join(tmpdir(), 'r1-benchmark-'));
const env = { ...process.env, DATABASE_URL: url, RESTORE_CHECK_DIR: dir };
const check = fileURLToPath(new URL('restore-check.ts', import.meta.url));
const backupStart = Date.now();
execFileSync('bun', [check, 'backup', backend], { env, stdio: 'inherit' });
const backup = readdirSync(dir).find((name) => name.endsWith('.backup'))!;
console.log(`Sicherung: ${Math.round(statSync(join(dir, backup)).size / 1024 / 1024)} MB in ${Math.round((Date.now() - backupStart) / 1000)} s`);
execFileSync('bun', [check, 'restore'], { env, stdio: 'inherit' });
