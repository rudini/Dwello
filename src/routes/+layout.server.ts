/**
 * Root Layout Server Load
 * The signed-in user, verified from the session cookie in hooks.server.ts, and whether this is the public demo
 */

import type { LayoutServerLoad } from './$types';

// Read again on every navigation (url): after sign-out or an expired session no page keeps showing the user.
// demo: the public demo (DEMO=on, deploy/demo/), whose visitors share the data
export const load: LayoutServerLoad = async ({ locals, url }) => {
	void url.pathname;
	return { user: locals.user ?? null, demo: process.env.DEMO === 'on' };
};
