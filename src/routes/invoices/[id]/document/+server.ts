import type { RequestHandler } from './$types';
import { proxyFile } from '$lib/server/file-proxy';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/invoices`;

// The Beleg of an invoice as its file, with its kind and name
export const GET: RequestHandler = ({ params, fetch, request }) =>
	proxyFile(fetch, request, `${API}/${params.id}/document`, 'application/octet-stream', true);
