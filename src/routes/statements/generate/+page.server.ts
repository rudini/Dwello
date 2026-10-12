import { fail } from '@sveltejs/kit';
import type { Building } from '$lib/types';
import { toHeatingProfile } from '$lib/server/heating-profile';
import {
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

const isDay = (value: string | null) => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);

// A link from a contract or a refusal names one building and one period (A-10): its other statements of that
// period tell which heating profile and management fee to use again
async function chosen(fetch: typeof globalThis.fetch, url: URL) {
	const [building, start, end] = ['building', 'start', 'end'].map((key) => url.searchParams.get(key));
	if (!building || !isDay(start) || !isDay(end)) return null;
	const statements = await json(
		fetch,
		`statements?buildingId=${building}&periodStart=${start}&periodEnd=${end}&limit=1`
	);
	const [other] = (statements.data ?? []) as Row[];
	return { building, period: { start: start!, end: end! }, other };
}

export const load = async ({ fetch, url }: { fetch: typeof globalThis.fetch; url: URL }) => {
	const [buildings, heatingProfiles, config, pick] = await Promise.all([
		json(fetch, 'buildings?limit=100'),
		json(fetch, 'heating-profiles?limit=100'),
		json(fetch, 'config'),
		chosen(fetch, url)
	]);
	const settings = (config.data ?? {}) as Record<string, string | null>;

	// Defaults from the settings, adjustable per generation run
	return {
		buildings: (buildings.buildings ?? []) as (Building & { apartmentCount: number })[],
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
		defaultBuildingIds: pick ? [pick.building] : []
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
			const [preview, invoices] = await Promise.all([
				previewStatements(fetch, run),
				invoicesInPeriod(fetch, run)
			]);
			return { preview, invoices };
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
