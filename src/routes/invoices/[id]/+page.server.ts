import { m } from '$lib/paraglide/messages';
import { invoiceChoices, statementPeriods, toInvoice } from '$lib/server/invoice';
import { fetchRecord } from '$lib/server/save-form';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// The invoice names its category and distribution key in German only: the lists name them in the UI language
	const [invoice, { categories, distributionKeys }] = await Promise.all([
		fetchRecord(fetch, `${BACKEND_URL}/api/v1/invoices/${params.id}`, m.invoices_record()),
		invoiceChoices(fetch)
	]);
	return {
		invoice: toInvoice(invoice, [...categories, ...distributionKeys]),
		...(await statementPeriods(fetch, BACKEND_URL, invoice))
	};
};
