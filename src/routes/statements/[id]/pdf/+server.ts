import { m } from '$lib/paraglide/messages';
import type { RequestHandler } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Fetch = typeof globalThis.fetch;

// The PDF to look at before sending is made first if it does not exist yet
async function pdfToView(fetch: Fetch, id: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/statements/${id}/pdf`);
	if (response.status !== 404) return response;
	await fetch(`${BACKEND_URL}/api/v1/statements/${id}/generate-pdf`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: '{}' // the backend validates the body as an object
	});
	return fetch(`${BACKEND_URL}/api/v1/statements/${id}/pdf`);
}

/** The statement's PDF: as a download, or with ?ansehen shown in the browser */
export const GET: RequestHandler = async ({ params, fetch, url }) => {
	const { id } = params;
	const view = url.searchParams.has('ansehen');

	try {
		const response = view
			? await pdfToView(fetch, id)
			: await fetch(`${BACKEND_URL}/api/v1/statements/${id}/pdf`);

		if (!response.ok && view) {
			// opened in its own tab: a sentence instead of JSON
			return new Response(m.statements_pdf_view_failed(), {
				status: response.status,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' }
			});
		}
		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: 'PDF not available' }));
			return new Response(JSON.stringify(error), {
				status: response.status,
				headers: { 'Content-Type': 'application/json' }
			});
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
		return new Response(JSON.stringify({ error: 'Failed to download PDF' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
