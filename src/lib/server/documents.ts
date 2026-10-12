import { m } from '$lib/paraglide/messages';
import type { StatementDocument } from '$lib/types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/documents`;

// The backend stores a reminder's German title; its level names it in the UI language
const reminderTitles = [m.documents_reminder_1, m.documents_reminder_2, m.documents_reminder_3];
const localTitle = (document: StatementDocument) =>
	(document.type === 'reminder' && reminderTitles[(document.reminderLevel ?? 0) - 1]?.()) ||
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
