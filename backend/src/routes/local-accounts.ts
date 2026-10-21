/**
 * Konto mit Passwort (#576): the public check the sign-in page sends through the BFF, and the accounts a signed-in
 * Liegenschaftsverwalter (or the E2E stack) sets; the Betreiber uses `bun run account` instead
 */

import { Elysia, t } from 'elysia';
import { CodedError, errorBody } from '../services/coded-error';
import { checkPassword, deleteLocalAccount, hasLocalAccount, setLocalAccount } from '../services/local-account.service';

const STATUS: Record<string, number> = { INVALID_CREDENTIALS: 401, ACCOUNT_LOCKED: 423, PASSWORD_TOO_SHORT: 400 };

const refused = (error: unknown, set: { status?: number | string }) => {
	if (!(error instanceof CodedError) || !STATUS[error.code]) throw error;
	set.status = STATUS[error.code];
	return errorBody(error, error.message);
};

const credentials = t.Object({ email: t.String({ minLength: 1, maxLength: 255 }), password: t.String({ maxLength: 1024 }) });

/** Before the auth middleware: no session yet */
export const passwordSignInRoutes = new Elysia({ prefix: '/api/v1/auth/password' })
	.get('/', async () => ({ available: await hasLocalAccount() }))
	.post(
		'/',
		async ({ body, set }) => {
			try {
				return await checkPassword(body.email, body.password);
			} catch (error) {
				return refused(error, set);
			}
		},
		{ body: credentials }
	);

export const localAccountRoutes = new Elysia({ prefix: '/api/v1/local-accounts' })
	.put(
		'/',
		async ({ body, set }) => {
			try {
				await setLocalAccount(body.email, body.password);
			} catch (error) {
				return refused(error, set);
			}
			set.status = 204;
			return null;
		},
		{ body: credentials }
	)
	.delete('/:email', async ({ params, set }) => {
		set.status = (await deleteLocalAccount(decodeURIComponent(params.email))) ? 204 : 404;
		return null;
	});
