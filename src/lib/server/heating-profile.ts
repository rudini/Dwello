import { backendMessage } from '$lib/backend-error';
import { m } from '$lib/paraglide/messages';
import type { HeatingProfile } from '$lib/types';
import { MONTHS, profileTotal } from '$lib/heating-profile';
import { deleteRecord, fetchRecord, nameTranslations, saveRecord } from './save-form';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/heating-profiles`;

/** Backend heating profile row (januaryPct … decemberPct) as frontend HeatingProfile */
export function toHeatingProfile(hp: Record<string, unknown>): HeatingProfile {
	return {
		id: hp.id,
		name: hp.name || '',
		nameDE: hp.nameDE || '',
		nameFR: hp.nameFR,
		nameIT: hp.nameIT,
		nameEN: hp.nameEN,
		type: hp.type || 'predefined',
		description: hp.description || '',
		isActive: hp.isActive ?? true,
		monthlyPercentages:
			hp.monthlyPercentages ||
			Object.fromEntries(MONTHS.map(({ key }) => [key, parseFloat(hp[`${key}Pct`] as string) || 0]))
	} as HeatingProfile;
}

export const fetchHeatingProfile = async (fetch: typeof globalThis.fetch, id: string) =>
	toHeatingProfile(await fetchRecord(fetch, `${API}/${id}`, m.glossary_profile_term()));

function parseHeatingProfile(formData: FormData) {
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	const shares = Object.fromEntries(MONTHS.map(({ key }) => [key, Number(field(key)) || 0]));
	const total = profileTotal(shares);

	const errors: Record<string, string> = {};
	if (!field('name')) errors.name = m.categories_error_name_required();
	// Same rule as the backend: the year distributes all heating costs
	if (Math.abs(total - 100) > 0.1) {
		errors.total = m.backend_heating_profile_shares_sum({ sum: total });
	}
	const body = {
		name: field('name'),
		description: field('description'),
		...nameTranslations(field),
		...Object.fromEntries(MONTHS.map(({ key }) => [`${key}Pct`, shares[key]]))
	};
	return { body, errors };
}

/** Form action body shared by "Neues Heizprofil" (POST) and "Heizprofil bearbeiten" (PUT) */
export async function saveHeatingProfile(
	fetch: typeof globalThis.fetch,
	request: Request,
	id?: string
) {
	return saveRecord(fetch, API, parseHeatingProfile(await request.formData()), id, {
		failure: (_status, saved) => backendMessage(saved, m.profiles_save_failed()),
		location: (saved) => `/config/heating-profiles/${saved}`
	});
}

export const deleteHeatingProfile = (fetch: typeof globalThis.fetch, id: string) =>
	deleteRecord(fetch, `${API}/${id}`, m.profiles_delete_failed(), '/config/heating-profiles');
