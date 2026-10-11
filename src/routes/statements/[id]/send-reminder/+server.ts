import { json } from '@sveltejs/kit';
import { sendStatementReminder } from '$lib/server/statement-actions';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, fetch }) => {
	const result = await sendStatementReminder(fetch, params.id);
	return json('error' in result ? { error: result.error } : result.reminder, {
		status: result.status
	});
};
