/**
 * An apartment's Belegung and the rows of `GET /apartments` and the answer of `GET /apartments/:id` (#837, ADR 0005:
 * only types of `schema.ts` here)
 */

import type { Apartment, Building } from '../db/schema';

/** An apartment's Belegung, as the backend decides it by the Swiss day */
export type ApartmentStatus = 'occupied' | 'relet' | 'vacant' | 'reserved';

export interface ApartmentWithDetails extends Omit<Apartment, 'status'> {
	status: ApartmentStatus;
	buildingName: string;
	nextContractStart: string | null;
	currentContractEnd: string | null; // last day of the contract running today (A-4)
	lastContractEnd: string | null; // last day of the latest ended contract: «Leer seit» the day after (#145)
	blocked: boolean; // an open-ended contract: no new one can be recorded (#815)
	availableFrom: string | null; // the day after the latest Vertragsende while it is still to come (#815)
	// only the single apartment
	building?: Pick<Building, 'id' | 'name' | 'address' | 'postalCode' | 'city'>;
	currentTenantName?: string;
	currentContractId?: string;
	nextContractId?: string | null;
}
