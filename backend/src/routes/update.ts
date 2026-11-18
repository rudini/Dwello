/**
 * The newest version and the update (#1453)
 */

import { Elysia } from 'elysia';
import { CodedError, errorBody } from '../services/coded-error';
import { startUpdate, updateState } from '../services/update.service';

export const updateRoutes = new Elysia({ prefix: '/api/v1/update' })
	.get('/', () => updateState())
	.post('/', async ({ set, server, request }) => {
		// the Sicherung before the update can take longer than the server keeps a silent connection open; cut off, the
		// landlord would read an error while the update starts (code review backup-first-1 C-1)
		server?.timeout(request, 0);
		try {
			await startUpdate();
			set.status = 202;
			return { started: true };
		} catch (error) {
			if (!(error instanceof CodedError)) throw error;
			set.status = 409;
			return errorBody(error, 'Update not started');
		}
	});
