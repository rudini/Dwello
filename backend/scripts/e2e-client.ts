/**
 * Runs SQL on the E2E database only, for test data the backend API cannot make (the scripts e2e-*.ts)
 */

import pg from 'pg';

export async function onE2eDatabase(run: (client: pg.Client) => Promise<unknown>) {
	const url = process.env.DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello_e2e';
	if (!new URL(url).pathname.startsWith('/dwello_e2e')) throw new Error(`Not an E2E database: ${url}`);
	const client = new pg.Client({ connectionString: url });
	await client.connect();
	try {
		await run(client);
	} finally {
		await client.end();
	}
}
