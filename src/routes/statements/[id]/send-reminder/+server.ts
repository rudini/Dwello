import { json } from '@sveltejs/kit';
import { sendStatementReminder } from '$lib/server/statement-actions';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, fetch }) => {
	const response = await sendStatementReminder(fetch, params.id);
	return json(await response.json(), { status: response.status });
};
