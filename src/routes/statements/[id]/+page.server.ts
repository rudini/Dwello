import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { loadStatement } from '$lib/server/statement';
import { loadDocuments } from '$lib/server/documents';
import { markStatementPaid, sendStatementReminder } from '$lib/server/statement-actions';
import type { StatementDocument } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ params, fetch }) => ({
	statement: await loadStatement(fetch, params.id),
	reminders: await loadDocuments(fetch, `statementId=${params.id}`)
});

type Fetch = typeof globalThis.fetch;

const changeStatus = async (fetch: Fetch, id: string, body: object, failure: string) => {
	const response = await fetch(`${BACKEND_URL}/api/v1/statements/${id}/status`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!response.ok) return fail(response.status, { actionError: failure });
};

export const actions: Actions = {
	send: ({ params, fetch }) =>
		changeStatus(fetch, params.id, { status: 'sent' }, 'Abrechnung konnte nicht versendet werden.'),
	markPaid: async ({ params, fetch }) => {
		const response = await markStatementPaid(fetch, params.id);
		if (!response.ok) {
			return fail(response.status, {
				actionError: 'Abrechnung konnte nicht als bezahlt markiert werden.'
			});
		}
	},
	remind: async ({ params, fetch }) => {
		const response = await sendStatementReminder(fetch, params.id);
		const result = await response.json();
		if (!response.ok) {
			return fail(response.status, {
				actionError: result.error ?? 'Mahnung konnte nicht erstellt werden.'
			});
		}
		return { reminder: result as { document: StatementDocument; deliveryError?: string } };
	},
	delete: async ({ params, fetch }) => {
		const response = await fetch(`${BACKEND_URL}/api/v1/statements/${params.id}`, {
			method: 'DELETE'
		});
		if (!response.ok)
			return fail(response.status, { actionError: 'Abrechnung konnte nicht gelöscht werden.' });
		throw redirect(303, '/statements');
	}
};
