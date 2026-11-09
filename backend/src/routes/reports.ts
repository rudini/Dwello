import { Elysia, t } from 'elysia';
import { annualReport } from '../services/annual-report.service';
import { buildingExists } from '../services/building.service';
import { renderReportPdf } from '../services/report-pdf';
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
	)
	// #1409: the Jahresbericht of a building and a calendar year
	.get(
		'/reports/annual',
		async ({ query, set }) => ((await buildingExists(query.buildingId)) ? annualReport(query.buildingId, query.year) : notFound(set)),
		{ query: t.Object({ buildingId: t.String({ format: 'uuid' }), year: t.Numeric({ minimum: 1900, maximum: 2999 }) }) }
	)
	// #1409: a report as PDF, from the texts and amounts the BFF shows on the page
	.post(
		'/reports/pdf',
		async ({ body, set }) => {
			set.headers['content-type'] = 'application/pdf';
			return renderReportPdf(body);
		},
		{
			body: t.Object({
				title: t.String({ maxLength: 300 }),
				lines: t.Array(t.String({ maxLength: 1000 }), { maxItems: 10 }),
				sections: t.Array(
					t.Object({
						heading: t.String({ maxLength: 300 }),
						help: t.String({ maxLength: 2000 }),
						rows: t.Array(t.Object({ label: t.String({ maxLength: 300 }), amount: t.String({ maxLength: 40 }), total: t.Optional(t.Boolean()) }), { maxItems: 500 })
					}),
					{ maxItems: 10 }
				)
			})
		}
	);
