import type { SkippedContract } from '$lib/statement-wizard';
import { error, fail } from '@sveltejs/kit';
import type { Building } from '$lib/types';
import { toHeatingProfile } from '$lib/server/heating-profile';
import {
	billedContracts,
	generateStatements,
	invoicesInPeriod,
	previewStatements,
	type GenerationRequest
} from '$lib/server/statement-generation';
import { m } from '$lib/paraglide/messages';
import type { Actions } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Row = Record<string, unknown>;

async function json(fetch: typeof globalThis.fetch, path: string): Promise<Row> {
	const response = await fetch(`${BACKEND_URL}/api/v1/${path}`);
	return response.ok ? response.json() : {};
}

type Defaults = {
	period: { start: string; end: string };
	buildingId: string | null;
	heatingProfileId: string | null;
	managementFeePercent: number;
	preset: {
		fromStatements: boolean;
		feeFromSettings: boolean;
		differing: boolean;
		profileFromApartment: boolean;
	} | null;
};

// A link from a contract or a refusal names one building and one period (A-10); a link to an unknown building is
// ignored (review K-5). The backend checks the period and takes Heizprofil and Verwaltungspauschale from the other
// statements of that building and period, otherwise from the settings (H-28)
async function defaults(
	fetch: typeof globalThis.fetch,
	url: URL,
	buildings: Row[]
): Promise<Defaults> {
	const [id, start, end] = ['building', 'start', 'end'].map(
		(key) => url.searchParams.get(key) ?? ''
	);
	const link = buildings.some((b) => b.id === id)
		? `?${new URLSearchParams({ buildingId: id, periodStart: start, periodEnd: end })}`
		: '';
	const response = await fetch(`${BACKEND_URL}/api/v1/statements/run-defaults${link}`);
	if (!response.ok) throw error(response.status, m.error_unexpected());
	return response.json();
}

export const load = async ({ fetch, url }: { fetch: typeof globalThis.fetch; url: URL }) => {
	const [buildings, heatingProfiles] = await Promise.all([
		json(fetch, 'buildings?limit=1000'),
		json(fetch, 'heating-profiles?limit=1000') // all of them (#588)
	]);
	const buildingList = (buildings.buildings ?? []) as (Building & { apartmentCount: number })[];
	const chosen = await defaults(fetch, url, buildingList as unknown as Row[]);
	const building = buildingList.find((b) => b.id === chosen.buildingId);

	return {
		buildings: buildingList,
		heatingProfiles: ((heatingProfiles.data ?? []) as Row[]).map(toHeatingProfile),
		defaultManagementFeePercent: chosen.managementFeePercent,
		defaultPeriod: chosen.period,
		defaultHeatingProfileId: chosen.heatingProfileId ?? '',
		defaultBuildingIds: building ? [building.id] : [],
		// what the link chose, said on the settings step (personas K1)
		preset:
			building && chosen.preset
				? { building: building.name, ...chosen.period, ...chosen.preset }
				: null
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
