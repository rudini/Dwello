import { backendMessage } from '$lib/backend-error';
import { localToday } from '$lib/contract-status';
import { m } from '$lib/paraglide/messages';
import { localTitle } from '$lib/server/documents';
import { paidDateError } from '$lib/statement';
import type { StatementDocument } from '$lib/types';
const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/statements`;

type Fetch = typeof globalThis.fetch;

/** Why an action was refused, in the UI language, with the status to answer with */
type Refusal = { status: number; message: string };

/**
 * Payment received on the given day, today if none was given: checked, then stored in the database.
 * Null when stored, otherwise what to tell the user.
 */
export async function markStatementPaid(
	fetch: Fetch,
	id: string,
	paidDate = localToday()
): Promise<Refusal | null> {
	const invalid = paidDateError(paidDate);
	if (invalid) return { status: 400, message: invalid };
	const response = await fetch(`${API}/${id}/status`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ status: 'paid', paidDate })
	});
	if (response.ok) return null;
	return {
		status: response.status,
		message: m.statements_mark_paid_failed()
	};
}

type Reminder = { document: StatementDocument; deliveryError?: string };

/** Next reminder (1 to 3), stored as document and sent by e-mail or kept for the letter post */
export async function sendStatementReminder(
	fetch: Fetch,
	id: string
): Promise<{ status: number; reminder: Reminder } | { status: number; error: string }> {
	const response = await fetch(`${API}/${id}/reminders`, { method: 'POST' });
	const result = await response.json();
	if (response.ok) {
		// the backend stores the title in the tenant's language; its level names it in the UI language
		const { document } = result;
		const reminder = document
			? { ...result, document: { ...document, title: localTitle(document) } }
			: result;
		return { status: response.status, reminder };
	}
	return {
		status: response.status,
		error: backendMessage(result, m.statements_reminder_failed())
	};
}
