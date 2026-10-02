import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { loadStatement } from '$lib/server/statement';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ params, fetch }) => ({
	statement: await loadStatement(fetch, params.id)
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
	markPaid: ({ params, fetch }) =>
		changeStatus(
			fetch,
			params.id,
			{ status: 'paid', paidDate: new Date().toISOString().split('T')[0] },
			'Abrechnung konnte nicht als bezahlt markiert werden.'
		),
	delete: async ({ params, fetch }) => {
		const response = await fetch(`${BACKEND_URL}/api/v1/statements/${params.id}`, {
			method: 'DELETE'
		});
		if (!response.ok)
			return fail(response.status, { actionError: 'Abrechnung konnte nicht gelöscht werden.' });
		throw redirect(303, '/statements');
	}
};
