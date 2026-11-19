import { backupState } from '$lib/server/backup';
import { saveUpdateCheck, toSettingsOverview } from '$lib/server/settings';
import type { Actions, PageServerLoad } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

// #1456: the overview; the form is on «Absender und Konto» (sender/)
export const load: PageServerLoad = async ({ fetch }) => {
	const get = (path: string) => fetch(`${API}/${path}`).then((response) => response.json());
	const [config, { backup }, { checks }] = await Promise.all([
		get('config'),
		backupState(fetch),
		get('update') // #1453: whether this installation may search for new versions at all
	]);
	return { ...toSettingsOverview(config, checks), backup };
};

export const actions: Actions = {
	updateCheck: ({ request, fetch }) => saveUpdateCheck(fetch, request)
};
