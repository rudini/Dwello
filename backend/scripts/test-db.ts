/**
 * Preload of the backend tests (bun run test, bun run test:pg): recreates the test database from the migrations and points the
 * tests at it, so they never write into the development database. TEST_DATABASE_URL overrides the default.
 */

import pg from 'pg';

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello_test';
await import('./e2e-db');

// An installed Dwello has the Firmenadresse an IBAN needs (#450); a test that needs it missing removes it itself
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query(
	`INSERT INTO configuration (key, value) VALUES ('company_name', 'Muster Immobilien AG'), ('company_postal_code', '8001'), ('company_city', 'Zürich')`
);
await client.end();
