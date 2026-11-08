/**
 * What a statement keeps of its positions' calculation for the PDF (jsonb columns of `utility_statements` and
 * `utility_statement_line_items`, schema.ts)
 */

/** Own value and the building's total by unit: the fraction a simple distribution key gives the apartment */
export type KeyValues = Record<'area' | 'units' | 'rooms', [number, number]>;

// A month's share of the heating costs; a month split by a move-in or move-out with its share in the profile and its
// days (#451), absent before
export type MonthShare = { month: number; percentage: number; full?: number; days?: number; total?: number };

// #1284: a position's part before or from the day an apartment no longer exists, calculated with the amounts it prints:
// the building's costs in the part, the apartment's share of them among the apartments that count, the tenant's share
export type LineSegment = {
	start: string;
	end: string;
	count: number; // the apartments that count
	keyValues: KeyValues;
	costs: number;
	apartment: number;
	periodShare: number;
	days?: number; // the share as days, when it is one
	total?: number;
	profileShare?: number; // heating costs by the Heizprofil: the part's percentage of the position's costs
	share: number;
	discontinued?: { number: string; date: string }[]; // the apartments that no longer count from its start
};

// An invoice of a position over different days (#226): its days in the period, its amount for them, the tenant's days
export type InvoicePart = {
	start: string;
	end: string;
	amount: number;
	days: number;
	total: number;
	noPeriod?: true; // an invoice without Leistungszeitraum: it bills the period (#241)
	whole?: { start: string; end: string; amount: number }; // a Leistungszeitraum beyond the period, with the invoice's amount
	fuelStock?: true; // the change of the Tankbestand, not an invoice (#239)
	// a heating invoice shared by the Heizprofil's months in its days (#71): the tenant's months, those days' months
	profile?: { percent: number; months: MonthShare[]; periodMonths: MonthShare[] };
};
