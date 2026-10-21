/**
 * Protokoll routes (#357): the list under «Einstellungen», deleting an entry, and the login the BFF reports after OAuth or a password (#576)
 */

import { Elysia, t } from 'elysia';
import { deleteAuditEntry, listAuditLog, recordAudit } from '../services/audit-log.service';

export const auditLogRoutes = new Elysia({ prefix: '/api/v1/audit-log' })
	.get('/', async () => ({ data: await listAuditLog() }))

	// Only the provider: no name, e-mail address or IP (data minimisation, fach review of #357)
	.post(
		'/logins',
		async ({ body, set }) => {
			await recordAudit('login', { provider: body.provider });
			set.status = 201;
			return null;
		},
		{ body: t.Object({ provider: t.Union([t.Literal('google'), t.Literal('microsoft'), t.Literal('local')]) }) }
	)

	.delete(
		'/:id',
		async ({ params, set }) => {
			if (!(await deleteAuditEntry(params.id))) {
				set.status = 404;
				return { error: 'Audit log entry not found' };
			}
			set.status = 204;
			return null;
		},
		{ params: t.Object({ id: t.String({ format: 'uuid' }) }) }
	);
