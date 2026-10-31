/**
 * Moves the sending of a statement the given number of days back, in the E2E database only: its Abrechnungsdatum,
 * Zahlungsfrist and the Dokument of its sending, as if it had gone out then (#534: a later redelivery dates it anew)
 */

import { onE2eDatabase } from './e2e-client';

const [statementId, days] = process.argv.slice(2);
await onE2eDatabase(async (client) => {
	await client.query(
		'UPDATE utility_statements SET statement_date = statement_date - $2::int, payment_deadline = payment_deadline - $2::int WHERE id = $1',
		[statementId, days]
	);
	await client.query(
		"UPDATE documents SET sent_at = sent_at - make_interval(days => $2::int) WHERE statement_id = $1 AND type = 'statement'",
		[statementId, days]
	);
});
