/**
 * Protokoll routes (#357): the list under «Einstellungen», deleting an entry, and the login the BFF reports after OAuth or a password (#576) or the export of all data it made (#496)
 */

import { Elysia, t } from 'elysia';
import { auditLogWithExpiries } from '../services/access-key.service';
import { deleteAuditEntry, recordAudit } from '../services/audit-log.service';
import { pageLimit } from './page-limit';

export const auditLogRoutes = new Elysia({ prefix: '/api/v1/audit-log' })
	// a Zugangsschlüssel that ran out shows up here even when nobody used it again (#817); #746: a page of them, without
	// `limit` every entry
	// ponytail: pages in memory; page in SQL once the Protokoll holds more entries than one read should load
	.get(
		'/',
		async ({ query }) => {
			const entries = await auditLogWithExpiries();
			const limit = pageLimit(query.limit);
			const offset = query.offset ? parseInt(query.offset, 10) : 0;
			return { data: limit == null ? entries : entries.slice(offset, offset + limit), total: entries.length };
		},
		{ query: t.Object({ limit: t.Optional(t.String()), offset: t.Optional(t.String()) }) }
	)

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

	// #496: the BFF made the ZIP of all data; only date and time (Fachreview 496-1 F-4)
	.post('/exports', async ({ set }) => {
		await recordAudit('data_exported', {});
		set.status = 201;
		return null;
	})

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
