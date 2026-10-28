import { backendMessage } from '$lib/backend-error';
import { FRANCS } from '$lib/contract-form';
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
 * Payment received on the given day, today if none was given: checked against the end of the Abrechnungsperiode the
 * page sent (the backend checks it again, #138, #448), then stored in the database. Null when stored, otherwise what
 * to tell the user.
 */
export async function markStatementPaid(
	fetch: Fetch,
	id: string,
	paidDate = localToday(),
	periodEnd = ''
): Promise<Refusal | null> {
	const invalid = paidDateError(paidDate, periodEnd);
	if (invalid) return { status: 400, message: invalid };
	const response = await fetch(`${API}/${id}/status`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ status: 'paid', paidDate })
	});
	if (response.ok) return null;
	return { status: response.status, message: await refusalOf(response, m.statements_mark_paid_failed()) };
}

// A coded refusal in the UI language, never the backend's own text
async function refusalOf(response: Response, fallback: string) {
	const { code, params } = await response.json().catch(() => ({}));
	return backendMessage({ code, params }, fallback);
}

// The refusals of an e-mail that did not go out: the statement stays a draft and can go by letter instead (#86)
const UNDELIVERED = [
	'STATEMENT_TENANT_NO_EMAIL',
	'STATEMENT_MAIL_FAILED',
	'STATEMENT_MAIL_NOT_CONFIGURED'
];

/**
 * A draft sent: by e-mail to a tenant who wants e-mail, else (or by letter after a failed e-mail) recorded as sent.
 * Null when sent, otherwise what to tell the user and whether it may go by letter instead
 */
export async function sendStatement(
	fetch: Fetch,
	id: string,
	byLetter: boolean
): Promise<(Refusal & { undelivered: boolean }) | null> {
	const response = await fetch(`${API}/${id}/send`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(byLetter ? { byLetter } : {})
	});
	if (response.ok) return null;
	const { code, params } = await response.json().catch(() => ({}));
	const message = backendMessage({ code, params }, m.statements_send_failed());
	return { status: response.status, message, undelivered: UNDELIVERED.includes(code) };
}

/** A recorded payment taken back (#92); null when done, otherwise what to tell the user */
export async function resetStatementPayment(fetch: Fetch, id: string): Promise<Refusal | null> {
	const response = await fetch(`${API}/${id}/payment-reset`, { method: 'POST' });
	if (response.ok) return null;
	return { status: response.status, message: await refusalOf(response, m.statements_reset_payment_failed()) };
}

/** #506: an open Übertrag settled by hand; null when done, otherwise what to tell the user */
export async function settleCarryOver(fetch: Fetch, id: string): Promise<Refusal | null> {
	const response = await fetch(`${API}/${id}/carry-settled`, { method: 'POST' });
	if (response.ok) return null;
	return { status: response.status, message: await refusalOf(response, m.statements_carry_settle_failed()) };
}

/** The statement replaced by a berichtigte Abrechnung to come (#120); null when done, otherwise what to tell the user */
export async function replaceStatement(fetch: Fetch, id: string, paidAmount?: string): Promise<Refusal | null> {
	// «Bereits bezahlt» of a sent or overdue statement, in francs (#448)
	if (paidAmount !== undefined && !FRANCS.test(paidAmount.trim()))
		return { status: 400, message: m.backend_statement_paid_amount_invalid({ amount: paidAmount }) };
	const response = await fetch(
		`${API}/${id}/replace`,
		paidAmount === undefined
			? { method: 'POST' }
			: { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paidAmount: paidAmount.trim() }) }
	);
	if (response.ok) return null;
	return {
		status: response.status,
		message: await refusalOf(response, m.statements_correct_failed())
	};
}

/** A draft calculated again from the invoices as they are now (#338); null when done, otherwise what to tell the user */
export async function recalculateStatement(fetch: Fetch, id: string): Promise<Refusal | null> {
	const response = await fetch(`${API}/${id}/recalculation`, { method: 'POST' });
	if (response.ok) return null;
	return {
		status: response.status,
		message: await refusalOf(response, m.statements_recalculate_failed())
	};
}

/** «Nicht berichtigen» (#454): null, or what to tell the user */
export async function declineCorrection(fetch: Fetch, id: string): Promise<Refusal | null> {
	const response = await fetch(`${API}/${id}/decline-correction`, { method: 'POST' });
	if (response.ok) return null;
	return { status: response.status, message: await refusalOf(response, m.ui_action_failed()) };
}

/** The berichtigte Abrechnung of a replaced statement (#120): its id, or what to tell the user */
export async function correctStatement(fetch: Fetch, id: string): Promise<{ id: string } | Refusal> {
	const response = await fetch(`${API}/${id}/correction`, { method: 'POST' });
	if (response.ok) return { id: (await response.json()).id };
	return {
		status: response.status,
		message: await refusalOf(response, m.statements_create_correction_failed())
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
