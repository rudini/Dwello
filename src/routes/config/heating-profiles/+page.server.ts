import { toHeatingProfile } from '$lib/server/heating-profile';
import type { HeatingProfile } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface HeatingProfilesData {
	profiles: HeatingProfile[];
	total: number;
}

export const load = async ({ fetch }: { fetch: typeof globalThis.fetch }): Promise<HeatingProfilesData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/heating-profiles?limit=100`);

		if (!response.ok) {
			console.error('Failed to fetch heating profiles:', response.status);
			return { profiles: [], total: 0 };
		}

		const data = await response.json();

		const profiles: HeatingProfile[] = (data.data || []).map(toHeatingProfile);

		return {
			profiles,
			total: data.total || profiles.length
		};
	} catch (err) {
		console.error('Failed to fetch heating profiles:', err);
		return { profiles: [], total: 0 };
	}
};
