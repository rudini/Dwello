import { fail } from '@sveltejs/kit';
import { loadDocuments } from '$lib/server/documents';
import type { Actions, PageServerLoad } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/documents`;

export const load: PageServerLoad = async ({ fetch, url }) => {
	const status = url.searchParams.get('status') === 'to_send' ? 'to_send' : null;
	return { documents: await loadDocuments(fetch, status ? `status=${status}` : ''), status };
};

export const actions: Actions = {
	// The letter was printed and posted
	markSent: async ({ request, fetch }) => {
		const id = String((await request.formData()).get('id'));
		const response = await fetch(`${API}/${id}/sent`, { method: 'PUT' });
		if (!response.ok)
			return fail(response.status, { actionError: 'Dokument konnte nicht aktualisiert werden.' });
	}
};
