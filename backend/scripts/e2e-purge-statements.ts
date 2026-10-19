/**
 * Deletes the statements (with their documents) of the tenants whose name contains one of the given tokens, in the E2E
 * database only: the backend deletes drafts only, so a scenario's sent statement would keep its tenant, apartment and
 * building, and the wizard's lists grow with every scenario (O-38)
 */

import pg from 'pg';

const url = process.env.DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello_e2e';
if (!new URL(url).pathname.startsWith('/dwello_e2e')) throw new Error(`Not an E2E database: ${url}`);

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
	const patterns = process.argv.slice(2).map((token) => `%${token}%`);
	const statements = `SELECT s.id FROM utility_statements s JOIN tenants t ON t.id = s.tenant_id
		WHERE t.first_name || ' ' || t.last_name LIKE ANY($1)`;
	await client.query(`DELETE FROM documents WHERE statement_id IN (${statements})`, [patterns]);
	await client.query(`DELETE FROM utility_statements WHERE id IN (${statements})`, [patterns]);
} finally {
	await client.end();
}
