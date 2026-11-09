import { Elysia, t } from 'elysia';
import { annualReport } from '../services/annual-report.service';
import { buildingExists } from '../services/building.service';
import { refusal } from '../services/coded-error';
import { renderReportPdf } from '../services/report-pdf';

// #1409: the texts and the amounts of a report as the BFF shows them
const text = (maxLength: number) => t.String({ maxLength });
const reportRow = t.Object({ label: text(300), amount: text(40), total: t.Optional(t.Boolean()) });
const reportSection = t.Object({
	heading: text(300),
	help: text(2000),
	rows: t.Array(reportRow, { maxItems: 500 })
});
const reportDocument = t.Object({
	title: text(300),
	lines: t.Array(text(1000), { maxItems: 10 }),
	sections: t.Array(reportSection, { maxItems: 10 })
});
// #1409: the Jahresbericht of a building and a calendar year, and a report as PDF from the texts and amounts the BFF
// shows on the page
export const annualReportRoutes = new Elysia({ prefix: '/api/v1/reports' })
	.get(
		'/annual',
		async ({ query, set }) => {
			if (await buildingExists(query.buildingId)) return annualReport(query.buildingId, query.year);
			set.status = 404;
			return refusal('BUILDING_NOT_FOUND', 'Building not found');
		},
		{
			query: t.Object({
				buildingId: t.String({ format: 'uuid' }),
				year: t.Integer({ minimum: 1900, maximum: 2999 })
			})
		}
	)
	.post(
		'/pdf',
		async ({ body, set }) => {
			set.headers['content-type'] = 'application/pdf';
			return renderReportPdf(body);
		},
		{ body: reportDocument }
	);
