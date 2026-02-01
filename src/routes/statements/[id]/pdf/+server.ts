import type { RequestHandler } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const { id } = params;

	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/statements/${id}/pdf`);

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: 'PDF not available' }));
			return new Response(JSON.stringify(error), {
				status: response.status,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const pdfBuffer = await response.arrayBuffer();

		return new Response(pdfBuffer, {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="abrechnung-${id}.pdf"`
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
