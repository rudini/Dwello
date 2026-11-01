import type { RequestHandler } from './$types';
import { proxyFile } from '$lib/server/file-proxy';
import { pdfRefusal } from '$lib/server/statement';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/contracts`;

/** #521: the letter for the tenants' consent to a new Abrechnungsperiode, as a download; the contract page links it
 * only where the backend offers it. A refusal (a stale page, a typed address) is a sentence, not a file */
export const GET: RequestHandler = async ({ params, fetch }) => {
	const response = await proxyFile(
		fetch,
		`${API}/${encodeURIComponent(params.id)}/consent-letter`,
		'application/pdf'
	);
	if (response.ok) return response;
	return pdfRefusal(response.status, await response.json().catch(() => null));
};
