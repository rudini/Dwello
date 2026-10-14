/**
 * Contract Availability Utility
 * Computes apartment availability based on existing contracts
 */

import { m } from '$lib/paraglide/messages';

/**
 * Represents the availability status of an apartment
 */
export interface AvailabilityInfo {
	/** Whether the apartment is available for a new contract */
	isAvailable: boolean;
	/** The earliest date a new contract can start (YYYY-MM-DD format) */
	availableFrom: string | null;
	/** Whether there's an ongoing (unlimited) contract blocking availability */
	hasOngoingContract: boolean;
	/** User-friendly message in the UI language */
	message: string;
	/** Status type for UI styling: 'available' | 'available-from' | 'blocked' */
	statusType: 'available' | 'available-from' | 'blocked';
}

/**
 * Contract data needed for availability computation
 */
export interface ContractForAvailability {
	id: string;
	start_date: Date | string;
	end_date?: Date | string | null;
	status?: 'Aktiv' | 'Beendet';
}

/**
 * Parses a date string or Date object to a Date object
 */
function parseDate(date: Date | string): Date {
	if (date instanceof Date) return date;
	return new Date(date);
}

/**
 * Formats a Date to YYYY-MM-DD string
 */
function formatDate(date: Date): string {
	return date.toISOString().split('T')[0];
}

/**
 * Adds one day to a date
 */
function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

/**
 * Formats a date as DD.MM.YYYY for user display
 */
function formatDateDE(date: Date): string {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}.${month}.${year}`;
}

/**
 * Computes the availability of an apartment based on existing contracts
 *
 * @param contracts - Array of contracts for the apartment
 * @returns AvailabilityInfo object with availability status and details
 */
export function computeAvailability(contracts: ContractForAvailability[]): AvailabilityInfo {
	// No contracts means fully available
	if (contracts.length === 0) {
		return {
			isAvailable: true,
			availableFrom: null,
			hasOngoingContract: false,
			message: m.contracts_availability_available(),
			statusType: 'available'
		};
	}

	// Check for ongoing contracts (no end date or active status)
	const ongoingContracts = contracts.filter((c) => {
		// No end date means ongoing
		if (!c.end_date) return true;

		// If there's an end date, check if it's in the future
		const endDate = parseDate(c.end_date);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return endDate >= today;
	});

	// If there's an ongoing contract without end date, apartment is blocked
	const unlimitedContract = ongoingContracts.find((c) => !c.end_date);
	if (unlimitedContract) {
		return {
			isAvailable: false,
			availableFrom: null,
			hasOngoingContract: true,
			message: m.contracts_availability_blocked(),
			statusType: 'blocked'
		};
	}

	// Find the latest end date among all contracts
	let latestEndDate: Date | null = null;
	for (const contract of contracts) {
		if (contract.end_date) {
			const endDate = parseDate(contract.end_date);
			if (!latestEndDate || endDate > latestEndDate) {
				latestEndDate = endDate;
			}
		}
	}

	// If there's a latest end date, apartment is available from the day after
	if (latestEndDate) {
		const availableFromDate = addDays(latestEndDate, 1);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// If available date is in the past or today, apartment is fully available
		if (availableFromDate <= today) {
			return {
				isAvailable: true,
				availableFrom: null,
				hasOngoingContract: false,
				message: m.contracts_availability_available(),
				statusType: 'available'
			};
		}

		// Available from a future date
		return {
			isAvailable: true,
			availableFrom: formatDate(availableFromDate),
			hasOngoingContract: false,
			message: m.contracts_availability_from({ date: formatDateDE(availableFromDate) }),
			statusType: 'available-from'
		};
	}

	// Fallback: fully available
	return {
		isAvailable: true,
		availableFrom: null,
		hasOngoingContract: false,
		message: m.contracts_availability_available(),
		statusType: 'available'
	};
}

/**
 * Checks if a proposed contract date range overlaps with existing contracts
 *
 * @param startDate - Proposed start date (YYYY-MM-DD)
 * @param endDate - Proposed end date (YYYY-MM-DD), null for unlimited
 * @param contracts - Array of existing contracts
 * @param excludeContractId - Optional contract ID to exclude
 * @returns Object with overlap status and message
 */
export function checkDateRangeOverlap(
	startDate: string,
	endDate: string | null,
	contracts: ContractForAvailability[],
	excludeContractId?: string
): { hasOverlap: boolean; message: string | null } {
	// Filter out the excluded contract
	const relevantContracts = excludeContractId
		? contracts.filter((c) => c.id !== excludeContractId)
		: contracts;

	if (relevantContracts.length === 0) {
		return { hasOverlap: false, message: null };
	}

	const proposedStart = new Date(startDate);
	// For unlimited contracts, use a far future date for comparison
	const proposedEnd = endDate ? new Date(endDate) : new Date('9999-12-31');

	for (const contract of relevantContracts) {
		const contractStart = parseDate(contract.start_date);
		const contractEnd = contract.end_date ? parseDate(contract.end_date) : new Date('9999-12-31');

		// Check for overlap: ranges overlap if one starts before the other ends
		// and the other starts before the first one ends
		const overlaps = proposedStart <= contractEnd && contractStart <= proposedEnd;

		if (overlaps) {
			const periodStr = contract.end_date
				? `${formatDateDE(contractStart)} - ${formatDateDE(contractEnd)}`
				: m.contracts_overlap_open_ended({ date: formatDateDE(contractStart) });

			return {
				hasOverlap: true,
				message: m.contracts_overlap({ period: periodStr })
			};
		}
	}

	return { hasOverlap: false, message: null };
}
