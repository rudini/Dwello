import { m } from '$lib/paraglide/messages';
import { invoiceChoices, statementPeriods, tankCategories, toInvoice } from '$lib/server/invoice';
import { fetchRecord } from '$lib/server/save-form';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const [invoice, buildingsData, choices] = await Promise.all([
		fetchRecord(fetch, `${BACKEND_URL}/api/v1/invoices/${params.id}`, m.invoices_record()),
		fetch(`${BACKEND_URL}/api/v1/buildings?limit=1000`).then((r) => r.json()),
		invoiceChoices(fetch)
	]);

	const buildings = (buildingsData.buildings || buildingsData.data || []).map(
		(b: Record<string, unknown>) => ({
			id: b.id as string,
			name: (b.name || '') as string,
			address: `${b.address}, ${b.postalCode} ${b.city}`
		})
	);

	return {
		invoice: toInvoice(invoice, [...choices.categories, ...choices.distributionKeys]),
		...(await statementPeriods(fetch, BACKEND_URL, params.id)),
		buildings,
		tanks: await tankCategories(fetch, buildings.map((b: { id: string }) => b.id)),
		...choices
	};
};
