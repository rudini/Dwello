/**
 * The rows of `GET /heating-profiles` and the answer of `GET /heating-profiles/:id` (#837, ADR 0005). Only types of
 * `schema.ts` here
 */

import type { HeatingProfile } from '../db/schema';

/** A type, not an interface: the frontend passes it on as a record of numbers */
export type MonthlyPercentages = {
	january: number;
	february: number;
	march: number;
	april: number;
	may: number;
	june: number;
	july: number;
	august: number;
	september: number;
	october: number;
	november: number;
	december: number;
};

/** A single profile with its monthly shares as numbers */
export interface HeatingProfileDetails extends HeatingProfile {
	monthlyPercentages: MonthlyPercentages;
}
