import { redirect } from '@sveltejs/kit';
import { emergencySheet } from '$lib/server/backup';
import type { RequestHandler } from './$types';

// The Notfallblatt of the code still to confirm (#718), passed on as the backend makes it; never stored. Once the code is
// confirmed there is none (409): the Übersicht
export const GET: RequestHandler = async ({ fetch, url }) => {
	const response = await emergencySheet(fetch, url.origin);
	if (!response.ok) redirect(303, '/dashboard');
	return new Response(response.body, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': response.headers.get('content-disposition') ?? 'attachment'
		}
	});
};
