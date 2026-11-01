import type { RequestHandler } from './$types';
import { proxyFile } from '$lib/server/file-proxy';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/contracts`;

/** #521: the letter for the tenants' consent to a new Abrechnungsperiode, as a download; the contract page links it
 * only where the backend offers it */
export const GET: RequestHandler = ({ params, fetch }) =>
	proxyFile(fetch, `${API}/${encodeURIComponent(params.id)}/consent-letter`, 'application/pdf');
