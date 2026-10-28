/**
 * Zugangsschlüssel für KI-Programme (#817) under «Einstellungen»: list, create (the key shown once) and revoke
 */

import { Elysia, t } from 'elysia';
import { createAccessKey, listAccessKeys, revokeAccessKey } from '../services/access-key.service';
import { refusal } from '../services/coded-error';

export const accessKeyRoutes = new Elysia({ prefix: '/api/v1/access-keys' })
	.get('/', async () => ({ data: await listAccessKeys() }))

	.post(
		'/',
		async ({ body, set }) => {
			const name = body.name.trim();
			if (!name) {
				set.status = 422;
				return refusal('ACCESS_KEY_NAME_MISSING', 'A name is required');
			}
			set.status = 201;
			return createAccessKey(name);
		},
		{ body: t.Object({ name: t.String({ maxLength: 100 }) }) }
	)

	.delete('/:id', async ({ params, set }) => {
		if (await revokeAccessKey(params.id)) return { id: params.id };
		set.status = 404; // already revoked, in another tab: the UI treats it as done
		return { error: 'Access key not found' };
	});
