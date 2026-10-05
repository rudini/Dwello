/**
 * Integration tests for utility validation service async functions
 * Uses mocked database dependencies
 */

import { describe, it, expect, mock, beforeEach } from 'bun:test';

// Mock the category service before importing utility validation service
const mockGetCategory = mock((): Promise<unknown> => Promise.resolve(null));

mock.module('../services/category.service', () => ({
	getCategory: mockGetCategory
}));

// Now import the service under test
import {
	isAllowedUtilityCost,
	validateInvoiceForUtilityStatement,
	validateInvoicesForStatement
} from '../services/utility-validation.service';

describe('Utility Validation Service - Async Functions', () => {
	beforeEach(() => {
		mockGetCategory.mockClear();
	});

	describe('isAllowedUtilityCost', () => {
		it('should return false when category not found', async () => {
			mockGetCategory.mockResolvedValue(null);

			const result = await isAllowedUtilityCost('cat-1');

			expect(result).toBe(false);
			expect(mockGetCategory).toHaveBeenCalledWith('cat-1');
		});

		it('should return true when category allows utility costs', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				name: 'Heizung',
				isAllowedUtilityCost: true
			});

			const result = await isAllowedUtilityCost('cat-1');

			expect(result).toBe(true);
		});

		it('should return false when category does not allow utility costs', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				name: 'Reparaturen',
				isAllowedUtilityCost: false
			});

			const result = await isAllowedUtilityCost('cat-1');

			expect(result).toBe(false);
		});
	});

	describe('validateInvoiceForUtilityStatement', () => {
		it('should return error when invoice is not marked as valid utility cost', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const result = await validateInvoiceForUtilityStatement({
				categoryId: 'cat-1',
				amount: 100,
				isValidUtilityCost: false,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Rechnung ist nicht als gültige Nebenkosten markiert');
		});

		it('should return error when no category assigned', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: null,
				amount: 100,
				isValidUtilityCost: true,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Rechnung hat keine Kategorie zugewiesen');
		});

		it('should return error when category is not allowed', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: false
			});

			const result = await validateInvoiceForUtilityStatement({
				categoryId: 'cat-1',
				amount: 100,
				isValidUtilityCost: true,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(false);
			expect(result.errors.some(e => e.includes('nicht umlagefähig'))).toBe(true);
		});

		it('should return error for zero amount', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const result = await validateInvoiceForUtilityStatement({
				categoryId: 'cat-1',
				amount: 0,
				isValidUtilityCost: true,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(false);
			expect(result.errors.some(e => e.includes('grösser als 0'))).toBe(true);
		});

		it('should return error for negative amount', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const result = await validateInvoiceForUtilityStatement({
				categoryId: 'cat-1',
				amount: -100,
				isValidUtilityCost: true,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(false);
		});

		it('should return error for NaN amount', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const result = await validateInvoiceForUtilityStatement({
				categoryId: 'cat-1',
				amount: 'invalid' as any,
				isValidUtilityCost: true,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(false);
		});

		it('should handle string amount', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const result = await validateInvoiceForUtilityStatement({
				categoryId: 'cat-1',
				amount: '100.50',
				isValidUtilityCost: true,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(true);
		});

		it('should return valid for correct invoice', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const result = await validateInvoiceForUtilityStatement({
				categoryId: 'cat-1',
				amount: 100,
				isValidUtilityCost: true,
				description: 'Heating costs'
			});

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should warn for suspicious keyword: reparatur', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const result = await validateInvoiceForUtilityStatement({
				categoryId: 'cat-1',
				amount: 100,
				isValidUtilityCost: true,
				description: 'Reparatur der Heizung'
			});

			expect(result.warnings.some(w => w.includes('reparatur'))).toBe(true);
		});

		it('should warn for suspicious keyword: renovation', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const result = await validateInvoiceForUtilityStatement({
				categoryId: 'cat-1',
				amount: 100,
				isValidUtilityCost: true,
				description: 'Renovation des Badezimmers'
			});

			expect(result.warnings.some(w => w.includes('renovation'))).toBe(true);
		});

		it('should warn for suspicious keyword: steuer', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const result = await validateInvoiceForUtilityStatement({
				categoryId: 'cat-1',
				amount: 100,
				isValidUtilityCost: true,
				description: 'Grundsteuer 2024'
			});

			expect(result.warnings.some(w => w.includes('steuer'))).toBe(true);
		});

		it('should warn for suspicious keyword: hypothek', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const result = await validateInvoiceForUtilityStatement({
				categoryId: 'cat-1',
				amount: 100,
				isValidUtilityCost: true,
				description: 'Hypothekarzins Q1'
			});

			expect(result.warnings.some(w => w.includes('hypothek'))).toBe(true);
		});

		it('should accumulate multiple warnings', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const result = await validateInvoiceForUtilityStatement({
				categoryId: 'cat-1',
				amount: 100,
				isValidUtilityCost: true,
				description: 'Reparatur und Renovation Steuer'
			});

			expect(result.warnings.length).toBeGreaterThanOrEqual(3);
		});
	});

	describe('validateInvoicesForStatement', () => {
		it('should return empty arrays for no invoices', async () => {
			const result = await validateInvoicesForStatement([]);

			expect(result.validInvoices).toHaveLength(0);
			expect(result.invalidInvoices).toHaveLength(0);
			expect(result.warnings).toHaveLength(0);
			expect(result.totalValidAmount).toBe(0);
		});

		it('should separate valid and invalid invoices', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const invoices = [
				{
					id: 'inv-1',
					categoryId: 'cat-1',
					amount: 100,
					isValidUtilityCost: true,
					description: 'Valid invoice'
				},
				{
					id: 'inv-2',
					categoryId: 'cat-1',
					amount: 200,
					isValidUtilityCost: false, // Invalid
					description: 'Invalid invoice'
				}
			];

			const result = await validateInvoicesForStatement(invoices);

			expect(result.validInvoices).toContain('inv-1');
			expect(result.invalidInvoices.some(i => i.id === 'inv-2')).toBe(true);
		});

		it('should calculate total valid amount', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const invoices = [
				{
					id: 'inv-1',
					categoryId: 'cat-1',
					amount: 100,
					isValidUtilityCost: true,
					description: 'Invoice 1'
				},
				{
					id: 'inv-2',
					categoryId: 'cat-1',
					amount: 250.50,
					isValidUtilityCost: true,
					description: 'Invoice 2'
				}
			];

			const result = await validateInvoicesForStatement(invoices);

			expect(result.totalValidAmount).toBe(350.50);
		});

		it('should handle string amounts', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const invoices = [
				{
					id: 'inv-1',
					categoryId: 'cat-1',
					amount: '100.25',
					isValidUtilityCost: true,
					description: 'Invoice 1'
				}
			];

			const result = await validateInvoicesForStatement(invoices);

			expect(result.totalValidAmount).toBe(100.25);
		});

		it('should collect warnings from all invoices', async () => {
			mockGetCategory.mockResolvedValue({
				id: 'cat-1',
				isAllowedUtilityCost: true
			});

			const invoices = [
				{
					id: 'inv-1',
					categoryId: 'cat-1',
					amount: 100,
					isValidUtilityCost: true,
					description: 'Reparatur invoice'
				},
				{
					id: 'inv-2',
					categoryId: 'cat-1',
					amount: 200,
					isValidUtilityCost: true,
					description: 'Renovation invoice'
				}
			];

			const result = await validateInvoicesForStatement(invoices);

			expect(result.warnings.length).toBe(2);
			expect(result.warnings.some(w => w.id === 'inv-1')).toBe(true);
			expect(result.warnings.some(w => w.id === 'inv-2')).toBe(true);
		});

		it('should include error details for invalid invoices', async () => {
			mockGetCategory.mockResolvedValue(null);

			const invoices = [
				{
					id: 'inv-1',
					categoryId: 'cat-1',
					amount: 100,
					isValidUtilityCost: true,
					description: 'Invoice'
				}
			];

			const result = await validateInvoicesForStatement(invoices);

			expect(result.invalidInvoices).toHaveLength(1);
			expect(result.invalidInvoices[0].errors.length).toBeGreaterThan(0);
		});

		it('should handle mixed valid, invalid, and warning invoices', async () => {
			// First call for cat-1 (allowed), second for cat-2 (not allowed)
			mockGetCategory
				.mockResolvedValueOnce({ id: 'cat-1', isAllowedUtilityCost: true })
				.mockResolvedValueOnce({ id: 'cat-2', isAllowedUtilityCost: false })
				.mockResolvedValueOnce({ id: 'cat-1', isAllowedUtilityCost: true });

			const invoices = [
				{
					id: 'inv-1',
					categoryId: 'cat-1',
					amount: 100,
					isValidUtilityCost: true,
					description: 'Valid invoice'
				},
				{
					id: 'inv-2',
					categoryId: 'cat-2',
					amount: 200,
					isValidUtilityCost: true,
					description: 'Invalid category'
				},
				{
					id: 'inv-3',
					categoryId: 'cat-1',
					amount: 300,
					isValidUtilityCost: true,
					description: 'Reparatur warning'
				}
			];

			const result = await validateInvoicesForStatement(invoices);

			expect(result.validInvoices).toContain('inv-1');
			expect(result.validInvoices).toContain('inv-3');
			expect(result.invalidInvoices.some(i => i.id === 'inv-2')).toBe(true);
			expect(result.warnings.some(w => w.id === 'inv-3')).toBe(true);
			expect(result.totalValidAmount).toBe(400); // inv-1 + inv-3
		});
	});
});
