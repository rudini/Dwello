import { NEW_CODE_PAGE, confirmBackup, createNewCode, newCodePage } from '$lib/server/backup';
import type { Actions, PageServerLoad } from './$types';

// «Neuer Wiederherstellungscode» (#718, part 3): signing in again, then the code, the Notfallblatt and its confirmation
export const load: PageServerLoad = async ({ fetch, locals, url }) => ({
	...(await newCodePage(fetch, locals.user)),
	confirmed: url.searchParams.has('confirmed')
});

export const actions: Actions = {
	create: async ({ request, fetch }) => createNewCode(fetch, await request.formData()),
	confirm: async ({ request, fetch }) =>
		confirmBackup(fetch, await request.formData(), `${NEW_CODE_PAGE}?confirmed`)
};
