import type { Reconciliation } from '$lib/cost-reconciliation';
import { m } from '$lib/paraglide/messages';
import { namesById } from '$lib/server/statement';
import { call } from '$lib/server/statement-generation';
import { formatDate } from '$lib/utils/format';

/** #1126: the Kostenabstimmung of a building's period, as the backend gives it (tests/contracts/report-reconciliation.json) */
type Amounts = { buildingCosts: number; tenants: number; landlord: number };
type Body = {
	positions: (Amounts & {
		categoryId: string | null;
		distributionKeyId: string | null;
		severalKeys: boolean;
	})[];
	total: Amounts;
	managementFee: number;
	nonAllocable: number;
	withoutStatement?: number;
	drafts?: number;
	notUpToDate?: { id: string; tenantName: string }[];
};

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
		drafts: body.drafts ?? 0,
		notUpToDate: body.notUpToDate ?? []
	};
}

type Run = {
	periodStart: string;
	periodEnd: string;
	heatingProfileId: string;
	managementFeePercent: number;
};

/** The preview's Kostenabstimmung of each building of a run */
export async function runReconciliations(fetch: Fetch, run: Run & { buildingIds: string[] }) {
	const query = (buildingId: string) =>
		new URLSearchParams({
			buildingId,
			periodStart: run.periodStart,
			periodEnd: run.periodEnd,
			managementFeePercent: String(run.managementFeePercent),
			...(run.heatingProfileId ? { heatingProfileId: run.heatingProfileId } : {})
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
	const { periods } = (await call(fetch, 'reports/reconciliations')) as {
		periods: { buildingId: string; buildingName: string; periodStart: string; periodEnd: string }[];
	};
	return periods.map((p) => ({
		...p,
		key: `${p.buildingId}-${p.periodStart}`,
		href: `/reports/${p.buildingId}?${new URLSearchParams({ periodStart: p.periodStart, periodEnd: p.periodEnd })}`,
		name: m.reports_row_name({
			building: p.buildingName,
			period: periodName(p.periodStart, p.periodEnd)
		})
	}));
}

/** The Kostenabstimmung of one building's period on «Berichte» */
export async function reportReconciliation(
	fetch: Fetch,
	buildingId: string,
	periodStart: string,
	periodEnd: string
) {
	const query = new URLSearchParams({ buildingId, periodStart, periodEnd });
	return toReconciliation(fetch, await call(fetch, `reports/reconciliation?${query}`));
}
