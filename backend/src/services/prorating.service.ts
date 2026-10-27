/**
 * Prorating Service
 * Core business logic for calculating prorated utility costs
 *
 * Handles:
 * - Day-based prorating for partial periods
 * - Multiple contracts within a single period
 * - Mid-year moves with heating profile adjustments
 * - Vacancy cost allocation
 */

import { roundToRappen } from './pdf-format';
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

	// The tenant's months against the months of the period: a period under a year carries only its months' shares
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
