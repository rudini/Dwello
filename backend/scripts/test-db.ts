/**
 * Preload of the PostgreSQL tests (bun run test:pg): recreates the test database from the migrations and points the
 * tests at it, so they never write into the development database. TEST_DATABASE_URL overrides the default.
 */

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello_test';
await import('./e2e-db');
