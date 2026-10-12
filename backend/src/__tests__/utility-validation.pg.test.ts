/**
 * Validating invoices for a utility statement against the categories in the real PostgreSQL database
 */

import { beforeAll, describe, it, expect } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories } from '../db/schema';
import { validateInvoiceForUtilityStatement } from '../services/utility-validation.service';

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
	describe('Kategorie der Rechnung', () => {
		it('lehnt eine Rechnung mit unbekannter Kategorie als nicht umlagefähig ab', async () => {
			const result = await validateInvoiceForUtilityStatement({
				categoryId: unknown,
				amount: 100,
				isValidUtilityCost: true,
				description: 'Test invoice'
			});

			expect(result.isValid).toBe(false);
			expect(result.errors.some((e) => e.includes('nicht umlagefähig'))).toBe(true);
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

});
