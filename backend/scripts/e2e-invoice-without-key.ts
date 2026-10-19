/**
 * Removes the Verteilschlüssel of the given invoices, in the E2E database only: the backend refuses an invoice without
 * one (#379), but invoices recorded before keep theirs empty, and scenarios need such old invoices
 */

import pg from 'pg';

const url = process.env.DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello_e2e';
if (!new URL(url).pathname.startsWith('/dwello_e2e')) throw new Error(`Not an E2E database: ${url}`);

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
	await client.query('UPDATE invoices SET distribution_key_id = NULL WHERE id = ANY($1)', [process.argv.slice(2)]);
} finally {
	await client.end();
}
