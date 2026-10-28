/**
 * Removes the Wiederherstellungscodes and runs of an E2E database (#718): the API has no way to undo a confirmed code,
 * and each scenario of the fresh installation starts with the Sicherung not yet set up
 */

import { onE2eDatabase } from './e2e-client';

await onE2eDatabase(async (client) => {
	await client.query('DELETE FROM backup_runs');
	await client.query('DELETE FROM backup_codes');
});
