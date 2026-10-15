import { m } from '$lib/paraglide/messages';
import { pdfRefusal } from '$lib/server/statement';
import type { RequestHandler } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/** The statement's PDF: as a download, or with ?ansehen shown in the browser */
export const GET: RequestHandler = async ({ params, fetch, url }) => {
	const { id } = params;
	const view = url.searchParams.has('ansehen');

	try {
		// the backend makes a missing PDF first
		const response = await fetch(`${BACKEND_URL}/api/v1/statements/${id}/pdf`);

		if (!response.ok) {
			const body = await response.json().catch(() => null);
			return pdfRefusal(response.status, body, view ? m.statements_pdf_view_failed() : undefined);
		}

		return new Response(await response.arrayBuffer(), {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `${view ? 'inline' : 'attachment'}; filename="abrechnung-${id}.pdf"`
			}
		});
	} catch (error) {
		console.error('PDF download error:', error);
		return pdfRefusal(500, null);
	}
};
