/**
 * Contract Availability Utility
 * Computes apartment availability based on existing contracts
 */

import { m } from '$lib/paraglide/messages';
import type { RentalContract } from '$lib/types';

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
	// an overlap names the other contract (#667)
	tenant_name?: string;
	tenant_anonymised?: boolean;
	terminated?: boolean;
	byAgreement?: boolean; // #1148
	contract_status?: RentalContract['status']; // by the Swiss day, as the backend says (#815)
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
 * The earliest existing contract the proposed range overlaps, as the backend names it (fach review b667 V-3); none when
 * it overlaps none. `endDate` null: unlimited; `excludeContractId`: the contract being edited
 */
export function checkDateRangeOverlap(
	startDate: string,
	endDate: string | null,
	contracts: ContractForAvailability[],
	excludeContractId?: string
): ContractForAvailability | undefined {
	const proposedStart = new Date(startDate);
	const proposedEnd = endDate ? new Date(endDate) : new Date('9999-12-31');
	return contracts
		.filter((c) => c.id !== excludeContractId)
		.sort((a, b) => +parseDate(a.start_date) - +parseDate(b.start_date))
		.find((contract) => {
			const contractEnd = contract.end_date ? parseDate(contract.end_date) : new Date('9999-12-31');
			return proposedStart <= contractEnd && parseDate(contract.start_date) <= proposedEnd;
		});
}
