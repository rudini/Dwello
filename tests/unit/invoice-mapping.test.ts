/**
 * Invoice Data Mapping - Regression Tests
 *
 * Verifies fix for: billingEntity (Lieferant) not showing on invoice
 * detail and edit pages. The backend returns the supplier name as
 * `billingEntityName`, the frontend type uses `billingEntity` (toInvoice).
 */

import { describe, it, expect } from 'vitest';
import { toInvoice } from '$lib/server/invoice';
import { invoiceRow } from '../../src/__tests__/helpers/invoice';

const supplier = (backendData: object) => toInvoice(invoiceRow(backendData)).billingEntity;

describe('Invoice billingEntity mapping', () => {
	it('maps billingEntityName from backend response', () => {
		expect(supplier({ billingEntityName: 'Energie Zürich AG' })).toBe('Energie Zürich AG');
	});
});
