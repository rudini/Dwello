/**
 * #1126: the answers of `GET /reports/reconciliations`, `GET /reports/reconciliation` and
 * `GET /statements/run-reconciliation` (tests/contracts/report-*.json, statement-run-reconciliation.json)
 */

import type { UtilityStatement } from '../db/schema';

/** A building and one of its Abrechnungsperioden with a valid statement */
export type ReportPeriod = Pick<UtilityStatement, 'periodStart' | 'periodEnd'> & { buildingId: string; buildingName: string };

type Amounts = { buildingCosts: number; tenants: number; landlord: number };
type Named = { id: string; tenantName: string };

/** The Kostenabstimmung of a building's period; the notes only on «Berichte» */
export type ReconciliationBody = {
	positions: (Amounts & { categoryId: string | null; distributionKeyId: string | null; severalKeys: boolean })[];
	total: Amounts;
	managementFee: number;
	nonAllocable: number;
	withoutStatement?: number;
	drafts?: Named[];
	notUpToDate?: Named[];
};
