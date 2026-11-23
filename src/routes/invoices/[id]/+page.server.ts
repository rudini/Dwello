import { m } from '$lib/paraglide/messages';
import { invoiceChoices, returnToOf, statementPeriods, tankCategories, toInvoice } from '$lib/server/invoice';
import { fetchRecord } from '$lib/server/save-form';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ params, url, fetch }) => {
	// The invoice names its category and distribution key in German only: the lists name them in the UI language
	const [invoice, { categories, distributionKeys }] = await Promise.all([
		fetchRecord(fetch, `${BACKEND_URL}/api/v1/invoices/${params.id}`, m.invoices_record()),
		invoiceChoices(fetch)
	]);
	return {
		invoice: toInvoice(invoice, [...categories, ...distributionKeys]),
		// the category of the building's tank: whether the invoice counts as a delivery into it (#1469)
		tank: (await tankCategories(fetch, [invoice.buildingId]))[invoice.buildingId] as string | undefined,
		...(await statementPeriods(fetch, BACKEND_URL, params.id)),
		returnTo: returnToOf(url)
	};
};
