import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { loadStatement } from '$lib/server/statement';
import { loadDocuments } from '$lib/server/documents';
import {
	correctStatement,
	markStatementPaid,
	replaceStatement,
	resetStatementPayment,
	sendStatement,
	sendStatementReminder
} from '$lib/server/statement-actions';
import { countryName } from '$lib/tenant';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// "Ahornweg 3, 8400 Winterthur": the statement carries no address, the tenant does; abroad with its country (#102)
async function tenantAddress(fetch: typeof globalThis.fetch, tenantId: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/tenants/${tenantId}`).catch(() => null);
	if (!response?.ok) return '';
	const { address, postalCode, city, country } = await response.json();
	const abroad = country && country !== 'CH' && countryName(country);
	return [address, [postalCode, city].filter(Boolean).join(' '), abroad].filter(Boolean).join(', ');
}

// The invoices of its period recorded, changed or deleted since the statement was created (#96; only a hint: 0 if
// they cannot be loaded)
async function laterInvoices(fetch: typeof globalThis.fetch, id: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/statements/${id}/changed-invoices`).catch(() => null);
	const changed: { invoiceIds?: string[] } = response?.ok ? await response.json() : {};
	return changed.invoiceIds?.length ?? 0;
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	const statement = await loadStatement(fetch, params.id);
	const [address, documents, later] = await Promise.all([
		tenantAddress(fetch, statement.tenantId),
		loadDocuments(fetch, `statementId=${params.id}`),
		laterInvoices(fetch, params.id)
	]);
	// the statement's own Dokument (sent by e-mail, #86) is no Mahnung: the next Mahnstufe counts these
	return {
		statement: { ...statement, tenantAddress: address },
		reminders: documents.filter((document) => document.type === 'reminder'),
		laterInvoices: later
	};
};

export const actions: Actions = {
	send: async ({ params, fetch, request }) => {
		const byLetter = (await request.formData()).get('byLetter') === 'true';
		const refused = await sendStatement(fetch, params.id, byLetter);
		if (refused)
			return fail(
				refused.status,
				refused.undelivered ? { sendError: refused.message } : { actionError: refused.message }
			);
	},
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
	replace: async ({ params, fetch }) => {
		const refused = await replaceStatement(fetch, params.id);
		if (refused) return fail(refused.status, { actionError: refused.message });
	},
	correct: async ({ params, fetch }) => {
		const result = await correctStatement(fetch, params.id);
		if ('message' in result) return fail(result.status, { actionError: result.message });
		throw redirect(303, `/statements/${result.id}`);
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
