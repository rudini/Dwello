import { error } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { toAuditEntries } from '$lib/server/audit-log';
import { deleteRecord } from '$lib/server/save-form';
import type { Actions, PageServerLoad } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/audit-log`;

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(API);
	if (!response.ok) throw error(response.status, m.record_not_loaded({ record: m.audit_title() }));
	return { entries: toAuditEntries((await response.json()).data) };
};

export const actions: Actions = {
	delete: async ({ request, fetch }) =>
		deleteRecord(
			fetch,
			`${API}/${(await request.formData()).get('id')}`,
			m.audit_delete_failed(),
			'/config/audit-log'
		)
};
