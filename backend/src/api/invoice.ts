/**
 * The rows of `GET /invoices` and `GET /invoices/latest-keys` and the answer of `GET /invoices/:id`: the service checks them against this type, the
 * BFF maps them and the frontend takes its types from them (#837, ADR 0005). Only types of `schema.ts` here
 */

import type { Category, DistributionKey, Invoice, InvoiceDocument } from '../db/schema';

type Names = 'id' | 'name' | 'nameDE';

/** A Leistungszeitraum's part in a period and its amount; a receipt reaching beyond it keeps its whole (#241, #454) */
export interface InPeriod {
	start: string;
	end: string;
	amount: number;
	noPeriod?: true; // no Leistungszeitraum: the whole period by its Rechnungsdatum
	whole?: { start: string; end: string; amount: number };
}

/** Per building and category the Verteilschlüssel of the latest invoice with one (`GET /invoices/latest-keys`, #379) */
export interface LatestKey {
	buildingId: string;
	categoryId: string;
	distributionKeyId: string;
}

export interface InvoiceWithDetails extends Invoice {
	building: { id: string; name: string; address: string } | null;
	category: Pick<Category, Names | 'isAllowedUtilityCost' | 'isHeatingCost' | 'type'> | null;
	distributionKey: Pick<DistributionKey, Names> | null;
	llmCategory: Pick<Category, Names> | null;
	beleg: Pick<InvoiceDocument, 'fileName' | 'mimeType' | 'deductedAmount' | 'nonAllocableItems'> | null;
	inPeriod?: InPeriod; // only in a list filtered by an Abrechnungsperiode (#454)
}
