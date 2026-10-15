/**
 * Statement PDF API Proxy
 * GET /api/statements/[id]/pdf - Download statement as PDF
 */

import type { RequestHandler } from './$types';
import { forwardRequest, createBinaryResponse } from '$lib/server/api-proxy';
import { logger } from '$lib/server/error-handler';
import { pdfRefusal } from '$lib/server/statement';

export const GET: RequestHandler = async ({ params, cookies }) => {
	try {
		const response = await forwardRequest<ArrayBuffer>(
			`/statements/${params.id}/pdf`,
			'GET',
			cookies
		);

		// The link opens in the tab: a refusal as a sentence, the PDF as a file
		if (response.status !== 200) return pdfRefusal(response.status, response.data);
		return createBinaryResponse(response.data, 'application/pdf', `statement-${params.id}.pdf`);
	} catch (error) {
		logger.error(`Proxy error: GET /statements/${params.id}/pdf`, error as Error);
		return pdfRefusal(500, null);
	}
};
