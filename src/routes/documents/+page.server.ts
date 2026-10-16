import { fail } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { loadDocuments, localTitle } from '$lib/server/documents';
import type { Actions, PageServerLoad } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/documents`;

export const load: PageServerLoad = async ({ fetch, url }) => {
	const status = url.searchParams.get('status') === 'to_send' ? 'to_send' : null;
	return { documents: await loadDocuments(fetch, status ? `status=${status}` : ''), status };
};

export const actions: Actions = {
	// The letter goes to the post today: remade with today's date (#193), it is named so its new PDF is printed now
	markSent: async ({ request, fetch }) => {
		const id = String((await request.formData()).get('id'));
		const response = await fetch(`${API}/${id}/sent`, { method: 'PUT' });
		if (!response.ok) return fail(response.status, { actionError: m.documents_update_failed() });
		const sent = await response.json();
		return { sent: { id, title: localTitle(sent), tenantName: sent.tenantName as string } };
	}
};
