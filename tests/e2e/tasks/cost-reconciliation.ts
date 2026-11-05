import type { Activity } from '../screenplay/actor';
import { Click, Navigate } from '../screenplay/interactions';
import { reconciliationInvoice, reportPeriod, reportReconciliation } from '../targets/cost-reconciliation';

// #1126: «Berichte» and the Kostenabstimmung of a building's period, opened from its list
export const openReports = Navigate.to('/reports');
export const openReportOf =
	(buildingId: string, periodStart: string): Activity =>
	(actor) =>
		actor.attemptsTo(Click.on(reportPeriod(buildingId, periodStart)));
export const openInvoiceInReport = (description: string) => Click.on(reconciliationInvoice(reportReconciliation, description));
