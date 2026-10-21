import type { SkippedContract } from '$lib/statement-wizard';
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
	const [statements, contracts] = await Promise.all([
		json(fetch, `statements?buildingId=${id}&periodStart=${start}&periodEnd=${end}&limit=1000`),
		json(fetch, `contracts?buildingId=${id}&limit=1000`)
	]);
	const others = (statements.data ?? []) as Row[];
	// a statement stores its contract's rate (#89): only one at the run's rate tells the run's rate (fach-review V-1);
	// the heating profile comes from any of them, as before #89 (closing review C-1)
	const ofBuilding = (contracts.contracts ?? []) as Row[];
	const runRates = others.filter((s) =>
		ofBuilding.some(
			(c) => c.id === s.contractId && c.managementFeeAgreed && c.managementFeePercent == null
		)
	);
	// set differently, they tell nothing: both from the settings (#119); a deleted profile is no setting (fach-review V-5)
	// TODO(fachlich prüfen, #387): at a tenant change the settings' Heizprofil may differ from the other tenant's
	const profiles = others.filter((s) => s.heatingProfileId);
	const differing =
		new Set(profiles.map((s) => s.heatingProfileId)).size > 1 ||
		new Set(runRates.map((s) => Number(s.managementFeePercent))).size > 1;
	const [other, runRate] = differing ? [] : [profiles[0], runRates[0]];
	return { building, period: { start: start!, end: end! }, other, runRate, differing };
}

export const load = async ({ fetch, url }: { fetch: typeof globalThis.fetch; url: URL }) => {
	const [buildings, heatingProfiles, config] = await Promise.all([
		json(fetch, 'buildings?limit=1000'),
		json(fetch, 'heating-profiles?limit=1000'), // all of them (#588)
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
			pick?.runRate?.managementFeePercent ?? settings.management_fee_pct ?? 3
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
			fromStatements: !!pick.other,
			feeFromSettings: !pick.runRate,
			differing: pick.differing
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

const skippedIn = (row?: { contracts: number; skipped?: SkippedContract[] }) =>
	row?.skipped ? { skipped: row.skipped, allSkipped: row.contracts === 0 } : {};

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
			const byBuilding = new Map(billed.map((row) => [row.buildingId, row]));
			// new costs are the building's: say whether it bills a running befristeter Mietvertrag (#76)
			const fixedTerm = (id: string) =>
				preview.some((row) => row.buildingId === id && row.fixedTerm);
			return {
				preview,
				invoices: invoices.map((row) => ({
					...row,
					// #453 (#327): contracts «Abgerechnet bis» covers, and whether no contract is left to bill
					...skippedIn(byBuilding.get(row.buildingId)),
					fixedTerm: fixedTerm(row.buildingId)
				}))
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
