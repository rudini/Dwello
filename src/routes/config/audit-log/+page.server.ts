import { error, fail, redirect } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { toAuditEntries } from '$lib/server/audit-log';
import type { Actions, PageServerLoad } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/audit-log`;

// #746: every login adds an entry; the newest first, 50 a page
const pageSize = 50;

export const load: PageServerLoad = async ({ fetch, url }) => {
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '') || 1);
	const response = await fetch(`${API}?limit=${pageSize}&offset=${(page - 1) * pageSize}`);
	if (!response.ok) throw error(response.status, m.record_not_loaded({ record: m.audit_title() }));
	const { data, total } = await response.json();
	return { entries: toAuditEntries(data), page, pageSize, total };
};

export const actions: Actions = {
	delete: async ({ request, fetch }) => {
		const id = (await request.formData()).get('id');
		const response = await fetch(`${API}/${encodeURIComponent(String(id))}`, { method: 'DELETE' });
		// 404: already deleted, in another tab or by another visitor of the demo; the list without it is what was asked
		if (!response.ok && response.status !== 404)
			return fail(response.status, { error: m.audit_delete_failed() });
		throw redirect(303, '/config/audit-log');
	}
};
