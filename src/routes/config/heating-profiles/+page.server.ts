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

		const profiles: HeatingProfile[] = (data.data || []).map((hp: Record<string, unknown>) => ({
			id: hp.id,
			name: hp.name || '',
			type: hp.type || 'predefined',
			description: hp.description || '',
			isActive: hp.isActive ?? true,
			monthlyPercentages: hp.monthlyPercentages || {
				january: parseFloat(hp.januaryPct as string) || 0,
				february: parseFloat(hp.februaryPct as string) || 0,
				march: parseFloat(hp.marchPct as string) || 0,
				april: parseFloat(hp.aprilPct as string) || 0,
				may: parseFloat(hp.mayPct as string) || 0,
				june: parseFloat(hp.junePct as string) || 0,
				july: parseFloat(hp.julyPct as string) || 0,
				august: parseFloat(hp.augustPct as string) || 0,
				september: parseFloat(hp.septemberPct as string) || 0,
				october: parseFloat(hp.octoberPct as string) || 0,
				november: parseFloat(hp.novemberPct as string) || 0,
				december: parseFloat(hp.decemberPct as string) || 0
			}
		}));

		return {
			profiles,
			total: data.total || profiles.length
		};
	} catch (err) {
		console.error('Failed to fetch heating profiles:', err);
		return { profiles: [], total: 0 };
	}
};
