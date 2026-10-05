/**
 * Invoice Data Mapping - Regression Tests
 *
 * Verifies fix for: billingEntity (Lieferant) not showing on invoice
 * detail and edit pages. The backend returns the supplier name as
 * `billingEntityName`, the frontend type uses `billingEntity` (toInvoice).
 */

import { describe, it, expect } from 'vitest';
import { toInvoice } from '$lib/server/invoice';

const supplier = (backendData: Record<string, unknown>) => toInvoice(backendData).billingEntity;

describe('Invoice billingEntity mapping', () => {
	it('maps billingEntityName from backend response', () => {
		expect(supplier({ billingEntityName: 'Energie Zürich AG' })).toBe('Energie Zürich AG');
	});

	it('falls back to billingEntity if billingEntityName is missing', () => {
		expect(supplier({ billingEntity: 'Energie Zürich AG' })).toBe('Energie Zürich AG');
	});

	it('prefers billingEntityName over billingEntity when both exist', () => {
		expect(supplier({ billingEntityName: 'Correct Name', billingEntity: 'Old Name' })).toBe('Correct Name');
	});

	it('returns empty string when neither field exists', () => {
		expect(supplier({ id: '123', amount: 100 })).toBe('');
	});

	it('returns empty string when billingEntityName is null', () => {
		expect(supplier({ billingEntityName: null })).toBe('');
	});
});
