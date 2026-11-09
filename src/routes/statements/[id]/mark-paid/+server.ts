import { error, json } from '@sveltejs/kit';
import { markStatementPaid } from '$lib/server/statement-actions';
import type { RequestHandler } from './$types';

/**
 * A form post, so SvelteKit's origin check covers it: another body, as a JSON post from another page, is refused
 * (#1375, as the export). Without a part payment the form has no paidAmount (#959).
 */
export const POST: RequestHandler = async ({ params, fetch, request }) => {
	const form = await request.formData().catch(() => error(415));
	const { paidDate, periodEnd, paidAmount } = Object.fromEntries(form) as Record<string, string>;
	const refused = await markStatementPaid(fetch, params.id, paidDate, periodEnd, paidAmount);
	// in the UI language, shown in the dialog
	return refused ? json({ message: refused.message }, { status: refused.status }) : json({});
};
