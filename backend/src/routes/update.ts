/**
 * The newest version and the update (#1453)
 */

import { Elysia } from 'elysia';
import { CodedError, errorBody } from '../services/coded-error';
import { startUpdate, updateState } from '../services/update.service';

export const updateRoutes = new Elysia({ prefix: '/api/v1/update' })
	.get('/', () => updateState())
	.post('/', async ({ set }) => {
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
