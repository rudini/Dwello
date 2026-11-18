import type { ServerLoadEvent } from '@sveltejs/kit';
import { updateNotice } from './update';

/**
 * The root layout's data: the signed-in user, verified from the session cookie in hooks.server.ts; whether this is
 * the public demo (DEMO=on, deploy/demo/), whose visitors share the data; the notice of a new version after sign-in
 * (#1453). Read again on every navigation (url): after sign-out or an expired session no page keeps showing the user.
 */
export async function layoutData({ locals, url, fetch, cookies }: ServerLoadEvent) {
	void url.pathname;
	const user = locals.user ?? null;
	const update = user && (await updateNotice(fetch, cookies, user.signedInAt));
	return { user, demo: process.env.DEMO === 'on', ...(update && { update }) };
}
