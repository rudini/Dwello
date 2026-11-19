import { backupState } from '$lib/server/backup';
import { saveUpdateCheck } from '$lib/server/settings';
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
	const lacks = (code: string) =>
		(config.creditorMissing as { code: string }[]).some((missing) => missing.code === code);

	return {
		// what the stored IBAN lacks (#690), said at the link to the form
		missing: { company: lacks('IBAN_COMPANY_ADDRESS_MISSING'), holder: lacks('ACCOUNT_HOLDER_MISSING') },
		backup,
		updateCheck: checks ? config.data.update_check !== 'off' : null
	};
};

export const actions: Actions = {
	updateCheck: ({ request, fetch }) => saveUpdateCheck(fetch, request)
};
