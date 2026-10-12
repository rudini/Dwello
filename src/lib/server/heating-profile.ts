import { backendMessage } from '$lib/backend-error';
import type { HeatingProfile } from '$lib/types';
import { MONTHS, profileTotal } from '$lib/heating-profile';
import { deleteRecord, fetchRecord, saveRecord } from './save-form';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/heating-profiles`;

/** Backend heating profile row (januaryPct … decemberPct) as frontend HeatingProfile */
export function toHeatingProfile(hp: Record<string, unknown>): HeatingProfile {
	return {
		id: hp.id,
		name: hp.name || '',
		nameDE: hp.nameDE || '',
		type: hp.type || 'predefined',
		description: hp.description || '',
		isActive: hp.isActive ?? true,
		monthlyPercentages:
			hp.monthlyPercentages ||
			Object.fromEntries(MONTHS.map(({ key }) => [key, parseFloat(hp[`${key}Pct`] as string) || 0]))
	} as HeatingProfile;
}

export const fetchHeatingProfile = async (fetch: typeof globalThis.fetch, id: string) =>
	toHeatingProfile(await fetchRecord(fetch, `${API}/${id}`, 'Heizprofil'));

function parseHeatingProfile(formData: FormData) {
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	const shares = Object.fromEntries(MONTHS.map(({ key }) => [key, Number(field(key)) || 0]));
	const total = profileTotal(shares);

	const errors: Record<string, string> = {};
	if (!field('name')) errors.name = 'Name ist erforderlich';
	// Same rule as the backend: the year distributes all heating costs
	if (Math.abs(total - 100) > 0.1) {
		errors.total = `Die Monatsanteile müssen zusammen 100 % ergeben (aktuell ${total} %).`;
	}
	const body = {
		name: field('name'),
		description: field('description'),
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
		failure: (_status, saved) =>
			backendMessage(saved, 'Heizprofil konnte nicht gespeichert werden.'),
		location: (saved) => `/config/heating-profiles/${saved}`
	});
}

export const deleteHeatingProfile = (fetch: typeof globalThis.fetch, id: string) =>
	deleteRecord(
		fetch,
		`${API}/${id}`,
		'Heizprofil konnte nicht gelöscht werden.',
		'/config/heating-profiles'
	);
