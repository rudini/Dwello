/**
 * Removes the Wiederherstellungscodes and runs of an E2E database (#718): the API has no way to undo a confirmed code,
 * and each scenario of the fresh installation starts with the Sicherung not yet set up. With `stale`, a code confirmed
 * two days ago whose key cannot encrypt: every Sicherung fails, so the schedule cannot end the state mid-scenario.
 */

import { onE2eDatabase } from './e2e-client';

await onE2eDatabase(async (client) => {
	await client.query('DELETE FROM backup_runs');
	await client.query('DELETE FROM backup_codes');
	if (process.argv[2] === 'stale')
		await client.query(
			`INSERT INTO backup_codes (public_key, salt, confirmed_at, created_at) VALUES ('', '', now() - interval '2 days', now() - interval '2 days')`
		);
});
