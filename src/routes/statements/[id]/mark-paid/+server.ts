import { json } from '@sveltejs/kit';
import { markStatementPaid } from '$lib/server/statement-actions';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, fetch }) => {
	const response = await markStatementPaid(fetch, params.id);
	return json(await response.json(), { status: response.status });
};
