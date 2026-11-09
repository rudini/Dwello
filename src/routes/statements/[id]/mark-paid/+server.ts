import { json } from '@sveltejs/kit';
import { validateXsrfToken } from '$lib/server/auth';
import { markStatementPaid } from '$lib/server/statement-actions';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, fetch, request, cookies }) => {
	// a JSON post passes SvelteKit's origin check: the token is what only the app's own page has (#1375)
	if (!validateXsrfToken(request, cookies)) return json({}, { status: 403 });
	const { paidDate, periodEnd, paidAmount } = await request.json().catch(() => ({}));
	const refused = await markStatementPaid(fetch, params.id, paidDate, periodEnd, paidAmount); // #959: a part too
	// in the UI language, shown in the dialog
	return refused ? json({ message: refused.message }, { status: refused.status }) : json({});
};
