import { fail } from '@sveltejs/kit';
import { backendMessage } from '$lib/backend-error';
import { m } from '$lib/paraglide/messages';
import type { StatementDocument } from '$lib/types';

const BACKEND = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;
const API = `${BACKEND}/documents`;

// The backend stores a reminder's or a sent statement's title in the tenant's language; the UI names it in its own
const reminderTitles = [m.documents_reminder_1, m.documents_reminder_2, m.documents_reminder_3];
export const localTitle = (document: StatementDocument) =>
	(document.type === 'reminder' && reminderTitles[(document.reminderLevel ?? 0) - 1]?.()) ||
	(document.type === 'statement' && m.documents_statement()) ||
	document.title;

/** Stored documents, e.g. `statementId=…`, `tenantId=…` or `status=to_send`; newest first */
export async function loadDocuments(
	fetch: typeof globalThis.fetch,
	query = ''
): Promise<StatementDocument[]> {
	const response = await fetch(query ? `${API}?${query}` : API);
	const documents: StatementDocument[] = response.ok ? (await response.json()).data : [];
	return documents.map((document) => ({ ...document, title: localTitle(document) }));
}

/** The upload form of the tenant page: the chosen file goes to the tenant, Base64 encoded; a refusal keeps the title */
export async function uploadDocument(fetch: typeof globalThis.fetch, tenantId: string, form: FormData) {
	const title = String(form.get('title') ?? '');
	const file = form.get('file');
	if (!(file instanceof File) || !file.size)
		return fail(400, { title, uploadError: m.tenants_document_file_missing() });
	const response = await fetch(`${BACKEND}/tenants/${tenantId}/documents`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			title,
			fileName: file.name,
			content: Buffer.from(await file.arrayBuffer()).toString('base64')
		})
	});
	const body = await response.json().catch(() => null);
	if (!response.ok) {
		const message = backendMessage(body, m.tenants_document_upload_failed());
		// a refusal shows at the field it is about
		return fail(
			response.status,
			body?.code === 'DOCUMENT_TITLE_TOO_LONG'
				? { title, titleError: message }
				: { title, uploadError: message }
		);
	}
	return { uploaded: body.title as string };
}

/** Deletes an uploaded document of the tenant page; the backend keeps Mahnungen and says why */
export async function deleteDocument(fetch: typeof globalThis.fetch, form: FormData) {
	const response = await fetch(`${API}/${encodeURIComponent(String(form.get('id')))}`, {
		method: 'DELETE'
	});
	if (!response.ok)
		return fail(response.status, {
			deleteError: backendMessage(
				await response.json().catch(() => null),
				m.tenants_document_delete_failed()
			)
		});
}
