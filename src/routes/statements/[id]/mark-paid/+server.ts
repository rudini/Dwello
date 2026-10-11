import { json } from '@sveltejs/kit';
import { localToday } from '$lib/contract-status';
import { markStatementPaid, paidDateError } from '$lib/server/statement-actions';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, fetch, request }) => {
	const { paidDate = localToday() } = await request.json().catch(() => ({}));
	const invalid = paidDateError(paidDate);
	if (invalid) return json({ error: invalid }, { status: 400 });
	const response = await markStatementPaid(fetch, params.id, paidDate);
	return json(await response.json(), { status: response.status });
};
