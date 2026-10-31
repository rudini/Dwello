import { fail, redirect } from '@sveltejs/kit';
import { backendMessage, type BackendError } from '$lib/backend-error';
import { m } from '$lib/paraglide/messages';
import { loadStatement } from '$lib/server/statement';
import type { Actions, PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ params, fetch }) => ({
	statement: await loadStatement(fetch, params.id)
});

// One error per field, or for the whole form
const failed = (status: number, errors: Record<string, string>) => fail(status, { errors });

// Costs and management fee come from the generation run; only deadline and notes are editable
export const actions: Actions = {
	default: async ({ request, params, fetch }) => {
		const form = await request.formData();
		// no field below CHF 5 (#94): nothing is paid, so there is no deadline to change
		const paymentDeadline = form.get('paymentDeadline');
		if (paymentDeadline === '') {
			return failed(400, { paymentDeadline: m.statements_deadline_missing() });
		}
		const response = await fetch(`${BACKEND_URL}/api/v1/statements/${params.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				...(paymentDeadline !== null && { paymentDeadline }),
				notes: String(form.get('notes'))
			})
		});
		if (!response.ok) {
			const refusal = (await response.json().catch(() => ({}))) as BackendError;
			// a Zahlungsfrist before the one the tenant got (#966): at its field
			if (refusal.code === 'STATEMENT_DEADLINE_BEFORE_SENT')
				return failed(response.status, {
					paymentDeadline: backendMessage(refusal, m.statements_save_failed())
				});
			return failed(response.status, { form: m.statements_save_failed() });
		}
		// after sending, what only the new PDF prints, named on the detail page (#524)
		const { pdfChange } = (await response.json()) as { pdfChange?: string | null };
		throw redirect(303, `/statements/${params.id}${pdfChange ? `?pdf-change=${pdfChange}` : ''}`);
	}
};
