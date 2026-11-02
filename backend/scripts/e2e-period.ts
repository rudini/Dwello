/**
 * #1036: sets the Abrechnungsperiode of an E2E database without a stored change (#512), or back to the default without
 * a type: the API stores the change of every save, so a scenario could not start from a setting of its own
 */

import { onE2eDatabase } from './e2e-client';

await onE2eDatabase(async (client) => {
	await client.query(`DELETE FROM configuration WHERE key IN ('accounting_period', 'accounting_period_changed')`);
	if (process.argv[2]) await client.query(`INSERT INTO configuration (key, value) VALUES ('accounting_period', $1)`, [process.argv[2]]);
});
