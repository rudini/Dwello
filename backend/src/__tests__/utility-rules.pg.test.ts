/**
 * Swiss utility cost rules (GET /invoices/utility-rules): categories as the master data in the real database holds them
 */

import { describe, it, expect } from 'bun:test';
import { getUtilityCostRules } from '../services/utility-validation.service';

describe('Utility Validation Service', () => {
	describe('getUtilityCostRules', () => {
		it('should return max management fee of 3%', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.maxManagementFeePercent).toBe(3.0);
		});

		it('should include allowed categories', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.allowedCategories).toBeDefined();
			expect(Array.isArray(rules.allowedCategories)).toBe(true);
		});

		it('should include not allowed categories', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.notAllowedCategories).toBeDefined();
			expect(Array.isArray(rules.notAllowedCategories)).toBe(true);
		});

		it('should include compliance notes in German', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.notes).toBeDefined();
			expect(rules.notes.length).toBeGreaterThan(0);
			// Check for key Swiss rules
			expect(rules.notes.some(n => n.includes('3%'))).toBe(true);
		});
	});

	describe('getUtilityCostRules - detailed checks', () => {
		it('should include heating in allowed categories', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.allowedCategories.some(c => c.toLowerCase().includes('heiz'))).toBe(true);
		});

		it('should include water in allowed categories', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.allowedCategories.some(c => c.toLowerCase().includes('wasser'))).toBe(true);
		});

		it('should include repairs in not allowed categories', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.notAllowedCategories.some(c => c.toLowerCase().includes('reparatur'))).toBe(true);
		});

		it('should include taxes in not allowed categories', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.notAllowedCategories.some(c => c.toLowerCase().includes('steuer'))).toBe(true);
		});
	});

	describe('getUtilityCostRules - detailed structure', () => {
		it('should return all required fields', async () => {
			const rules = await getUtilityCostRules();
			expect(rules).toHaveProperty('maxManagementFeePercent');
			expect(rules).toHaveProperty('allowedCategories');
			expect(rules).toHaveProperty('notAllowedCategories');
			expect(rules).toHaveProperty('notes');
		});

		it('should have non-empty allowed categories', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.allowedCategories.length).toBeGreaterThan(0);
		});

		it('should have non-empty not allowed categories', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.notAllowedCategories.length).toBeGreaterThan(0);
		});

		it('should include elevator in allowed', async () => {
			const rules = await getUtilityCostRules();
			const hasElevator = rules.allowedCategories.some(c =>
				c.toLowerCase().includes('aufzug') || c.toLowerCase().includes('lift')
			);
			expect(hasElevator).toBe(true);
		});

		it('should include caretaker/Hauswart in allowed', async () => {
			const rules = await getUtilityCostRules();
			const hasCaretaker = rules.allowedCategories.some(c =>
				c.toLowerCase().includes('hauswart') || c.toLowerCase().includes('concierge')
			);
			expect(hasCaretaker).toBe(true);
		});

		it('notes should be in German', async () => {
			const rules = await getUtilityCostRules();
			// Check for German-specific characters or words
			const hasGerman = rules.notes.some(n =>
				n.includes('Nebenkosten') ||
				n.includes('Verwaltungskosten') ||
				n.includes('Mietvertrag')
			);
			expect(hasGerman).toBe(true);
		});

		it('notes should mention the 3% rule', async () => {
			const rules = await getUtilityCostRules();
			const mentions3Percent = rules.notes.some(n => n.includes('3%'));
			expect(mentions3Percent).toBe(true);
		});

		it('notes should mention repairs are not allowed', async () => {
			const rules = await getUtilityCostRules();
			const mentionsRepairs = rules.notes.some(n =>
				n.toLowerCase().includes('reparatur')
			);
			expect(mentionsRepairs).toBe(true);
		});

		it('führt Verwaltung als nicht umlagefähig, wie die Kategorie Administration', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.notAllowedCategories).toContain('Verwaltung');
			expect(rules.allowedCategories).not.toContain('Verwaltung');
		});

		it('folgt den Stammdaten: Schädlingsbekämpfung ist nicht umlagefähig', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.notAllowedCategories).toContain('Schädlingsbekämpfung');
			expect(rules.allowedCategories).not.toContain('Schädlingsbekämpfung');
		});

		it('nennt 3% als Richtwert, nicht als Obergrenze', async () => {
			const rules = await getUtilityCostRules();
			expect(rules.notes.some(n => n.includes('maximal'))).toBe(false);
		});
	});
});
