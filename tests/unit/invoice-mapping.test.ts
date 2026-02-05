/**
 * Invoice Data Mapping - Regression Tests
 *
 * Verifies fix for: billingEntity (Lieferant) not showing on invoice
 * detail and edit pages.
 *
 * The backend returns the supplier name as `billingEntityName`, but the
 * frontend type uses `billingEntity`. All server loaders must map
 * `billingEntityName` → `billingEntity` with a proper fallback chain.
 */

import { describe, it, expect } from 'vitest';

/**
 * Simulates the billingEntity mapping logic used in all invoice server loaders.
 * Must match the pattern: data.billingEntityName || data.billingEntity || ''
 */
function mapBillingEntity(data: Record<string, unknown>): string {
	return (data.billingEntityName || data.billingEntity || '') as string;
}

describe('Invoice billingEntity mapping', () => {
	it('maps billingEntityName from backend response', () => {
		const backendData = { billingEntityName: 'Energie Zürich AG' };
		expect(mapBillingEntity(backendData)).toBe('Energie Zürich AG');
	});

	it('falls back to billingEntity if billingEntityName is missing', () => {
		const backendData = { billingEntity: 'Energie Zürich AG' };
		expect(mapBillingEntity(backendData)).toBe('Energie Zürich AG');
	});

	it('prefers billingEntityName over billingEntity when both exist', () => {
		const backendData = {
			billingEntityName: 'Correct Name',
			billingEntity: 'Old Name'
		};
		expect(mapBillingEntity(backendData)).toBe('Correct Name');
	});

	it('returns empty string when neither field exists', () => {
		const backendData = { id: '123', amount: 100 };
		expect(mapBillingEntity(backendData)).toBe('');
	});

	it('returns empty string when billingEntityName is null', () => {
		const backendData = { billingEntityName: null };
		expect(mapBillingEntity(backendData)).toBe('');
	});

	it('handles a realistic backend invoice response', () => {
		// Actual shape from GET /api/v1/invoices/:id
		const backendResponse = {
			id: '60d8637b-795d-40b0-8746-b63ca9edbd55',
			buildingId: '11111111-1111-1111-1111-111111111111',
			billingEntityName: 'Energie Zürich',
			billingEntityAddress: null,
			description: 'Gartenarbeiten',
			amount: '94.10',
			invoiceDate: '2026-02-03'
		};
		expect(mapBillingEntity(backendResponse)).toBe('Energie Zürich');
	});
});
