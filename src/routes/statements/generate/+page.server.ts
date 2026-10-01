import { fail } from '@sveltejs/kit';
import type { Building } from '$lib/types';
import { toHeatingProfile } from '$lib/server/heating-profile';
import {
	generateStatements,
	previewStatements,
	type GenerationRequest
} from '$lib/server/statement-generation';
import type { Actions } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Row = Record<string, unknown>;

async function rows(fetch: typeof globalThis.fetch, path: string, key: string): Promise<Row[]> {
	const response = await fetch(`${BACKEND_URL}/api/v1/${path}`);
	return response.ok ? ((await response.json())[key] ?? []) : [];
}

export const load = async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
	const [buildings, heatingProfiles] = await Promise.all([
		rows(fetch, 'buildings?limit=100', 'buildings'),
		rows(fetch, 'heating-profiles?limit=100', 'data')
	]);

	// Default to previous calendar year
	const lastYear = new Date().getFullYear() - 1;
	return {
		buildings: buildings as unknown as (Building & { apartmentCount: number })[],
		heatingProfiles: heatingProfiles.map(toHeatingProfile),
		defaultPeriod: { start: `${lastYear}-01-01`, end: `${lastYear}-12-31` }
	};
};

const generationRequest = (formData: FormData): GenerationRequest => ({
	buildingIds: String(formData.get('buildingIds')).split(',').filter(Boolean),
	periodStart: String(formData.get('periodStart')),
	periodEnd: String(formData.get('periodEnd')),
	heatingProfileId: String(formData.get('heatingProfileId'))
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
