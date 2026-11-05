import { error } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { periodName, reportPeriods, reportReconciliation } from '$lib/server/cost-reconciliation';
import type { PageServerLoad } from './$types';

// #1126: the Kostenabstimmung of a building's period; a period without statements is not one of «Berichte»
export const load: PageServerLoad = async ({ fetch, params, url }) => {
	const [periodStart, periodEnd] = [
		url.searchParams.get('periodStart'),
		url.searchParams.get('periodEnd')
	];
	const period = (await reportPeriods(fetch)).find(
		(p) =>
			p.buildingId === params.buildingId &&
			p.periodStart === periodStart &&
			p.periodEnd === periodEnd
	);
	if (!period) error(404, m.record_not_found({ record: m.reconciliation_title() }));
	return {
		title: m.reports_detail_title({
			building: period.buildingName,
			period: periodName(period.periodStart, period.periodEnd)
		}),
		reconciliation: await reportReconciliation(fetch, period)
	};
};
