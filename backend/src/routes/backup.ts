/**
 * «Sicherung einrichten» (#718): the state with the Wiederherstellungscode to confirm, its confirmation and the Notfallblatt
 */

import { Elysia, t } from 'elysia';
import { LANGUAGES } from '../db/schema';
import { authMiddleware } from '../middleware/auth';
import { backupSetup, confirmBackupCode, emergencySheet } from '../services/backup.service';
import { newBackupCode } from '../services/new-backup-code.service';
import { refusedWith } from '../services/coded-error';
import { fileResponse } from './file-response';

const refused = refusedWith({
	BACKUP_CODE_MISMATCH: 422,
	BACKUP_NO_CODE: 409,
	BACKUP_PASSWORD_WRONG: 422,
	BACKUP_SIGN_IN_AGAIN: 403,
	ACCOUNT_LOCKED: 423
});

export const backupRoutes = new Elysia({ prefix: '/api/v1/backup' })
	.use(authMiddleware)
	.get('/', () => backupSetup())
	// «Neuer Wiederherstellungscode» (#718, part 3): the password again, or a recent sign-in with Google
	.post(
		'/new-code',
		async ({ body, user, set }) => {
			try {
				return await newBackupCode(user!, body.password);
			} catch (error) {
				return refused(error, set);
			}
		},
		{ body: t.Object({ password: t.Optional(t.String({ maxLength: 1024 })) }) }
	)
	.post(
		'/confirm',
		async ({ body, set }) => {
			try {
				return await confirmBackupCode(body.code);
			} catch (error) {
				return refused(error, set);
			}
		},
		{ body: t.Object({ code: t.String({ maxLength: 64 }) }) }
	)
	.get(
		'/emergency-sheet',
		async ({ query, set }) => {
			try {
				const content = await emergencySheet(query.language, query.address);
				return fileResponse(set, {
					fileName: 'Notfallblatt-Dwello.pdf',
					mimeType: 'application/pdf',
					content
				});
			} catch (error) {
				return refused(error, set);
			}
		},
		{
			query: t.Object({
				language: t.UnionEnum(LANGUAGES),
				address: t.String({ maxLength: 512 })
			})
		}
	);
