/**
 * Prorating Service
 * Core business logic for calculating prorated utility costs
 *
 * Handles:
 * - Day-based prorating for partial periods
 * - Multiple contracts within a single period
 * - Mid-year moves with heating profile adjustments
 * - Vacancy cost allocation
 * - Parts before and from «Aufgehoben ab» (#1284)
 */

import type { HeatingProfile, InvoicePart, KeyValues, LineSegment } from '../db/schema';
import { roundToRappen } from './pdf-format';
import { daysAfter } from './today';
import { getHeatingProfile, calculateHeatingShare } from './heating-profile.service';
import { billingStart, getContractsByPeriod, type ContractWithDetails } from './contract.service';

/**
 * Period definition
 */
interface Period {
	start: Date;
	end: Date;
}

/**
 * Contract overlap with period
 */
interface ContractPeriodOverlap {
	contract: ContractWithDetails;
	overlapStart: Date;
	overlapEnd: Date;
	overlapDays: number;
	shareOfPeriod: number; // 0-1
}

/**
 * Calculate the number of days between two dates (inclusive)
 */
function calculateDaysBetween(start: Date, end: Date): number {
	const oneDay = 24 * 60 * 60 * 1000;
	const startTime = new Date(start).setHours(0, 0, 0, 0);
	const endTime = new Date(end).setHours(0, 0, 0, 0);
	return Math.round((endTime - startTime) / oneDay) + 1;
}

/**
 * Calculate the overlap between two date ranges
 */
function calculateOverlap(
	range1Start: Date,
	range1End: Date,
	range2Start: Date,
	range2End: Date
): { start: Date; end: Date; days: number } | null {
	const overlapStart = new Date(Math.max(range1Start.getTime(), range2Start.getTime()));
	const overlapEnd = new Date(Math.min(range1End.getTime(), range2End.getTime()));

	if (overlapStart > overlapEnd) {
		return null; // No overlap
	}

	return {
		start: overlapStart,
		end: overlapEnd,
		days: calculateDaysBetween(overlapStart, overlapEnd)
	};
}

/**
 * Calculate proration days for a contract within a period
 */
function calculateProrationDays(
	contractStart: Date,
	contractEnd: Date | null,
	periodStart: Date,
	periodEnd: Date
): { days: number; overlapStart: Date; overlapEnd: Date } | null {
	// If contract has no end date, use period end
	const effectiveContractEnd = contractEnd || periodEnd;

	// Calculate overlap
	const overlap = calculateOverlap(
		contractStart,
		effectiveContractEnd,
		periodStart,
		periodEnd
	);

	if (!overlap) {
		return null;
	}

	return {
		days: overlap.days,
		overlapStart: overlap.start,
		overlapEnd: overlap.end
	};
}

/**
 * Handle multiple contracts for an apartment in a period
 * Returns the proration share for each contract
 */
async function handleMultipleContracts(
	apartmentId: string,
	periodStart: Date,
	periodEnd: Date
): Promise<ContractPeriodOverlap[]> {
	// Get all contracts for the apartment that overlap with the period
	const contracts = await getContractsByPeriod(
		apartmentId,
		periodStart.toISOString().split('T')[0],
		periodEnd.toISOString().split('T')[0]
	);

	const totalPeriodDays = calculateDaysBetween(periodStart, periodEnd);
	const overlaps: ContractPeriodOverlap[] = [];

	for (const contract of contracts) {
		const contractStart = new Date(billingStart(contract)); // #133: from the day after «Abgerechnet bis»
		const contractEnd = contract.endDate ? new Date(contract.endDate) : null;

		const proration = calculateProrationDays(
			contractStart,
			contractEnd,
			periodStart,
			periodEnd
		);

		if (proration) {
			overlaps.push({
				contract,
				overlapStart: proration.overlapStart,
				overlapEnd: proration.overlapEnd,
				overlapDays: proration.days,
				shareOfPeriod: proration.days / totalPeriodDays
			});
		}
	}

	return overlaps;
}

/**
 * Calculate heating costs for a mid-year move using heating profile. Without the profile, or for a period whose months
 * carry 0 % in it (summer), the heating costs are shared by days like any other invoice: then only `byDays` (#137)
 */
export async function handleMidYearMoves(
	heatingProfileId: string,
	contractStart: Date,
	contractEnd: Date | null,
	periodStart: Date,
	periodEnd: Date,
	totalHeatingCosts: number
): Promise<
	| { byDays: true; reason?: 'wholePeriod' | 'noHeatingMonths' }
	| {
			byDays: false;
			share: number;
			percentage: number;
			periodPercentage: number;
			monthBreakdown: { month: number; percentage: number }[];
			periodBreakdown: { month: number; percentage: number }[];
	  }
> {
	const profile = await getHeatingProfile(heatingProfileId);
	if (!profile) return { byDays: true };

	// Determine the actual period the tenant occupied
	const effectiveStart = new Date(Math.max(contractStart.getTime(), periodStart.getTime()));
	const effectiveEnd = contractEnd
		? new Date(Math.min(contractEnd.getTime(), periodEnd.getTime()))
		: periodEnd;

	// Rule 5: the profile only on a move in or out; a contract over the whole period is shared by days (#208)
	if (effectiveStart <= periodStart && effectiveEnd >= periodEnd) return { byDays: true, reason: 'wholePeriod' };

	// The tenant's months against the months of the period: they may not carry 100 % (a Heizprofil of 100 % ± 0.1, or a
	// statement under a year from before #1088 and its berichtigte Abrechnung, #1099)
	const tenant = calculateHeatingShare(profile, effectiveStart, effectiveEnd, totalHeatingCosts);
	const period = calculateHeatingShare(profile, periodStart, periodEnd, totalHeatingCosts);
	if (period.percentage <= 0) return { byDays: true, reason: 'noHeatingMonths' };
	// the division of the printed sums, rounded as printed (#232)
	const percentage = roundToRappen((tenant.percentage / period.percentage) * 100);
	// periodPercentage and its months: what the period's months carry in the profile, so the PDF can show the division (#229)
	return {
		share: totalHeatingCosts * (percentage / 100),
		percentage,
		monthBreakdown: tenant.monthBreakdown,
		periodPercentage: period.percentage,
		periodBreakdown: period.monthBreakdown,
		byDays: false
	};
}

/**
 * Calculate vacancy costs for an apartment
 * Returns periods where apartment was vacant and associated costs
 */
function handleVacancy(
	contracts: ContractPeriodOverlap[],
	periodStart: Date,
	periodEnd: Date
): { vacantPeriods: Period[]; totalVacantDays: number } {
	// Sort contracts by start date
	const sortedContracts = [...contracts].sort(
		(a, b) => a.overlapStart.getTime() - b.overlapStart.getTime()
	);

	const vacantPeriods: Period[] = [];
	let currentDate = periodStart;

	for (const contract of sortedContracts) {
		// Check for gap before this contract
		if (currentDate < contract.overlapStart) {
			// Create vacant period from current to contract start
			const vacantEnd = new Date(contract.overlapStart);
			vacantEnd.setDate(vacantEnd.getDate() - 1);

			if (vacantEnd >= currentDate) {
				vacantPeriods.push({
					start: new Date(currentDate),
					end: vacantEnd
				});
			}
		}

		// Move current date to after this contract
		currentDate = new Date(contract.overlapEnd);
		currentDate.setDate(currentDate.getDate() + 1);
	}

	// Check for gap after last contract
	if (currentDate <= periodEnd) {
		vacantPeriods.push({
			start: new Date(currentDate),
			end: periodEnd
		});
	}

	// Calculate total vacant days
	const totalVacantDays = vacantPeriods.reduce(
		(sum, period) => sum + calculateDaysBetween(period.start, period.end),
		0
	);

	return { vacantPeriods, totalVacantDays };
}

/**
 * Calculate complete prorating for an apartment in a period
 */
interface ProratingResult {
	apartmentId: string;
	periodStart: Date;
	periodEnd: Date;
	totalPeriodDays: number;
	contracts: Array<{
		contract: ContractWithDetails;
		overlapStart: Date;
		overlapEnd: Date;
		overlapDays: number;
		shareOfPeriod: number;
	}>;
	vacancy: {
		vacantPeriods: Period[];
		totalVacantDays: number;
	};
	occupiedDays: number;
	occupancyRate: number;
}

export async function calculateApartmentProrating(
	apartmentId: string,
	periodStart: Date,
	periodEnd: Date
): Promise<ProratingResult> {
	const totalPeriodDays = calculateDaysBetween(periodStart, periodEnd);
	const contracts = await handleMultipleContracts(apartmentId, periodStart, periodEnd);
	const vacancy = handleVacancy(contracts, periodStart, periodEnd);

	const occupiedDays = contracts.reduce((sum, c) => sum + c.overlapDays, 0);

	return {
		apartmentId,
		periodStart,
		periodEnd,
		totalPeriodDays,
		contracts,
		vacancy,
		occupiedDays,
		occupancyRate: totalPeriodDays > 0 ? occupiedDays / totalPeriodDays : 0
	};
}

// ============================================================================
// #1284 «Aufgehobene Wohnung»: an apartment counts in the Verteilschlüssel on the days before «Aufgehoben ab»
// ============================================================================

export type CountedApartment = { id: string; number: string; area: number; rooms: number; discontinuedFrom: string | null };
type Range = { start: string; end: string };
type Share = { share: number; percentage: number };
type PartGroup = { invoices: (Range & { amount: number })[]; totalAmount: number; isHeatingCost: boolean; distributionKeyId: string | null };
type PartRun = { periodStart: Date; periodEnd: Date; heatingProfileId?: string; wholePeriod: boolean };
type LineDays = { positionRentalDays: number | null; billedDays: number | null; invoiceParts: InvoicePart[] | null };
// what the calculation does for one group: the apartment's share by the key, the tenant's part of it
type Calculation<G, R> = {
	keyShare: (apartments: CountedApartment[], apartmentId: string, total: number, keyId: string | null) => Promise<Share>;
	shareOfGroup: (group: G, key: Share, run: R, rental: Range) => Promise<{ tenantShare: number; periodShare: number; shareDays: LineDays }>;
};

/** The building's apartments as the Verteilschlüssel counts them, with their «Aufgehoben ab» */
export const apartmentsOfParts = (rows: { id: string; number: string; area: string; rooms: string; discontinuedFrom: string | null }[]): CountedApartment[] =>
	rows.map(({ id, number, area, rooms, discontinuedFrom }) => ({ id, number, area: parseFloat(area), rooms: parseFloat(rooms), discontinuedFrom }));

export const countingOn = (day: string) => (apartment: { discontinuedFrom: string | null }) =>
	!apartment.discontinuedFrom || apartment.discontinuedFrom > day;

/** The apartment's and the building's area, apartments and rooms: what a simple distribution key divides by */
export function keyValuesAmong(all: Array<{ id: string; area: number; rooms: number }>, apartmentId: string): KeyValues | null {
	const own = all.find((apartment) => apartment.id === apartmentId);
	if (!own) return null;
	const pair = (value: (apartment: (typeof all)[number]) => number): [number, number] => [value(own), all.reduce((sum, apartment) => sum + value(apartment), 0)];
	return { area: pair((a) => a.area), units: pair(() => 1), rooms: pair((a) => a.rooms) };
}

const isoDay = (date: Date) => date.toISOString().slice(0, 10);
const dayCount = (start: string, end: string) => (Date.parse(end) - Date.parse(start)) / 86_400_000 + 1;
const later = (a: string, b: string) => (a > b ? a : b);
const earlier = (a: string, b: string) => (a < b ? a : b);

// the period's parts, split at each day from which an apartment no longer exists that falls into the tenant's days
function partsOf(all: CountedApartment[], period: Range, rental: Range) {
	const cuts = [...new Set(all.map((a) => a.discontinuedFrom).filter((day): day is string => !!day && day > rental.start && day <= rental.end))].sort();
	return [period.start, ...cuts].map((start, i) => ({ start, end: i < cuts.length ? daysAfter(cuts[i], -1) : period.end }));
}

// A group's invoices in one part: each with its amount for its days there, heating costs by the Heizprofil's months
// (Fachreview 1284-1, Art. 7 Abs. 1 VMWG), else by days; the part's costs rounded as printed (V-3)
function groupIn<G extends PartGroup>(group: G, part: Range, profile: HeatingProfile | null): G {
	const weight = (start: string, end: string) => (profile ? calculateHeatingShare(profile, new Date(start), new Date(end), 100).percentage : dayCount(start, end));
	const invoices = group.invoices.flatMap((invoice) => {
		const [start, end] = [later(invoice.start, part.start), earlier(invoice.end, part.end)];
		if (start > end) return [];
		const whole = weight(invoice.start, invoice.end);
		const share = whole > 0 ? weight(start, end) / whole : dayCount(start, end) / dayCount(invoice.start, invoice.end);
		return [{ ...invoice, start, end, amount: invoice.amount * share }];
	});
	return { ...group, invoices, totalAmount: roundToRappen(invoices.reduce((sum, invoice) => sum + invoice.amount, 0)) };
}

// a part as stored for the PDF: its costs, the apartments that count, the apartment's and the tenant's share
const segmentOf = (part: Range, counting: CountedApartment[], apartmentId: string, costs: number, key: Share, result: { tenantShare: number; periodShare: number; shareDays: LineDays }): LineSegment => ({
	...part,
	count: counting.length,
	keyValues: keyValuesAmong(counting, apartmentId)!,
	costs,
	apartment: key.share,
	periodShare: Math.round(result.periodShare * 10000) / 10000,
	...(result.shareDays.billedDays && { days: result.shareDays.positionRentalDays!, total: result.shareDays.billedDays }),
	share: result.tenantShare
});

// the tenant's share of a group whose days a day of «Aufgehoben ab» splits: per part the costs, the apartment's share of
// them among the apartments that count, the tenant's share of that, each as printed (Fachreview 1284-1 V-3)
async function shareByParts<G extends PartGroup, R extends PartRun>(group: G, all: CountedApartment[], apartmentId: string, days: { run: R; rental: Range }, calc: Calculation<G, R>) {
	const { run, rental } = days;
	const profile = group.isHeatingCost && run.heatingProfileId ? await getHeatingProfile(run.heatingProfileId) : null;
	const parts = partsOf(all, { start: isoDay(run.periodStart), end: isoDay(run.periodEnd) }, rental);
	const segments = (await Promise.all(parts.map((part) => partShare(part, { group, all, apartmentId, days, profile }, calc)))).filter((segment) => !!segment);
	const tenantShare = roundToRappen(segments.reduce((sum, segment) => sum + segment.share, 0));
	const apartmentShare = roundToRappen(segments.reduce((sum, segment) => sum + segment.apartment, 0));
	return { tenantShare, apartmentShare, periodShare: apartmentShare ? tenantShare / apartmentShare : 0, segments };
}

// one part: none where no invoice bills a day of it
type PartOf<G, R> = { group: G; all: CountedApartment[]; apartmentId: string; days: { run: R; rental: Range }; profile: HeatingProfile | null };
async function partShare<G extends PartGroup, R extends PartRun>(part: Range, { group, all, apartmentId, days, profile }: PartOf<G, R>, calc: Calculation<G, R>) {
	const { run, rental } = days;
	const partGroup = groupIn(group, part, profile);
	if (!partGroup.invoices.length) return null;
	const counting = all.filter(countingOn(later(part.start, rental.start)));
	const key = await calc.keyShare(counting, apartmentId, partGroup.totalAmount, group.distributionKeyId);
	const partRental = { start: later(part.start, rental.start), end: earlier(part.end, rental.end) };
	const partRun = { ...run, periodStart: new Date(part.start), periodEnd: new Date(part.end), wholePeriod: partRental.start === part.start && partRental.end === part.end };
	const result = await calc.shareOfGroup(partGroup, key, partRun, partRental);
	const discontinued = all.filter((a) => a.discontinuedFrom === part.start).map((a) => ({ number: a.number, date: part.start }));
	const profileShare = profile && group.totalAmount ? roundToRappen((partGroup.totalAmount / group.totalAmount) * 100) : undefined;
	return { ...segmentOf(part, counting, apartmentId, partGroup.totalAmount, key, result), ...(profileShare != null && { profileShare }), ...(discontinued.length && { discontinued }) };
}

/**
 * A position of the tenant: by the apartments that count on his days, split into parts when a day of «Aufgehoben ab»
 * falls into them
 */
export async function lineByParts<G extends PartGroup, R extends PartRun>(group: G, all: CountedApartment[], apartmentId: string, days: { run: R; rental: Range }, calc: Calculation<G, R>) {
	const { run, rental } = days;
	if (partsOf(all, { start: isoDay(run.periodStart), end: isoDay(run.periodEnd) }, rental).length > 1) {
		const parts = await shareByParts(group, all, apartmentId, days, calc);
		return { ...parts, shareDays: { positionRentalDays: null, billedDays: null, invoiceParts: null } as LineDays };
	}
	const key = await calc.keyShare(all.filter(countingOn(rental.start)), apartmentId, group.totalAmount, group.distributionKeyId);
	return { ...(await calc.shareOfGroup(group, key, run, rental)), apartmentShare: key.share, segments: null };
}
