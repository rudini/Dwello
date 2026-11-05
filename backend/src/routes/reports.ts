import { Elysia, t } from 'elysia';
import { buildingExists } from '../services/building.service';
import { refusal } from '../services/coded-error';
import {
	reportPeriods,
	reportReconciliation,
	runReconciliation
} from '../services/cost-reconciliation.service';

const period = {
	buildingId: t.String({ format: 'uuid' }),
	periodStart: t.String({ format: 'date' }),
	periodEnd: t.String({ format: 'date' })
};
const notFound = (set: { status?: number | string }) => {
	set.status = 404;
	return refusal('BUILDING_NOT_FOUND', 'Building not found');
};

// #1126: the Kostenabstimmung: of a run's preview, and on «Berichte» the periods with statements and the one of a period
export const reportRoutes = new Elysia({ prefix: '/api/v1' })
	.get(
		'/statements/run-reconciliation',
		async ({ query, set }) =>
			(await buildingExists(query.buildingId))
				? runReconciliation(query.buildingId, {
						period: { start: query.periodStart, end: query.periodEnd },
						heatingProfileId: query.heatingProfileId ?? null,
						managementFeePercent: query.managementFeePercent
					})
				: notFound(set),
		{
			query: t.Object({
				...period,
				heatingProfileId: t.Optional(t.String()),
				managementFeePercent: t.Optional(t.Numeric({ minimum: 0, maximum: 10 }))
			})
		}
	)
	.get('/reports/reconciliations', async () => ({ periods: await reportPeriods() }))
	.get(
		'/reports/reconciliation',
		async ({ query, set }) =>
			(await buildingExists(query.buildingId))
				? reportReconciliation(query.buildingId, { start: query.periodStart, end: query.periodEnd })
				: notFound(set),
		{ query: t.Object(period) }
	);
