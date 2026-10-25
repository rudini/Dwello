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
	tenant_id?: string; // the wizard names a tenant's open-ended contract (#156)
}

/**
 * Parses a date string or Date object to a Date object
 */
function parseDate(date: Date | string): Date {
	if (date instanceof Date) return date;
	return new Date(date);
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
 * The availability of an apartment for a new contract, as the backend decides it by the Swiss day (#815): an
 * open-ended contract blocks it; otherwise it is free from the day after its latest Vertragsende, or now
 */
export function computeAvailability(apartment: {
	blocked?: boolean;
	availableFrom?: string | null;
}): AvailabilityInfo {
	if (apartment.blocked)
		return {
			isAvailable: false,
			availableFrom: null,
			hasOngoingContract: true,
			message: m.contracts_availability_blocked(),
			statusType: 'blocked'
		};
	if (apartment.availableFrom)
		return {
			isAvailable: true,
			availableFrom: apartment.availableFrom,
			hasOngoingContract: false,
			message: m.contracts_availability_from({
				date: formatDateDE(parseDate(apartment.availableFrom))
			}),
			statusType: 'available-from'
		};
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
