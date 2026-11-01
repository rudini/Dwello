import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { laterChanges, loadStatement } from '$lib/server/statement';
import { loadDocuments } from '$lib/server/documents';
import {
	correctStatement,
	declineCorrection,
	markStatementPaid,
	markNewPdfSent,
	recalculateStatement,
	redeliverStatement,
	replaceStatement,
	resetStatementPayment,
	settleCarryOver,
	sendStatement,
	sendStatementReminder
} from '$lib/server/statement-actions';
import { countryName } from '$lib/tenant';
import { localPath } from '$lib/invoice';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// "Ahornweg 3, 8400 Winterthur": the statement carries no address, the tenant does; abroad with its country (#102)
async function tenantAddress(fetch: typeof globalThis.fetch, tenantId: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/tenants/${tenantId}`).catch(() => null);
	if (!response?.ok) return '';
	const { address, postalCode, city, country } = await response.json();
	const abroad = country && country !== 'CH' && countryName(country);
	return [address, [postalCode, city].filter(Boolean).join(' '), abroad].filter(Boolean).join(', ');
}

export const load: PageServerLoad = async ({ params, fetch, url }) => {
	const statement = await loadStatement(fetch, params.id);
	const [address, documents, later] = await Promise.all([
		tenantAddress(fetch, statement.tenantId),
		loadDocuments(fetch, `statementId=${params.id}`),
		laterChanges(fetch, params.id)
	]);
	// the statement's own Dokument (sent by e-mail, #86) is no Mahnung: the next Mahnstufe counts these
	return {
		statement: { ...statement, tenantAddress: address },
		reminders: documents.filter((document) => document.type === 'reminder'),
		// how the statement went out: its own Dokument, by e-mail or by letter (#449, decided in #404, point 7)
		delivery: documents
			.filter((document) => document.type === 'statement')
			.map(({ id, channel, recipient, sentAt }) => ({ id, channel, recipient: recipient ?? null, sentAt }))
			.at(-1) ?? null, // the first: the list is newest first, later sendings are `resent` (#534)
		// set by the edit page after a change the sent PDF does not show (#524)
		pdfChange: url.searchParams.get('pdf-change'),
		later
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
			String(form.get('periodEnd') ?? ''),
			form.get('paidAmount')?.toString().trim() // empty: refused, not all of it (code review 959b-1 C-9)
		);
		if (refused) return fail(refused.status, { actionError: refused.message });
	},
	resetPayment: async ({ params, fetch }) => {
		const refused = await resetStatementPayment(fetch, params.id);
		if (refused) return fail(refused.status, { actionError: refused.message });
	},
	settleCarry: async ({ params, fetch }) => {
		const refused = await settleCarryOver(fetch, params.id);
		if (refused) return fail(refused.status, { actionError: refused.message });
	},
	replace: async ({ params, fetch, request }) => {
		const paid = (await request.formData()).get('paidAmount');
		const refused = await replaceStatement(fetch, params.id, paid === null ? undefined : String(paid));
		if (refused) return fail(refused.status, { actionError: refused.message });
	},
	correct: async ({ params, fetch }) => {
		const result = await correctStatement(fetch, params.id);
		if ('message' in result) return fail(result.status, { actionError: result.message });
		throw redirect(303, `/statements/${result.id}`);
	},
	redeliver: async ({ params, fetch }) => {
		const refused = await redeliverStatement(fetch, params.id);
		if (refused) return fail(refused.status, { actionError: refused.message });
	},
	newPdfSent: async ({ request, fetch }) => {
		const refused = await markNewPdfSent(fetch, String((await request.formData()).get('documentId')));
		if (refused) return fail(refused.status, { actionError: refused.message });
	},
	recalculate: async ({ params, fetch }) => {
		const refused = await recalculateStatement(fetch, params.id);
		if (refused) return fail(refused.status, { actionError: refused.message });
	},
	declineCorrection: async ({ params, fetch }) => {
		const refused = await declineCorrection(fetch, params.id);
		if (refused) return fail(refused.status, { actionError: refused.message });
	},
	remind: async ({ params, fetch }) => {
		const result = await sendStatementReminder(fetch, params.id);
		if ('error' in result) return fail(result.status, { actionError: result.error });
		return { reminder: result.reminder };
	},
	delete: async ({ params, fetch, request }) => {
		const response = await fetch(`${BACKEND_URL}/api/v1/statements/${params.id}`, {
			method: 'DELETE'
		});
		if (!response.ok) return fail(response.status, { actionError: m.statements_delete_failed() });
		// back to the list as it was filtered (#679), never to another page; on page 1, the last one may now be empty
		const list = localPath(String((await request.formData()).get('list') ?? ''));
		const search = new URLSearchParams(list?.startsWith('/statements?') ? list.slice(12) : '');
		search.delete('page');
		throw redirect(303, search.size ? `/statements?${search}` : '/statements');
	}
};
