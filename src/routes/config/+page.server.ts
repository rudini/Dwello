import { germanName } from '$lib/names';
import { toHeatingProfile } from '$lib/server/heating-profile';
import { saveSettings, toSettings } from '$lib/server/settings';
import type { DistributionKey } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

export const load: PageServerLoad = async ({ fetch }) => {
	const get = (path: string) => fetch(`${API}/${path}`).then((response) => response.json());
	const [config, heatingProfiles, distributionKeys] = await Promise.all([
		get('config'),
		get('heating-profiles?limit=100'),
		get('distribution-keys?limit=100')
	]);

	return {
		settings: toSettings(config.data),
		heatingProfiles: heatingProfiles.data.map(toHeatingProfile),
		distributionKeys: distributionKeys.data.map((key: DistributionKey) => ({
			id: key.id,
			name: germanName(key)
		}))
	};
};

export const actions: Actions = {
	default: ({ request, fetch }) => saveSettings(fetch, request)
};
