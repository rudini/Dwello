/**
 * «Sicherung einrichten» (#718): the state with the Wiederherstellungscode to confirm, its confirmation and the Notfallblatt
 */

import { Elysia, t } from 'elysia';
import { backupSetup, confirmBackupCode, emergencySheet } from '../services/backup.service';
import { refusedWith } from '../services/coded-error';
import { fileResponse } from './file-response';

const refused = refusedWith({ BACKUP_CODE_MISMATCH: 422, BACKUP_NO_CODE: 409 });

export const backupRoutes = new Elysia({ prefix: '/api/v1/backup' })
	.get('/', () => backupSetup())
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
				language: t.Union([t.Literal('de'), t.Literal('fr'), t.Literal('it'), t.Literal('en')]),
				address: t.String({ maxLength: 512 })
			})
		}
	);
