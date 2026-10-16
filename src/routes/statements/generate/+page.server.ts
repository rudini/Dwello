import { fail } from '@sveltejs/kit';
import type { Building } from '$lib/types';
import { toHeatingProfile } from '$lib/server/heating-profile';
import {
	billedContracts,
	generateStatements,
	invoicesInPeriod,
	previewStatements,
	type GenerationRequest
} from '$lib/server/statement-generation';
import { lastCompletedPeriod, type AccountingPeriodType } from '$lib/accounting-period';
import type { Actions } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Row = Record<string, unknown>;

async function json(fetch: typeof globalThis.fetch, path: string): Promise<Row> {
	const response = await fetch(`${BACKEND_URL}/api/v1/${path}`);
	return response.ok ? response.json() : {};
}

// a real day: not 2025-02-30, not 2025-13-01 (an invalid date has no ISO string)
function isDay(value: string | null) {
	if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const day = new Date(`${value}T00:00:00Z`);
	return !isNaN(day.getTime()) && day.toISOString().startsWith(value);
}

// A link from a contract or a refusal names one building and one period (A-10): its other statements of that
// period tell which heating profile and management fee to use again. A link to an unknown building or with an
// impossible period is ignored: the wizard starts at the beginning (review K-5)
async function chosen(fetch: typeof globalThis.fetch, url: URL, buildings: Row[]) {
	const [id, start, end] = ['building', 'start', 'end'].map((key) => url.searchParams.get(key));
	const building = buildings.find((b) => b.id === id);
	if (!building || !isDay(start) || !isDay(end) || start! > end!) return null;
	const statements = await json(
		fetch,
		`statements?buildingId=${id}&periodStart=${start}&periodEnd=${end}&limit=1`
	);
	const [other] = (statements.data ?? []) as Row[];
	return { building, period: { start: start!, end: end! }, other };
}

export const load = async ({ fetch, url }: { fetch: typeof globalThis.fetch; url: URL }) => {
	const [buildings, heatingProfiles, config] = await Promise.all([
		json(fetch, 'buildings?limit=100'),
		json(fetch, 'heating-profiles?limit=100'),
		json(fetch, 'config')
	]);
	const buildingList = (buildings.buildings ?? []) as (Building & { apartmentCount: number })[];
	const pick = await chosen(fetch, url, buildingList as unknown as Row[]);
	const settings = (config.data ?? {}) as Record<string, string | null>;

	// Defaults from the settings, adjustable per generation run
	return {
		buildings: buildingList,
		heatingProfiles: ((heatingProfiles.data ?? []) as Row[]).map(toHeatingProfile),
		defaultManagementFeePercent: Number(
			pick?.other?.managementFeePercent ?? settings.management_fee_pct ?? 3
		),
		defaultPeriod:
			pick?.period ??
			lastCompletedPeriod((settings.accounting_period ?? 'calendar') as AccountingPeriodType),
		defaultHeatingProfileId: String(
			pick?.other?.heatingProfileId ?? settings.default_heating_profile_id ?? ''
		),
		defaultBuildingIds: pick ? [String(pick.building.id)] : [],
		// what the link chose, said on the settings step (personas K1)
		preset: pick && {
			building: String(pick.building.name),
			...pick.period,
			fromStatements: !!pick.other
		}
	};
};

const generationRequest = (formData: FormData): GenerationRequest => ({
	buildingIds: String(formData.get('buildingIds')).split(',').filter(Boolean),
	periodStart: String(formData.get('periodStart')),
	periodEnd: String(formData.get('periodEnd')),
	heatingProfileId: String(formData.get('heatingProfileId')),
	managementFeePercent: Number(formData.get('managementFeePercent'))
});

const failed = (err: unknown) =>
	fail(400, { error: err instanceof Error ? err.message : String(err) });

export const actions: Actions = {
	preview: async ({ request, fetch }) => {
		try {
			const run = generationRequest(await request.formData());
			const [preview, invoices, billed] = await Promise.all([
				previewStatements(fetch, run),
				invoicesInPeriod(fetch, run),
				billedContracts(fetch, run)
			]);
			const partly = new Map(billed.map((row) => [row.buildingId, row.partly]));
			return {
				preview,
				invoices: invoices.map((row) => ({ ...row, partlyBilled: partly.get(row.buildingId) ?? 0 }))
			};
		} catch (err) {
			return failed(err);
		}
	},
	generate: async ({ request, fetch }) => {
		try {
			return {
				created: await generateStatements(fetch, generationRequest(await request.formData()))
			};
		} catch (err) {
			return failed(err);
		}
	}
};
