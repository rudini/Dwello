import { json } from '@sveltejs/kit';
import { markStatementPaid } from '$lib/server/statement-actions';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, fetch, request }) => {
	const { paidDate, periodEnd, paidAmount } = await request.json().catch(() => ({}));
	const refused = await markStatementPaid(fetch, params.id, paidDate, periodEnd, paidAmount); // #959: a part too
	// in the UI language, shown in the dialog
	return refused ? json({ message: refused.message }, { status: refused.status }) : json({});
};
