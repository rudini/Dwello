/**
 * The answers of `GET /tenants` and `GET /tenants/:id` (#837, ADR 0005: only types of `schema.ts` here); the frontend
 * derives its `Tenant` and `TenantListItem` from them
 */

import type { Tenant } from '../db/schema';

interface TenantWithCounts extends Tenant {
	contractCount: number;
	isFuture: boolean; // no contract runs today, one is signed for later (F-4, #58)
	rentalContractId?: string;
	currentApartment?: string | null; // the apartment number of the contract running today
	currentBuilding?: string | null;
}

/** A row of `GET /tenants` */
export interface TenantWithOccupancy extends TenantWithCounts {
	isActive: boolean; // a contract runs today
}

/** The answer of `GET /tenants/:id` */
export interface TenantResponse extends TenantWithCounts {
	anonymisableFrom: string | null;
	anonymisable: boolean;
}
