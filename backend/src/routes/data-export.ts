/**
 * The export of all data under «Einstellungen» (#496): the BFF makes the ZIP from it
 */

import { Elysia, t } from 'elysia';
import { exportAllData } from '../services/data-export.service';

export const dataExportRoutes = new Elysia({ prefix: '/api/v1/export' }).get('/', ({ query }) => exportAllData(query.language), {
	query: t.Object({ language: t.Union([t.Literal('de'), t.Literal('fr'), t.Literal('it'), t.Literal('en')]) })
});
