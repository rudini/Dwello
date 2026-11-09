/**
 * #1410: the invoice list's building and period whose Aufbewahrungsfrist has passed, and «Behalten» of them; the
 * backend decides which (invoice-retention.ts)
 */
import { fail, type RequestEvent } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { periodName } from '$lib/accounting-period';
import type { ExpiredInvoicePeriod } from '../../../backend/src/api/invoice';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/** #1410: the list's building and period when their Aufbewahrungsfrist has passed and they are not kept, else null */
export async function expiredPeriod(fetch: typeof globalThis.fetch, url: URL) {
	const [building, start] = [url.searchParams.get('building'), url.searchParams.get('periodStart')];
	if (!building || !start) return null;
	const { periods = [] } = (await (
		await fetch(`${BACKEND_URL}/api/v1/invoices/retention`)
	).json()) as { periods?: ExpiredInvoicePeriod[] };
	const found = periods.find((p) => p.buildingId === building && p.start === start);
	return found ? { ...found, period: periodName(found) } : null;
}

/** «Behalten» of the building's invoices of the period; the overview no longer names them */
export async function keepInvoices({ fetch, request }: Pick<RequestEvent, 'fetch' | 'request'>) {
	const form = await request.formData();
	const response = await fetch(`${BACKEND_URL}/api/v1/invoices/retention/kept`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			buildingId: form.get('buildingId'),
			periodStart: form.get('periodStart')
		})
	});
	if (!response.ok) return fail(response.status, { keepError: m.contracts_save_failed() });
}
