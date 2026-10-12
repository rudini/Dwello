/**
 * Utility Validation Service
 * Swiss utility cost validation and compliance checking
 */

import { SWISS_UTILITY_CATEGORIES } from '../config/llm';
import { getCategory } from './category.service';

/**
 * Customary management fee percentage (a guideline, not a cap)
 */
const MAX_MANAGEMENT_FEE_PERCENT = 3.0;

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
		allowedCategories: SWISS_UTILITY_CATEGORIES.allowed.map((c) => c.de),
		notAllowedCategories: SWISS_UTILITY_CATEGORIES.notAllowed.map((c) => c.de),
		notes: [
			'Nebenkosten müssen verbrauchsabhängig oder nach Fläche verteilt werden',
			'Die Verwaltungspauschale beträgt üblicherweise 3% der Nebenkosten (Richtwert, keine Obergrenze)',
			'Reparaturen und Renovationen sind keine umlagefähigen Nebenkosten',
			'Grundsteuern und Hypothekarzinsen sind nie umlagefähig',
			'Alle Nebenkosten müssen im Mietvertrag vereinbart sein'
		]
	};
}

/**
 * Validate an invoice for inclusion in utility statements
 */
interface InvoiceValidationResult {
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
		// Check if category allows utility cost inclusion (an unknown category does not)
		const category = await getCategory(invoice.categoryId);
		if (!category?.isAllowedUtilityCost) {
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
