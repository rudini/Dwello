import { localToday } from '$lib/contract-status';
export { paidDateError } from '$lib/statement';
const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/statements`;

type Fetch = typeof globalThis.fetch;

const json = { 'Content-Type': 'application/json' };

/** Payment received on the given day, today if none was given; stored in the database */
export const markStatementPaid = (fetch: Fetch, id: string, paidDate = localToday()) =>
	fetch(`${API}/${id}/status`, {
		method: 'PUT',
		headers: json,
		body: JSON.stringify({ status: 'paid', paidDate })
	});

/** Next reminder (1 to 3), stored as document and sent by e-mail or kept for the letter post */
export const sendStatementReminder = (fetch: Fetch, id: string) =>
	fetch(`${API}/${id}/reminders`, { method: 'POST' });
