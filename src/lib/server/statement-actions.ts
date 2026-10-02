const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/statements`;

type Fetch = typeof globalThis.fetch;

const json = { 'Content-Type': 'application/json' };

/** Payment received today; stored in the database */
export const markStatementPaid = (fetch: Fetch, id: string) =>
	fetch(`${API}/${id}/status`, {
		method: 'PUT',
		headers: json,
		body: JSON.stringify({ status: 'paid', paidDate: new Date().toISOString().split('T')[0] })
	});

/** Next reminder (1 to 3), stored as document and sent by e-mail or kept for the letter post */
export const sendStatementReminder = (fetch: Fetch, id: string) =>
	fetch(`${API}/${id}/reminders`, { method: 'POST' });
