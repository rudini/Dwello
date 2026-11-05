import { Elysia, t } from 'elysia';
import { reportPeriods, reportReconciliation } from '../services/cost-reconciliation.service';

// #1126: «Berichte»: the periods with statements and the Kostenabstimmung of one
export const reportRoutes = new Elysia({ prefix: '/api/v1/reports' })
	.get('/reconciliations', async () => ({ periods: await reportPeriods() }))
	.get(
		'/reconciliation',
		({ query }) =>
			reportReconciliation(query.buildingId, { start: query.periodStart, end: query.periodEnd }),
		{
			query: t.Object({
				buildingId: t.String({ format: 'uuid' }),
				periodStart: t.String({ format: 'date' }),
				periodEnd: t.String({ format: 'date' })
			})
		}
	);
