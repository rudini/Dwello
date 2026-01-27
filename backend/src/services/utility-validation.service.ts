/**
 * Utility Validation Service
 * Swiss utility cost validation and compliance checking
 */

import { SWISS_UTILITY_CATEGORIES } from '../config/llm';
import { getCategory } from './category.service';

/**
 * Maximum management fee percentage per Swiss law
 */
export const MAX_MANAGEMENT_FEE_PERCENT = 3.0;

/**
 * Swiss Utility Cost Rules
 */
export interface UtilityCostRules {
	maxManagementFeePercent: number;
	allowedCategories: string[];
	notAllowedCategories: string[];
	notes: string[];
}

/**
 * Get Swiss utility cost compliance rules
 */
export function getUtilityCostRules(): UtilityCostRules {
	return {
		maxManagementFeePercent: MAX_MANAGEMENT_FEE_PERCENT,
		allowedCategories: SWISS_UTILITY_CATEGORIES.allowed,
		notAllowedCategories: SWISS_UTILITY_CATEGORIES.notAllowed,
		notes: [
			'Nebenkosten müssen verbrauchsabhängig oder nach Fläche verteilt werden',
			'Verwaltungskosten dürfen maximal 3% der Nebenkosten betragen',
			'Reparaturen und Renovationen sind keine umlagefähigen Nebenkosten',
			'Grundsteuern und Hypothekarzinsen sind nie umlagefähig',
			'Alle Nebenkosten müssen im Mietvertrag vereinbart sein'
		]
	};
}

/**
 * Check if a category is an allowed utility cost
 */
export async function isAllowedUtilityCost(categoryId: string): Promise<boolean> {
	const category = await getCategory(categoryId);
	if (!category) return false;

	return category.isAllowedUtilityCost;
}

/**
 * Validate an invoice for inclusion in utility statements
 */
export interface InvoiceValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
}

export async function validateInvoiceForUtilityStatement(invoice: {
	categoryId: string | null;
	amount: string | number;
	isValidUtilityCost: boolean;
	description: string;
}): Promise<InvoiceValidationResult> {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Check if invoice is marked as valid utility cost
	if (!invoice.isValidUtilityCost) {
		errors.push('Rechnung ist nicht als gültige Nebenkosten markiert');
	}

	// Check if category is assigned
	if (!invoice.categoryId) {
		errors.push('Rechnung hat keine Kategorie zugewiesen');
	} else {
		// Check if category allows utility cost inclusion
		const allowed = await isAllowedUtilityCost(invoice.categoryId);
		if (!allowed) {
			errors.push('Die Kategorie dieser Rechnung ist nicht umlagefähig gemäss Schweizer Mietrecht');
		}
	}

	// Check amount is positive
	const amount = typeof invoice.amount === 'string' ? parseFloat(invoice.amount) : invoice.amount;
	if (isNaN(amount) || amount <= 0) {
		errors.push('Rechnungsbetrag muss grösser als 0 sein');
	}

	// Check for suspicious keywords that might indicate non-utility costs
	const suspiciousKeywords = [
		'reparatur',
		'renovation',
		'umbau',
		'ersatz',
		'sanierung',
		'hypothek',
		'zins',
		'steuer',
		'grundsteuer'
	];

	const descLower = invoice.description.toLowerCase();
	for (const keyword of suspiciousKeywords) {
		if (descLower.includes(keyword)) {
			warnings.push(
				`Beschreibung enthält "${keyword}" - bitte prüfen ob umlagefähig`
			);
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings
	};
}

/**
 * Validate management fee amount
 */
export function validateManagementFee(
	managementFee: number,
	totalCosts: number
): { isValid: boolean; actualPercent: number; maxPercent: number; error?: string } {
	if (totalCosts <= 0) {
		return {
			isValid: managementFee === 0,
			actualPercent: 0,
			maxPercent: MAX_MANAGEMENT_FEE_PERCENT,
			error: managementFee > 0 ? 'Verwaltungskosten nur bei Nebenkosten erlaubt' : undefined
		};
	}

	const actualPercent = (managementFee / totalCosts) * 100;

	if (actualPercent > MAX_MANAGEMENT_FEE_PERCENT) {
		return {
			isValid: false,
			actualPercent,
			maxPercent: MAX_MANAGEMENT_FEE_PERCENT,
			error: `Verwaltungskosten (${actualPercent.toFixed(1)}%) überschreiten Maximum von ${MAX_MANAGEMENT_FEE_PERCENT}%`
		};
	}

	return {
		isValid: true,
		actualPercent,
		maxPercent: MAX_MANAGEMENT_FEE_PERCENT
	};
}

/**
 * Calculate maximum allowed management fee
 */
export function calculateMaxManagementFee(totalCosts: number): number {
	return (totalCosts * MAX_MANAGEMENT_FEE_PERCENT) / 100;
}

/**
 * Validate a batch of invoices for utility statement generation
 */
export async function validateInvoicesForStatement(
	invoices: Array<{
		id: string;
		categoryId: string | null;
		amount: string | number;
		isValidUtilityCost: boolean;
		description: string;
	}>
): Promise<{
	validInvoices: string[];
	invalidInvoices: Array<{ id: string; errors: string[] }>;
	warnings: Array<{ id: string; warnings: string[] }>;
	totalValidAmount: number;
}> {
	const validInvoices: string[] = [];
	const invalidInvoices: Array<{ id: string; errors: string[] }> = [];
	const allWarnings: Array<{ id: string; warnings: string[] }> = [];
	let totalValidAmount = 0;

	for (const invoice of invoices) {
		const result = await validateInvoiceForUtilityStatement(invoice);

		if (result.isValid) {
			validInvoices.push(invoice.id);
			const amount =
				typeof invoice.amount === 'string' ? parseFloat(invoice.amount) : invoice.amount;
			totalValidAmount += amount;
		} else {
			invalidInvoices.push({ id: invoice.id, errors: result.errors });
		}

		if (result.warnings.length > 0) {
			allWarnings.push({ id: invoice.id, warnings: result.warnings });
		}
	}

	return {
		validInvoices,
		invalidInvoices,
		warnings: allWarnings,
		totalValidAmount
	};
}
