import {
	checkKiConnection,
	downloadKiModel,
	loadKiSettings,
	saveKiSettings
} from '$lib/server/ki-settings';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ fetch }) => loadKiSettings(fetch);

export const actions: Actions = {
	save: ({ request, fetch }) => saveKiSettings(fetch, request),
	check: ({ request, fetch }) => checkKiConnection(fetch, request),
	download: ({ fetch }) => downloadKiModel(fetch)
};
