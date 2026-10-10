import { billedIn, toInvoice } from '$lib/server/invoice';
import { fetchRecord } from '$lib/server/save-form';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const invoice = await fetchRecord(fetch, `${BACKEND_URL}/api/v1/invoices/${params.id}`, 'Rechnung');
	return { invoice: toInvoice(invoice), billedIn: await billedIn(fetch, BACKEND_URL, invoice) };
};
