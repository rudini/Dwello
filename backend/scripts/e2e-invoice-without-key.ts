/**
 * Removes the Verteilschlüssel of the given invoices, in the E2E database only: the backend refuses an invoice without
 * one (#379), but invoices recorded before keep theirs empty, and scenarios need such old invoices
 */

import { onE2eDatabase } from './e2e-client';

await onE2eDatabase((client) =>
	client.query('UPDATE invoices SET distribution_key_id = NULL WHERE id = ANY($1)', [process.argv.slice(2)])
);
