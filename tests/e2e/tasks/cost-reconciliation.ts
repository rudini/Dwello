import type { Activity } from '../screenplay/actor';
import { Click, Navigate } from '../screenplay/interactions';
import { invoiceLink, invoicesToggle, previewReconciliation, reconciliationStatement, reportPeriod, reportReconciliation } from '../targets/cost-reconciliation';

// #1126: «Berichte» and the Kostenabstimmung of a building's period, opened from its list
export const openReports = Navigate.to('/reports');
export const openReportOf =
	(buildingId: string, periodStart: string): Activity =>
	(actor) =>
		actor.attemptsTo(Click.on(reportPeriod(buildingId, periodStart)));
export const openStatementInReport = (tenantName: string) => Click.on(reconciliationStatement(reportReconciliation, tenantName));

// #1464: a Kostenabstimmung in the preview, of a building, or without one the one on «Berichte»
type Place = { name: string; id: string } | null;
const scopeOf = (building: Place) => (building ? previewReconciliation(building.name, building.id) : reportReconciliation);
export const toggleInvoicesOf = (building: Place, position: string) => Click.on(invoicesToggle(scopeOf(building), position));
export const openInvoiceOf = (building: Place, date: string) => Click.on(invoiceLink(scopeOf(building), date));
