/**
 * Statement PDF API Proxy
 * GET /api/statements/[id]/pdf - Download statement as PDF
 */

import type { RequestHandler } from './$types';
import {
	forwardRequest,
	createBinaryResponse,
	handleProxyError
} from '$lib/server/api-proxy';

export const GET: RequestHandler = async ({ params, cookies }) => {
	try {
		const response = await forwardRequest<ArrayBuffer>(
			`/statements/${params.id}/pdf`,
			'GET',
			cookies
		);

		// Return PDF as binary response
		return createBinaryResponse(
			response.data,
			'application/pdf',
			`statement-${params.id}.pdf`
		);
	} catch (error) {
		return handleProxyError(error, `GET /statements/${params.id}/pdf`);
	}
};
