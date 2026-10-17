import { json } from '@sveltejs/kit';
import { contractAgreements } from '$lib/server/statement-generation';
import type { RequestHandler } from './$types';

// Wizard step 3: per contract of the run, the Nebenkosten of the period it has not answered or does not agree (#91)
export const GET: RequestHandler = async ({ url, fetch }) =>
	json(
		await contractAgreements(fetch, {
			buildingIds: (url.searchParams.get('buildingIds') ?? '').split(',').filter(Boolean),
			periodStart: url.searchParams.get('periodStart') ?? '',
			periodEnd: url.searchParams.get('periodEnd') ?? ''
		})
	);
