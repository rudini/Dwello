import { fail } from '@sveltejs/kit';
import type { Building } from '$lib/types';
import { toHeatingProfile } from '$lib/server/heating-profile';
import {
	generateStatements,
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

export const load = async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
	const [buildings, heatingProfiles, config] = await Promise.all([
		json(fetch, 'buildings?limit=100'),
		json(fetch, 'heating-profiles?limit=100'),
		json(fetch, 'config')
	]);
	const settings = (config.data ?? {}) as Record<string, string | null>;

	// Defaults from the settings, adjustable per generation run
	return {
		buildings: (buildings.buildings ?? []) as (Building & { apartmentCount: number })[],
		heatingProfiles: ((heatingProfiles.data ?? []) as Row[]).map(toHeatingProfile),
		defaultManagementFeePercent: Number(settings.management_fee_pct ?? 3),
		defaultPeriod: lastCompletedPeriod((settings.accounting_period ?? 'calendar') as AccountingPeriodType),
		defaultHeatingProfileId: settings.default_heating_profile_id ?? ''
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
			return {
				preview: await previewStatements(fetch, generationRequest(await request.formData()))
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
