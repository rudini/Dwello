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
	/** #1088: the building has a statement, so its Abrechnungsperiode stays as it is (only `GET /buildings/:id`) */
	accountingPeriodLocked?: boolean;
	/** #1103: the last ended Abrechnungsperiode (its end the Tankbestand's Stichtag) and the next (only `GET /buildings/:id`) */
	stockPeriods?: { ended: { start: string; end: string }; next: { start: string; end: string } };
}
