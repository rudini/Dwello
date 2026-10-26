/**
 * The rows of `GET /buildings` and the answer of `GET /buildings/:id` (#837, ADR 0005). Only types of `schema.ts` here
 */

import type { Building } from '../db/schema';

/** A building as a page names it: name and address */
export type BuildingAddress = Pick<Building, 'id' | 'name' | 'address' | 'postalCode' | 'city' | 'canton'>;

export interface BuildingWithStats extends Building {
	apartmentCount: number;
	occupiedCount: number;
	vacantCount: number;
}
