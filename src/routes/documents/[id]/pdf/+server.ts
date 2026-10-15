import type { RequestHandler } from './$types';
import { proxyFile } from '$lib/server/file-proxy';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/documents`;

export const GET: RequestHandler = ({ params, fetch }) => proxyFile(fetch, `${API}/${params.id}/pdf`, 'application/pdf');
