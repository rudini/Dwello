/**
 * Root Layout Server Load
 * The signed-in user, verified from the session cookie in hooks.server.ts, and whether this is the public demo
 */

import { updateNotice } from '$lib/server/update';
import type { LayoutServerLoad } from './$types';

// Read again on every navigation (url): after sign-out or an expired session no page keeps showing the user.
// demo: the public demo (DEMO=on, deploy/demo/), whose visitors share the data
// update: the notice of a new version after sign-in (#1453)
export const load: LayoutServerLoad = async ({ locals, url, fetch, cookies }) => {
	void url.pathname;
	const user = locals.user ?? null;
	const update = user && (await updateNotice(fetch, cookies, user.signedInAt));
	return { user, demo: process.env.DEMO === 'on', ...(update && { update }) };
};
