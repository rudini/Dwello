import { localName } from '$lib/names';
import { backupState } from '$lib/server/backup';
import { toHeatingProfile } from '$lib/server/heating-profile';
import { saveSettings, toSettings } from '$lib/server/settings';
import type { DistributionKeyRow } from '$lib/server/distribution-key';
import type { Actions, PageServerLoad } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

export const load: PageServerLoad = async ({ fetch }) => {
	const get = (path: string) => fetch(`${API}/${path}`).then((response) => response.json());
	const [config, heatingProfiles, distributionKeys, { backup }] = await Promise.all([
		get('config'),
		get('heating-profiles?limit=1000'), // all of them (#588)
		get('distribution-keys?limit=1000'),
		backupState(fetch)
	]);

	return {
		settings: toSettings(config.data),
		heatingProfiles: heatingProfiles.data.map(toHeatingProfile),
		distributionKeys: distributionKeys.data.map((key: DistributionKeyRow) => ({
			id: key.id,
			name: localName(key)
		})),
		backup
	};
};

export const actions: Actions = {
	default: ({ request, fetch }) => saveSettings(fetch, request)
};
