import { toCategory } from '$lib/server/category';
import { toDistributionKey } from '$lib/server/distribution-key';
import { toInvoice } from '$lib/server/invoice';
import { fetchRecord } from '$lib/server/save-form';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Period = { periodStart: string; periodEnd: string };

// The periods with statements that already took this invoice (by Leistungszeitraum, otherwise by Rechnungsdatum)
function billedIn(invoice: Record<string, string | null>, statements: Period[]) {
	const start = invoice.servicePeriodStart ?? invoice.invoiceDate!;
	const end = invoice.servicePeriodEnd ?? invoice.invoiceDate!;
	const periods = statements
		.filter((s) => s.periodStart <= end && s.periodEnd >= start)
		.map((s) => `${s.periodStart}/${s.periodEnd}`);
	return [...new Set(periods)].map((p) => ({ start: p.split('/')[0], end: p.split('/')[1] }));
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	const [invoice, buildingsData, categoriesData, distributionKeysData] = await Promise.all([
		fetchRecord(fetch, `${BACKEND_URL}/api/v1/invoices/${params.id}`, 'Rechnung'),
		fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`).then((r) => r.json()),
		fetch(`${BACKEND_URL}/api/v1/categories?limit=100`).then((r) => r.json()),
		fetch(`${BACKEND_URL}/api/v1/distribution-keys?limit=100`).then((r) => r.json())
	]);

	const buildings = (buildingsData.buildings || buildingsData.data || []).map(
		(b: Record<string, unknown>) => ({
			id: b.id as string,
			name: (b.name || '') as string,
			address: `${b.address}, ${b.postalCode} ${b.city}`
		})
	);

	const statements = await fetch(`${BACKEND_URL}/api/v1/statements?buildingId=${invoice.buildingId}&limit=1000`)
		.then((r) => r.json())
		.catch(() => ({ data: [] }));

	return {
		invoice: toInvoice(invoice),
		billedIn: billedIn(invoice, statements.data ?? []),
		buildings,
		categories: (categoriesData.categories || categoriesData.data || []).map(toCategory),
		distributionKeys: (distributionKeysData.data || []).map(toDistributionKey)
	};
};
