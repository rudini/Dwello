/**
 * The rows of `GET /distribution-keys` and the answer of `GET /distribution-keys/:id` (#837, ADR 0005). Only types of
 * `schema.ts` here
 */

import type { DistributionKey } from '../db/schema';

/** Dwello's own master data record or one the landlord added (distribution keys, heating profiles) */
export type MasterDataType = 'predefined' | 'custom';

export interface DistributionKeyWithUsage extends DistributionKey {
	invoiceCount: string; // COUNT(*) is a bigint, which arrives as text
}
