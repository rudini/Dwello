import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { loadStatement } from '$lib/server/statement';
import { loadDocuments } from '$lib/server/documents';
import { markStatementPaid, sendStatementReminder } from '$lib/server/statement-actions';
import type { StatementDocument } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// "Ahornweg 3, 8400 Winterthur": the statement carries no address, the tenant does
async function tenantAddress(fetch: typeof globalThis.fetch, tenantId: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/tenants/${tenantId}`).catch(() => null);
	if (!response?.ok) return '';
	const { address, postalCode, city } = await response.json();
	return [address, [postalCode, city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	const statement = await loadStatement(fetch, params.id);
	const [address, reminders] = await Promise.all([
		tenantAddress(fetch, statement.tenantId),
		loadDocuments(fetch, `statementId=${params.id}`)
	]);
	return { statement: { ...statement, tenantAddress: address }, reminders };
};

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
