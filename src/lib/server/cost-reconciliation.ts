import type { Reconciliation } from '$lib/cost-reconciliation';
import type { ReconciliationBody, ReportPeriod } from '../../../backend/src/api/report';
import { m } from '$lib/paraglide/messages';
import { namesById } from '$lib/server/statement';
import { call, type GenerationRequest } from '$lib/server/statement-generation';
import { formatDate } from '$lib/utils/format';

/** #1126: the Kostenabstimmung of a building's period, as the backend gives it (tests/contracts/report-reconciliation.json) */
type Body = ReconciliationBody;

type Fetch = typeof globalThis.fetch;

export const periodName = (start: string, end: string) =>
	`${formatDate(start)} – ${formatDate(end)}`;

/** The rows in the UI language: a Kategorie with several Verteilschlüssel names its key (Fachreview 1126-1 V-6) */
async function toReconciliation(fetch: Fetch, body: Body): Promise<Reconciliation> {
	const [categories, keys] = await Promise.all([
		namesById(fetch, 'categories'),
		namesById(fetch, 'distribution-keys')
	]);
	const name = (id: string | null, names: Map<string, string>) => (id && names.get(id)) || '';
	// code review 1126-1: without a Kategorie (or with a deleted one) the position still has a name
	const category = (id: string | null) => name(id, categories) || m.invoices_no_category();
	return {
		positions: body.positions.map(({ categoryId, distributionKeyId, severalKeys, ...amounts }) => ({
			// code review 1126-2 C-3: a deleted key leaves the Kategorie alone
			label:
				severalKeys && name(distributionKeyId, keys)
					? `${category(categoryId)} (${name(distributionKeyId, keys)})`
					: category(categoryId),
			...amounts
		})),
		total: body.total,
		managementFee: body.managementFee,
		nonAllocable: body.nonAllocable,
		withoutStatement: body.withoutStatement ?? 0,
		drafts: body.drafts ?? [],
		notUpToDate: body.notUpToDate ?? []
	};
}

type Run = Omit<GenerationRequest, 'buildingIds'>;

/** The preview's Kostenabstimmung of each building of a run */
export async function runReconciliations(fetch: Fetch, run: Run & { buildingIds: string[] }) {
	const { periodStart, periodEnd, heatingProfileId } = run;
	const query = (buildingId: string) =>
		new URLSearchParams({
			buildingId,
			periodStart,
			periodEnd,
			managementFeePercent: String(run.managementFeePercent),
			...(heatingProfileId ? { heatingProfileId } : {})
		});
	return Promise.all(
		run.buildingIds.map(async (buildingId) => ({
			buildingId,
			reconciliation: await toReconciliation(
				fetch,
				await call(fetch, `statements/run-reconciliation?${query(buildingId)}`)
			)
		}))
	);
}

/** «Berichte»: each building and period with statements, named as its link */
export async function reportPeriods(fetch: Fetch) {
	const { periods } = (await call(fetch, 'reports/reconciliations')) as { periods: ReportPeriod[] };
	return periods.map((p) => {
		const { buildingId, periodStart, periodEnd } = p;
		return {
			...p,
			key: `${buildingId}-${periodStart}`,
			href: `/reports/${buildingId}?${new URLSearchParams({ periodStart, periodEnd })}`,
			name: m.reports_row_name({
				building: p.buildingName,
				period: periodName(periodStart, periodEnd)
			})
		};
	});
}

/** The Kostenabstimmung of one building's period on «Berichte» */
export async function reportReconciliation(
	fetch: Fetch,
	period: Omit<ReportPeriod, 'buildingName'>
) {
	const { buildingId, periodStart, periodEnd } = period;
	const query = new URLSearchParams({ buildingId, periodStart, periodEnd });
	return toReconciliation(fetch, await call(fetch, `reports/reconciliation?${query}`));
}
