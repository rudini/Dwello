/**
 * The rows of `GET /categories` and the answers of `GET /categories/:id` and `POST /categories/propose`: the service
 * checks them against this type, the BFF maps them and the frontend takes its types from them (#837, ADR 0005). Only
 * types of `schema.ts` here
 */

import type { Category } from '../db/schema';

export interface CategoryWithUsage extends Category {
	invoiceCount: string; // COUNT(*) is a bigint, which arrives as text
	allocableInvoiceCount?: number; // only the single category (#309)
}

/** Whether a new category's costs may be passed on, as the KI judges it (#186) */
export interface AllocabilityProposal {
	isAllowedUtilityCost: boolean;
	reasoning: string;
}
