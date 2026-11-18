import { localName } from '$lib/names';
import { backupState } from '$lib/server/backup';
import { toHeatingProfile } from '$lib/server/heating-profile';
import { atFields, saveSettings, toSettings } from '$lib/server/settings';
import type { DistributionKeyRow } from '$lib/server/distribution-key';
import type { Actions, PageServerLoad } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

export const load: PageServerLoad = async ({ fetch }) => {
	const get = (path: string) => fetch(`${API}/${path}`).then((response) => response.json());
	const [config, heatingProfiles, distributionKeys, { backup }, { checks }] = await Promise.all([
		get('config'),
		get('heating-profiles?limit=all'), // all of them (#588)
		get('distribution-keys?limit=all'),
		backupState(fetch),
		get('update') // #1453: whether this installation may search for new versions at all
	]);

	return {
		settings: toSettings(config.data),
		// #690: what the stored IBAN lacks, marked as after a refused save
		...atFields(config.creditorMissing),
		heatingProfiles: heatingProfiles.data.map(toHeatingProfile),
		distributionKeys: distributionKeys.data.map((key: DistributionKeyRow) => ({
			id: key.id,
			name: localName(key)
		})),
		backup,
		updateCheck: checks ? config.data.update_check !== 'off' : null
	};
};

export const actions: Actions = {
	default: ({ request, fetch }) => saveSettings(fetch, request)
};
