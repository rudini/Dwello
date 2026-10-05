/**
 * Validating invoices for a utility statement against the categories in the real PostgreSQL database
 */

import { beforeAll, describe, it, expect } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories } from '../db/schema';
import {
	isAllowedUtilityCost,
	validateInvoiceForUtilityStatement,
	validateInvoicesForStatement
} from '../services/utility-validation.service';

// Predefined categories (migrations): caretaker costs may be passed on to tenants, repairs may not
let allowed: string;
let notAllowed: string;
const unknown = crypto.randomUUID();

const categoryId = async (name: string) =>
	(await db.select().from(categories).where(eq(categories.name, name)))[0].id;

beforeAll(async () => {
	allowed = await categoryId('Caretaker');
	notAllowed = await categoryId('Repairs');
});

describe('Utility Validation Service - Async Functions', () => {
	describe('isAllowedUtilityCost', () => {
		it('should return false when category not found', async () => {
			const result = await isAllowedUtilityCost(unknown);

			expect(result).toBe(false);
		});

		it('should return true when category allows utility costs', async () => {
			const result = await isAllowedUtilityCost(allowed);

			expect(result).toBe(true);
		});

		it('should return false when category does not allow utility costs', async () => {
			const result = await isAllowedUtilityCost(notAllowed);

			expect(result).toBe(false);
		});
	});

	describe('validateInvoiceForUtilityStatement', () => {
		it('should return error when invoice is not marked as valid utility cost', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: allowed,
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
			const result = await validateInvoiceForUtilityStatement({
				categoryId: notAllowed,
				amount: 100,
				isValidUtilityCost: true,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(false);
			expect(result.errors.some((e) => e.includes('nicht umlagefähig'))).toBe(true);
		});

		it('should return error for zero amount', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: allowed,
				amount: 0,
				isValidUtilityCost: true,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(false);
			expect(result.errors.some((e) => e.includes('grösser als 0'))).toBe(true);
		});

		it('should return error for negative amount', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: allowed,
				amount: -100,
				isValidUtilityCost: true,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(false);
		});

		it('should return error for NaN amount', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: allowed,
				amount: 'invalid',
				isValidUtilityCost: true,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(false);
		});

		it('should handle string amount', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: allowed,
				amount: '100.50',
				isValidUtilityCost: true,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(true);
		});

		it('should return valid for correct invoice', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: allowed,
				amount: 100,
				isValidUtilityCost: true,
				description: 'Heating costs'
			});

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should warn for suspicious keyword: reparatur', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: allowed,
				amount: 100,
				isValidUtilityCost: true,
				description: 'Reparatur der Heizung'
			});

			expect(result.warnings.some((w) => w.includes('reparatur'))).toBe(true);
		});

		it('should warn for suspicious keyword: renovation', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: allowed,
				amount: 100,
				isValidUtilityCost: true,
				description: 'Renovation des Badezimmers'
			});

			expect(result.warnings.some((w) => w.includes('renovation'))).toBe(true);
		});

		it('should warn for suspicious keyword: steuer', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: allowed,
				amount: 100,
				isValidUtilityCost: true,
				description: 'Grundsteuer 2024'
			});

			expect(result.warnings.some((w) => w.includes('steuer'))).toBe(true);
		});

		it('should warn for suspicious keyword: hypothek', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: allowed,
				amount: 100,
				isValidUtilityCost: true,
				description: 'Hypothekarzins Q1'
			});

			expect(result.warnings.some((w) => w.includes('hypothek'))).toBe(true);
		});

		it('should accumulate multiple warnings', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: allowed,
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
			const invoices = [
				{
					id: 'inv-1',
					categoryId: allowed,
					amount: 100,
					isValidUtilityCost: true,
					description: 'Valid invoice'
				},
				{
					id: 'inv-2',
					categoryId: allowed,
					amount: 200,
					isValidUtilityCost: false, // Invalid
					description: 'Invalid invoice'
				}
			];

			const result = await validateInvoicesForStatement(invoices);

			expect(result.validInvoices).toContain('inv-1');
			expect(result.invalidInvoices.some((i) => i.id === 'inv-2')).toBe(true);
		});

		it('should calculate total valid amount', async () => {
			const invoices = [
				{
					id: 'inv-1',
					categoryId: allowed,
					amount: 100,
					isValidUtilityCost: true,
					description: 'Invoice 1'
				},
				{
					id: 'inv-2',
					categoryId: allowed,
					amount: 250.5,
					isValidUtilityCost: true,
					description: 'Invoice 2'
				}
			];

			const result = await validateInvoicesForStatement(invoices);

			expect(result.totalValidAmount).toBe(350.5);
		});

		it('should handle string amounts', async () => {
			const invoices = [
				{
					id: 'inv-1',
					categoryId: allowed,
					amount: '100.25',
					isValidUtilityCost: true,
					description: 'Invoice 1'
				}
			];

			const result = await validateInvoicesForStatement(invoices);

			expect(result.totalValidAmount).toBe(100.25);
		});

		it('should collect warnings from all invoices', async () => {
			const invoices = [
				{
					id: 'inv-1',
					categoryId: allowed,
					amount: 100,
					isValidUtilityCost: true,
					description: 'Reparatur invoice'
				},
				{
					id: 'inv-2',
					categoryId: allowed,
					amount: 200,
					isValidUtilityCost: true,
					description: 'Renovation invoice'
				}
			];

			const result = await validateInvoicesForStatement(invoices);

			expect(result.warnings.length).toBe(2);
			expect(result.warnings.some((w) => w.id === 'inv-1')).toBe(true);
			expect(result.warnings.some((w) => w.id === 'inv-2')).toBe(true);
		});

		it('should include error details for invalid invoices', async () => {
			const invoices = [
				{
					id: 'inv-1',
					categoryId: unknown,
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
			const invoices = [
				{
					id: 'inv-1',
					categoryId: allowed,
					amount: 100,
					isValidUtilityCost: true,
					description: 'Valid invoice'
				},
				{
					id: 'inv-2',
					categoryId: notAllowed,
					amount: 200,
					isValidUtilityCost: true,
					description: 'Invalid category'
				},
				{
					id: 'inv-3',
					categoryId: allowed,
					amount: 300,
					isValidUtilityCost: true,
					description: 'Reparatur warning'
				}
			];

			const result = await validateInvoicesForStatement(invoices);

			expect(result.validInvoices).toContain('inv-1');
			expect(result.validInvoices).toContain('inv-3');
			expect(result.invalidInvoices.some((i) => i.id === 'inv-2')).toBe(true);
			expect(result.warnings.some((w) => w.id === 'inv-3')).toBe(true);
			expect(result.totalValidAmount).toBe(400); // inv-1 + inv-3
		});
	});
});
