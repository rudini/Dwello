/**
 * #746: Protokoll entries of the year 2001, in the E2E database only: `add <name> <count>` writes the entry «Zugangsschlüssel
 * «<name>» erstellt» on 1 January and <count> newer ones («<name> 1» …) after it, so the named one is older than a page;
 * `remove <name>` deletes them again (the backend API records only entries of now)
 */

import { onE2eDatabase } from './e2e-client';

const [action, name, count = '0'] = process.argv.slice(2);
await onE2eDatabase(async (client) => {
	if (action === 'remove') {
		await client.query(`DELETE FROM audit_log WHERE action = 'access_key_created' AND details->>'name' LIKE $1`, [`${name}%`]);
		return;
	}
	await client.query(
		`INSERT INTO audit_log (occurred_at, action, details)
		SELECT timestamptz '2001-01-01 12:00+01' + make_interval(hours => n), 'access_key_created',
			jsonb_build_object('name', CASE WHEN n = 0 THEN $1 ELSE $1 || ' ' || n END)
		FROM generate_series(0, $2::int) AS n`,
		[name, count]
	);
});
