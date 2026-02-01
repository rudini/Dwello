import { error } from '@sveltejs/kit';
import type { HeatingProfile } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export interface HeatingProfileDetailData {
	profile: HeatingProfile;
}

export const load = async ({ params, fetch }: { params: { id: string }; fetch: typeof globalThis.fetch }): Promise<HeatingProfileDetailData> => {
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

		return { profile };
	} catch (err) {
		console.error('Failed to fetch heating profile:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden des Heizprofils');
	}
};
