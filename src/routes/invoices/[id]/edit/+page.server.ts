import { toCategory } from '$lib/server/category';
import { toDistributionKey } from '$lib/server/distribution-key';
import { statementPeriods, toInvoice } from '$lib/server/invoice';
import { fetchRecord } from '$lib/server/save-form';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

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

	return {
		invoice: toInvoice(invoice),
		...(await statementPeriods(fetch, BACKEND_URL, invoice)),
		buildings,
		categories: (categoriesData.categories || categoriesData.data || []).map(toCategory),
		distributionKeys: (distributionKeysData.data || []).map(toDistributionKey)
	};
};
