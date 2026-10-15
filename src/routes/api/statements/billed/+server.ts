import { json } from '@sveltejs/kit';
import { billedContracts } from '$lib/server/statement-generation';
import type { RequestHandler } from './$types';

// Wizard step 2: per building, how many contracts of the period have a statement already, by the rule of the run
export const GET: RequestHandler = async ({ url, fetch }) =>
	json(
		await billedContracts(fetch, {
			buildingIds: (url.searchParams.get('buildingIds') ?? '').split(',').filter(Boolean),
			periodStart: url.searchParams.get('periodStart') ?? '',
			periodEnd: url.searchParams.get('periodEnd') ?? ''
		})
	);
