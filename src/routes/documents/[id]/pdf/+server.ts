import type { RequestHandler } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/documents`;

export const GET: RequestHandler = async ({ params, fetch }) => {
	const response = await fetch(`${API}/${params.id}/pdf`);
	return new Response(response.body, {
		status: response.status,
		headers: {
			'content-type': response.headers.get('content-type') ?? 'application/pdf',
			'content-disposition': response.headers.get('content-disposition') ?? 'attachment'
		}
	});
};
