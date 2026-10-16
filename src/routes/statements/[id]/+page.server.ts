import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { loadStatement } from '$lib/server/statement';
import { loadDocuments } from '$lib/server/documents';
import {
	markStatementPaid,
	resetStatementPayment,
	sendStatementReminder
} from '$lib/server/statement-actions';
import { countryName } from '$lib/tenant';
import type { StatementWithDetails } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// "Ahornweg 3, 8400 Winterthur": the statement carries no address, the tenant does; abroad with its country (#102)
async function tenantAddress(fetch: typeof globalThis.fetch, tenantId: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/tenants/${tenantId}`).catch(() => null);
	if (!response?.ok) return '';
	const { address, postalCode, city, country } = await response.json();
	const abroad = country && country !== 'CH' && countryName(country);
	return [address, [postalCode, city].filter(Boolean).join(' '), abroad].filter(Boolean).join(', ');
}

// A statement lacks the invoices of its period recorded after it was created (only a hint: 0 if they cannot be loaded)
async function laterInvoices(fetch: typeof globalThis.fetch, statement: StatementWithDetails) {
	const { buildingId, periodStart, periodEnd, createdAt } = statement;
	const response = await fetch(
		`${BACKEND_URL}/api/v1/invoices/for-statement/${buildingId}?periodStart=${periodStart}&periodEnd=${periodEnd}`
	).catch(() => null);
	const invoices: { createdAt: string }[] = response?.ok ? await response.json() : [];
	return invoices.filter((invoice) => invoice.createdAt > String(createdAt)).length;
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	const statement = await loadStatement(fetch, params.id);
	const [address, reminders, later] = await Promise.all([
		tenantAddress(fetch, statement.tenantId),
		loadDocuments(fetch, `statementId=${params.id}`),
		laterInvoices(fetch, statement)
	]);
	return { statement: { ...statement, tenantAddress: address }, reminders, laterInvoices: later };
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
		changeStatus(fetch, params.id, { status: 'sent' }, m.statements_send_failed()),
	markPaid: async ({ params, fetch, request }) => {
		// none sent (no dialog field, no JavaScript): today; sent but empty (an invalid date): refused
		const form = await request.formData();
		const sent = form.get('paidDate');
		const refused = await markStatementPaid(
			fetch,
			params.id,
			sent === null ? undefined : String(sent),
			String(form.get('statementDate') ?? '')
		);
		if (refused) return fail(refused.status, { actionError: refused.message });
	},
	resetPayment: async ({ params, fetch }) => {
		const refused = await resetStatementPayment(fetch, params.id);
		if (refused) return fail(refused.status, { actionError: refused.message });
	},
	remind: async ({ params, fetch }) => {
		const result = await sendStatementReminder(fetch, params.id);
		if ('error' in result) return fail(result.status, { actionError: result.error });
		return { reminder: result.reminder };
	},
	delete: async ({ params, fetch }) => {
		const response = await fetch(`${BACKEND_URL}/api/v1/statements/${params.id}`, {
			method: 'DELETE'
		});
		if (!response.ok) return fail(response.status, { actionError: m.statements_delete_failed() });
		throw redirect(303, '/statements');
	}
};
