/**
 * #1126: the answers of `GET /reports/reconciliations`, `GET /reports/reconciliation` and
 * `GET /statements/run-reconciliation` (tests/contracts/report-*.json, statement-run-reconciliation.json)
 */

import type { UtilityStatement } from '../db/schema';

/** A building and one of its Abrechnungsperioden with a valid statement */
export type ReportPeriod = Pick<UtilityStatement, 'periodStart' | 'periodEnd'> & { buildingId: string; buildingName: string };

type Amounts = { buildingCosts: number; tenants: number; landlord: number };
type Named = { id: string; tenantName: string };

/**
 * #1464: what «Kosten des Gebäudes» of a position is calculated from: a Rechnung with the part of its amount that counts
 * in the period (`beyond`: its Leistungszeitraum reaches beyond the period and only its days in it count), and around
 * them the Anfangs- and Endbestand of a tank; Anfangsbestand plus the parts minus Endbestand is «Kosten des Gebäudes»
 */
export type ReconciliationRow =
	| {
			kind: 'invoice';
			id: string;
			billingEntityName: string;
			invoiceDate: string;
			amount: number;
			inPeriod: number;
			beyond: { start: string; end: string; days: number; ofDays: number } | null;
	  }
	| { kind: 'opening' | 'closing'; date: string; amount: number };

/** The Kostenabstimmung of a building's period; the notes only on «Berichte» */
export type ReconciliationBody = {
	positions: (Amounts & {
		categoryId: string | null;
		distributionKeyId: string | null;
		severalKeys: boolean;
		fuelStock: { opening: number; closing: number } | null; // #1138: the position includes the change of the Tankbestand
		rows: ReconciliationRow[]; // #1464: none when no Rechnung is left (deleted since the statements were created)
	})[];
	total: Amounts;
	managementFee: number;
	nonAllocable: number;
	nonAllocableRows: ReconciliationRow[]; // #1464: the Rechnungen `nonAllocable` is the sum of
	vacancies: { apartmentNumber: string; days: number }[]; // #1138: the apartments with Leerstand
	withoutStatement?: number;
	drafts?: Named[];
	notUpToDate?: Named[];
	keyNotCalculable?: Named[]; // #1309
};

type AnnualCosts = { categories: { categoryId: string | null; amount: number }[]; total: number };

/** #1409: the Jahresbericht of a building and a calendar year (`GET /reports/annual`, tests/contracts/report-annual.json) */
export type AnnualReportBody = {
	year: number;
	firstYear: number; // the year of the building's first contract or invoice
	income: { netRent: number; additionalRent: number; flatRateUtilityCharge: number; total: number };
	costs: {
		// «davon tragen Sie» of the Kostenabstimmung of the period ending in the year; billed: it has valid statements
		utility: AnnualCosts & { period: { start: string; end: string }; billed: boolean; notes: boolean; outside: boolean };
		maintenance: AnnualCosts; // the non-allocable invoices without Hypothekarzinsen and capital improvements
		totalWithoutCapital: number;
		capital: AnnualCosts; // «Wertvermehrende Investitionen»
	};
};
