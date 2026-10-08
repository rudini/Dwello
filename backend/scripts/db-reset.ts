/**
 * Drops and recreates the development database in DATABASE_URL from the migrations (bun run db:reset).
 * Only a database on this machine: never a remote one, such as production.
 */

const url = new URL(process.env.DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello');
if (!['localhost', '127.0.0.1'].includes(url.hostname)) {
	console.error(`${url.hostname} ist nicht dieser Rechner: db:reset setzt nur eine lokale Datenbank neu auf.`);
	process.exit(1);
}
process.env.DATABASE_URL = url.href;
await import('./e2e-db');
