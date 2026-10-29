import { error, fail } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { backendMessage } from '$lib/backend-error';
import type { Actions, PageServerLoad } from './$types';

// Zugangsschlüssel für KI-Programme (#817): the list; a new key comes back once, from the create action
const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/access-keys`;

type AccessKey = {
	id: string;
	name: string;
	createdAt: string;
	lastUsedAt: string | null;
	expiresOn: string;
	expired: boolean;
};

export const load: PageServerLoad = async ({ fetch, url }) => {
	const response = await fetch(API);
	if (!response.ok)
		throw error(response.status, m.record_not_loaded({ record: m.ai_keys_title() }));
	// the web app passes /mcp on to the backend (ADR 0007): the address the AI program needs, as this page's origin
	return { keys: (await response.json()).data as AccessKey[], mcpUrl: `${url.origin}/mcp` };
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const name = String((await request.formData()).get('name') ?? '');
		const response = await fetch(API, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ name })
		});
		const body = await response.json();
		if (!response.ok)
			return fail(response.status, { createError: backendMessage(body, m.ai_keys_not_created()) });
		return { created: { name: body.name as string, key: body.key as string } };
	},
	revoke: async ({ request, fetch }) => {
		const id = String((await request.formData()).get('id'));
		const response = await fetch(`${API}/${encodeURIComponent(id)}`, { method: 'DELETE' });
		// 404: already revoked, in another tab; the list without it is what was asked
		if (!response.ok && response.status !== 404)
			return fail(response.status, { revokeError: m.ai_keys_not_revoked() });
		return { revoked: true };
	}
};
