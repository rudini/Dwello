import { backupSetup, confirmBackup } from '$lib/server/backup';
import type { Actions, PageServerLoad } from './$types';

// «Sicherung einrichten» (#718): the Wiederherstellungscode until the landlord types it again
export const load: PageServerLoad = async ({ fetch }) => backupSetup(fetch);

export const actions: Actions = {
	default: async ({ request, fetch }) => confirmBackup(fetch, await request.formData())
};
