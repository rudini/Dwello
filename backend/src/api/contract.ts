/**
 * The rows of `GET /contracts` and the answer of `GET /contracts/:id`: the services check theirs against them, the BFF
 * maps them and the frontend takes its types from them (#837, ADR 0005). Only types of `schema.ts` and `api/` here
 */

import type { Apartment, RentalContract, Tenant } from '../db/schema';
import type { ApartmentStatus } from './apartment';
import type { BuildingAddress } from './building';

/** The Vertragsstatus, by the Swiss day (#784, #815) */
export type ContractStatus = 'active' | 'ended' | 'future';

/** A contract with the names of its tenant, apartment and building */
export interface ContractWithDetails extends RentalContract {
	status: ContractStatus;
	tenantName: string;
	tenantEmail: string | null;
	apartmentNumber: string;
	buildingId: string;
	buildingName: string;
	buildingAddress: string;
	oldAddress: boolean; // A-5: a moved-out tenant still has the building's address
}

/** One contract with its tenant, apartment and building */
export interface ContractDetails extends ContractWithDetails {
	tenant: Pick<Tenant, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'language'>;
	apartment: Pick<Apartment, 'id' | 'buildingId' | 'number' | 'floor' | 'area' | 'rooms'> & { status: ApartmentStatus };
	building: BuildingAddress;
}

/** The answer of `GET /contracts/:id` */
export interface ContractResponse extends ContractDetails {
	agreedCategoryIds: string[]; // #91
	agreedFrom: Record<string, string>; // «Vereinbart ab» per category (#368)
	advancePayments: { validFrom: string; amount: string }[]; // each Akonto with its «Gültig ab» (#464)
	proposedAdvanceFrom: string | null; // #464, #815
	nextSteps: { successor: boolean; ended: boolean } | null; // A-4, A-5
	fixedTermCheck: boolean; // A-6
	endsToday: boolean; // #815
}
