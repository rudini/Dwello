/**
 * The export of everything Dwello holds about a tenant, for the right to data handover (#435, Art. 28 DSG): the data
 * with its list of files, and each file on its own (#748)
 */

import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import { exportFile } from '../services/tenant-export-file.service';
import { exportTenant } from '../services/tenant-export.service';

// mounted inside tenantRoutes, under its prefix /api/v1/tenants
export const tenantExportRoutes = new Elysia()
	.use(authMiddleware)
	// Everything Dwello holds about the tenant, for the right to data handover (#435)
	.get('/:id/export', async ({ params, set }) => {
		const result = await exportTenant(params.id);
		if (!result) {
			set.status = 404;
			return { error: 'Tenant not found' };
		}
		return result;
	})
	// #748: one file of the export at a time, so no answer holds them all
	.get(
		'/:id/export/files/:kind/:fileId',
		async ({ params, set }) => {
			const file = await exportFile(params.id, params.kind, params.fileId);
			if (!file) {
				set.status = 404;
				return { error: 'File not found' };
			}
			set.headers['content-type'] = 'application/octet-stream';
			return file;
		},
		{
			params: t.Object({
				id: t.String({ format: 'uuid' }),
				kind: t.Union([t.Literal('document'), t.Literal('contract'), t.Literal('statement')]),
				fileId: t.String({ format: 'uuid' })
			})
		}
	);
