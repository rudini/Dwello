import type { RequestHandler } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const POST: RequestHandler = async ({ params, fetch }) => {
	const { id } = params;

	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/statements/${id}/generate-pdf`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			// The backend validates the body as an object; without one it answers 422
			body: '{}'
		});

		const data = await response.json();

		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('PDF generation proxy error:', error);
		return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
