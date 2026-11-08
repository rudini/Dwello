import { json } from '@sveltejs/kit';
import { periodOf } from '$lib/accounting-period';
import { call } from '$lib/server/statement-generation';
import type { RequestHandler } from './$types';

// Wizard step 2: per building, the invoices the statement takes (by Leistungszeitraum, otherwise by Rechnungsdatum),
// so step 2 counts what the preview counts (#686)
export const GET: RequestHandler = async ({ url, fetch }) => {
	const { periodStart, periodEnd } = periodOf(url.searchParams);
	const ids = (url.searchParams.get('buildingIds') ?? '').split(',').filter(Boolean);
	const invoices = await Promise.all(
		ids.map((id) =>
			call(
				fetch,
				`invoices/for-statement/${encodeURIComponent(id)}?periodStart=${periodStart}&periodEnd=${periodEnd}`
			)
		)
	);
	return json({ invoices: invoices.flat() });
};
