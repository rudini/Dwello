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
	positions: (Amounts & {
		categoryId: string | null;
		distributionKeyId: string | null;
		severalKeys: boolean;
		fuelStock: { opening: number; closing: number } | null; // #1138: the position includes the change of the Tankbestand
	})[];
	total: Amounts;
	managementFee: number;
	nonAllocable: number;
	vacancies: { apartmentNumber: string; days: number }[]; // #1138: the apartments with Leerstand
	withoutStatement?: number;
	drafts?: Named[];
	notUpToDate?: Named[];
	keyNotCalculable?: Named[]; // #1309
};

/** #1409: the Jahresbericht of a building and a calendar year (`GET /reports/annual`, tests/contracts/report-annual.json) */
export type AnnualReportBody = {
	year: number;
	firstYear: number; // the year of the building's first contract or invoice
	income: { netRent: number; additionalRent: number; advancePayments: number; flatRateUtilityCharge: number; total: number };
};
