import { fail, redirect } from '@sveltejs/kit';
import { loadStatement } from '$lib/server/statement';
import type { Actions, PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ params, fetch }) => ({
	statement: await loadStatement(fetch, params.id)
});

// Costs and management fee come from the generation run; only deadline and notes are editable
export const actions: Actions = {
	default: async ({ request, params, fetch }) => {
		const form = await request.formData();
		const response = await fetch(`${BACKEND_URL}/api/v1/statements/${params.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				paymentDeadline: String(form.get('paymentDeadline')),
				notes: String(form.get('notes'))
			})
		});
		if (!response.ok) {
			return fail(response.status, { errors: { form: 'Abrechnung konnte nicht gespeichert werden.' } });
		}
		throw redirect(303, `/statements/${params.id}`);
	}
};
