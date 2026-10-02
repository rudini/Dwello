import type { StatementDocument } from '$lib/types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/documents`;

/** Stored documents, e.g. `statementId=…`, `tenantId=…` or `status=to_send`; newest first */
export async function loadDocuments(
	fetch: typeof globalThis.fetch,
	query = ''
): Promise<StatementDocument[]> {
	const response = await fetch(query ? `${API}?${query}` : API);
	return response.ok ? (await response.json()).data : [];
}
