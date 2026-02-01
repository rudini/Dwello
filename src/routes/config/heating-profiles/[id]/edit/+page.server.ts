import { error, redirect } from '@sveltejs/kit';
import type { HeatingProfile } from '$lib/types';
import type { Actions } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export interface HeatingProfileEditData {
	profile: HeatingProfile;
}

export const load = async ({ params, fetch }: { params: { id: string }; fetch: typeof globalThis.fetch }): Promise<HeatingProfileEditData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/heating-profiles/${params.id}`);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Heizprofil nicht gefunden');
			}
			throw error(response.status, 'Fehler beim Laden des Heizprofils');
		}

		const data = await response.json();

		const profile: HeatingProfile = {
			id: data.id,
			name: data.name || '',
			type: data.type || 'predefined',
			description: data.description || '',
			isActive: data.isActive ?? true,
			monthlyPercentages: data.monthlyPercentages || {
				january: parseFloat(data.januaryPct) || 0,
				february: parseFloat(data.februaryPct) || 0,
				march: parseFloat(data.marchPct) || 0,
				april: parseFloat(data.aprilPct) || 0,
				may: parseFloat(data.mayPct) || 0,
				june: parseFloat(data.junePct) || 0,
				july: parseFloat(data.julyPct) || 0,
				august: parseFloat(data.augustPct) || 0,
				september: parseFloat(data.septemberPct) || 0,
				october: parseFloat(data.octoberPct) || 0,
				november: parseFloat(data.novemberPct) || 0,
				december: parseFloat(data.decemberPct) || 0
			}
		};

		// Only custom profiles can be edited
		if (profile.type === 'predefined') {
			throw error(403, 'Vordefinierte Profile können nicht bearbeitet werden');
		}

		return { profile };
	} catch (err) {
		console.error('Failed to fetch heating profile for edit:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden des Heizprofils');
	}
};

export const actions: Actions = {
	default: async ({ request, params, fetch }) => {
		const profileId = params.id;
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const description = formData.get('description') as string;

		// Get monthly percentages
		const monthlyPercentages = {
			january: parseInt(formData.get('january') as string) || 0,
			february: parseInt(formData.get('february') as string) || 0,
			march: parseInt(formData.get('march') as string) || 0,
			april: parseInt(formData.get('april') as string) || 0,
			may: parseInt(formData.get('may') as string) || 0,
			june: parseInt(formData.get('june') as string) || 0,
			july: parseInt(formData.get('july') as string) || 0,
			august: parseInt(formData.get('august') as string) || 0,
			september: parseInt(formData.get('september') as string) || 0,
			october: parseInt(formData.get('october') as string) || 0,
			november: parseInt(formData.get('november') as string) || 0,
			december: parseInt(formData.get('december') as string) || 0
		};

		// Validate
		const errors: Record<string, string> = {};
		if (!name?.trim()) {
			errors.name = 'Name ist erforderlich';
		}

		const total = Object.values(monthlyPercentages).reduce((sum, val) => sum + val, 0);
		if (total < 95 || total > 105) {
			errors.total = `Die Summe sollte nahe bei 100% liegen (aktuell: ${total}%)`;
		}

		if (Object.keys(errors).length > 0) {
			return { success: false, errors };
		}

		try {
			const response = await fetch(`${BACKEND_URL}/api/v1/heating-profiles/${profileId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					description,
					januaryPct: monthlyPercentages.january,
					februaryPct: monthlyPercentages.february,
					marchPct: monthlyPercentages.march,
					aprilPct: monthlyPercentages.april,
					mayPct: monthlyPercentages.may,
					junePct: monthlyPercentages.june,
					julyPct: monthlyPercentages.july,
					augustPct: monthlyPercentages.august,
					septemberPct: monthlyPercentages.september,
					octoberPct: monthlyPercentages.october,
					novemberPct: monthlyPercentages.november,
					decemberPct: monthlyPercentages.december
				})
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				return { success: false, errors: { general: errorData.error || 'Fehler beim Speichern' } };
			}

			throw redirect(303, `/config/heating-profiles/${profileId}`);
		} catch (err) {
			if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 303) {
				throw err;
			}
			console.error('Failed to update heating profile:', err);
			return { success: false, errors: { general: 'Fehler beim Speichern des Heizprofils' } };
		}
	}
};
