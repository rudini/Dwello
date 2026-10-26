import type { InvoiceRow } from '$lib/server/invoice';

/** A backend invoice as the BFF receives it; the contracts in tests/contracts hold only the fields the API checks */
export const invoiceRow = (r: object) => r as InvoiceRow;
