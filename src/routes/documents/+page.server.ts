import { fail } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { backendMessage } from '$lib/backend-error';
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
		if (!response.ok) {
			// only a code the UI knows, never the backend's own text
			const { code } = await response.json().catch(() => ({}));
			return fail(response.status, { actionError: backendMessage({ code }, m.documents_update_failed()) });
		}
		const sent = await response.json();
		// the new PDF of a statement keeps its date and Zahlungsfrist: its notice says so (Fachreview 534-2 V-1)
		return { sent: { id, title: localTitle(sent), tenantName: sent.tenantName as string, newPdf: sent.type === 'new_pdf' } };
	}
};
