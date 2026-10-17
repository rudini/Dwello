import { error, fail, redirect } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { toAuditEntries } from '$lib/server/audit-log';
import type { Actions, PageServerLoad } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/audit-log`;

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(API);
	if (!response.ok) throw error(response.status, m.record_not_loaded({ record: m.audit_title() }));
	return { entries: toAuditEntries((await response.json()).data) };
};

export const actions: Actions = {
	delete: async ({ request, fetch }) => {
		const id = (await request.formData()).get('id');
		const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
		// 404: already deleted, in another tab or by another visitor of the demo; the list without it is what was asked
		if (!response.ok && response.status !== 404)
			return fail(response.status, { error: m.audit_delete_failed() });
		throw redirect(303, '/config/audit-log');
	}
};
