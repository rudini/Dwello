/**
 * Calculation Service
 * Core calculation engine for utility statement generation
 *
 * Handles:
 * - Invoice grouping by category
 * - Distribution key application
 * - Tenant share calculation
 * - Management fee calculation
 * - Balance calculation
 */

import { getInvoicesForStatement } from './invoice.service';
import { calculateBuildingDistribution } from './distribution-key.service';
import { getTypedConfig } from './config.service';
import {
	calculateApartmentProrating,
	prorateCosts,
	handleMidYearMoves
} from './prorating.service';
import { getApartment, listApartments } from './apartment.service';
import { getContract } from './contract.service';

/**
 * Line item for statement
 */
export interface CalculatedLineItem {
	categoryId: string | null;
	categoryName: string;
	distributionKeyId: string | null;
	distributionKeyName: string;
	description: string;
	totalBuildingAmount: number;
	apartmentShare: number;
	tenantShare: number;
	sharePercentage: number;
	isHeatingCost: boolean;
}

/**
 * Complete calculation result for a statement
 */
export interface StatementCalculation {
	contractId: string;
	apartmentId: string;
	tenantId: string;
	periodStart: Date;
	periodEnd: Date;
	rentalDays: number;
	totalPeriodDays: number;
	lineItems: CalculatedLineItem[];
	subtotal: number;
	managementFee: number;
	managementFeePercent: number;
	totalCosts: number;
	totalAdvancePayments: number;
	balance: number; // Positive = tenant owes, Negative = refund
}

/**
 * Group invoices by category
 */
interface InvoiceGroup {
	categoryId: string | null;
	categoryName: string;
	distributionKeyId: string | null;
	distributionKeyName: string;
	totalAmount: number;
	invoices: Array<{
		id: string;
		description: string;
		amount: number;
	}>;
	isHeatingCost: boolean;
}

function groupInvoicesByCategory(
	invoices: Awaited<ReturnType<typeof getInvoicesForStatement>>
): InvoiceGroup[] {
	const groups = new Map<string, InvoiceGroup>();

	for (const invoice of invoices) {
		const key = `${invoice.categoryId || 'uncategorized'}-${invoice.distributionKeyId || 'none'}`;

		if (!groups.has(key)) {
			groups.set(key, {
				categoryId: invoice.categoryId,
				categoryName: invoice.category?.name || 'Nicht kategorisiert',
				distributionKeyId: invoice.distributionKeyId,
				distributionKeyName: invoice.distributionKey?.name || 'Gleichmässig',
				totalAmount: 0,
				invoices: [],
				isHeatingCost: /heiz|wärme|heating/i.test(invoice.category?.name ?? '')
			});
		}

		const group = groups.get(key)!;
		group.totalAmount += parseFloat(invoice.amount);
		group.invoices.push({
			id: invoice.id,
			description: invoice.description,
			amount: parseFloat(invoice.amount)
		});
	}

	return Array.from(groups.values());
}

/**
 * Calculate apartment's share of costs based on distribution key
 */
async function calculateApartmentShare(
	buildingApartments: Array<{ id: string; area: number; rooms: number }>,
	targetApartmentId: string,
	totalAmount: number,
	distributionKeyId: string | null
): Promise<{ share: number; percentage: number }> {
	// If no distribution key, default to equal distribution
	if (!distributionKeyId) {
		const equalShare = totalAmount / buildingApartments.length;
		return {
			share: Math.round(equalShare * 100) / 100,
			percentage: 1 / buildingApartments.length
		};
	}

	const result = await calculateBuildingDistribution(
		distributionKeyId,
		buildingApartments,
		totalAmount
	);

	if (!result.isValid) {
		// Fallback to equal distribution
		const equalShare = totalAmount / buildingApartments.length;
		return {
			share: Math.round(equalShare * 100) / 100,
			percentage: 1 / buildingApartments.length
		};
	}

	const apartmentDist = result.distributions.find((d) => d.apartmentId === targetApartmentId);

	if (!apartmentDist) {
		return { share: 0, percentage: 0 };
	}

	return {
		share: Math.round(apartmentDist.amount * 100) / 100,
		percentage: apartmentDist.share
	};
}

/**
 * Calculate management fee
 */
export function calculateManagementFee(
	totalCosts: number,
	feePercentage: number
): { fee: number; actualPercentage: number } {
	const fee = Math.round((totalCosts * feePercentage) / 100 * 100) / 100;

	return { fee, actualPercentage: feePercentage };
}

/**
 * Calculate total advance payments for a contract in a period
 */
export function calculateTotalAdvancePayments(
	monthlyAdvancePayment: number,
	rentalStart: Date,
	rentalEnd: Date
): number {
	// Advances are due per calendar month; a partial month counts by its share of days
	let months = 0;
	const cursor = new Date(Date.UTC(rentalStart.getUTCFullYear(), rentalStart.getUTCMonth(), 1));
	while (cursor <= rentalEnd) {
		const year = cursor.getUTCFullYear();
		const month = cursor.getUTCMonth();
		const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
		const firstDay = rentalStart > cursor ? rentalStart.getUTCDate() : 1;
		const lastDay = rentalEnd < new Date(Date.UTC(year, month, daysInMonth)) ? rentalEnd.getUTCDate() : daysInMonth;
		months += (lastDay - firstDay + 1) / daysInMonth;
		cursor.setUTCMonth(month + 1);
	}

	return Math.round(months * monthlyAdvancePayment * 100) / 100;
}

/**
 * Calculate balance (tenant owes vs. refund)
 */
export function calculateBalance(totalCosts: number, totalAdvancePayments: number): number {
	return Math.round((totalCosts - totalAdvancePayments) * 100) / 100;
}

/**
 * Main calculation function for a contract
 */
export async function calculateStatementForContract(
	contractId: string,
	periodStart: Date,
	periodEnd: Date,
	heatingProfileId?: string,
	managementFeePercent?: number
): Promise<StatementCalculation> {
	// Get contract details
	const contract = await getContract(contractId);
	if (!contract) {
		throw new Error('Contract not found');
	}

	// Get apartment and building details
	const apartment = await getApartment(contract.apartmentId);
	if (!apartment) {
		throw new Error('Apartment not found');
	}

	const buildingId = apartment.buildingId;

	// Calculate proration for this contract
	const prorating = await calculateApartmentProrating(
		contract.apartmentId,
		periodStart,
		periodEnd
	);

	// Find this contract's overlap in the prorating result
	const contractOverlap = prorating.contracts.find((c) => c.contract.id === contractId);
	if (!contractOverlap) {
		throw new Error('Contract does not overlap with the specified period');
	}

	const rentalDays = contractOverlap.overlapDays;
	const totalPeriodDays = prorating.totalPeriodDays;

	// Get all valid invoices for the building in the period
	const invoices = await getInvoicesForStatement(
		buildingId,
		periodStart.toISOString().split('T')[0],
		periodEnd.toISOString().split('T')[0]
	);

	// Group invoices by category
	const invoiceGroups = groupInvoicesByCategory(invoices);

	// All apartments of the building share its costs according to the distribution key
	const { apartments: buildingApartmentRows } = await listApartments({ buildingId, limit: 1000 });
	const buildingApartments = buildingApartmentRows.map((a) => ({
		id: a.id,
		area: parseFloat(a.area),
		rooms: parseFloat(a.rooms)
	}));

	// Calculate line items
	const lineItems: CalculatedLineItem[] = [];
	let subtotal = 0;

	for (const group of invoiceGroups) {
		// Calculate apartment's share of building costs
		const apartmentShareResult = await calculateApartmentShare(
			buildingApartments,
			apartment.id,
			group.totalAmount,
			group.distributionKeyId
		);

		let tenantShare: number;
		let sharePercentage: number;

		// For heating costs, use heating profile if available
		if (group.isHeatingCost && heatingProfileId) {
			const heatingResult = await handleMidYearMoves(
				heatingProfileId,
				new Date(contract.startDate),
				contract.endDate ? new Date(contract.endDate) : null,
				periodStart,
				periodEnd,
				apartmentShareResult.share
			);
			tenantShare = heatingResult.share;
			sharePercentage = heatingResult.percentage / 100;
		} else {
			// Standard day-based prorating
			const prorated = prorateCosts(
				apartmentShareResult.share,
				rentalDays,
				totalPeriodDays
			);
			tenantShare = prorated.proratedAmount;
			sharePercentage = prorated.sharePercentage;
		}

		lineItems.push({
			categoryId: group.categoryId,
			categoryName: group.categoryName,
			distributionKeyId: group.distributionKeyId,
			distributionKeyName: group.distributionKeyName,
			description: group.categoryName,
			totalBuildingAmount: group.totalAmount,
			apartmentShare: apartmentShareResult.share,
			tenantShare: Math.round(tenantShare * 100) / 100,
			sharePercentage: Math.round(sharePercentage * 10000) / 10000,
			isHeatingCost: group.isHeatingCost
		});

		subtotal += tenantShare;
	}

	subtotal = Math.round(subtotal * 100) / 100;

	// Management fee: chosen per generation run, otherwise the configured default
	const feePercent = managementFeePercent ?? (await getTypedConfig('management_fee_pct'));
	const managementFeeResult = calculateManagementFee(subtotal, feePercent);

	const managementFee = managementFeeResult.fee;
	const totalCosts = Math.round((subtotal + managementFee) * 100) / 100;

	// Calculate total advance payments
	const monthlyAdvance = parseFloat(contract.monthlyAdvancePayment);
	const totalAdvancePayments = calculateTotalAdvancePayments(
		monthlyAdvance,
		contractOverlap.overlapStart,
		contractOverlap.overlapEnd
	);

	// Calculate balance
	const balance = calculateBalance(totalCosts, totalAdvancePayments);

	return {
		contractId,
		apartmentId: contract.apartmentId,
		tenantId: contract.tenantId,
		periodStart,
		periodEnd,
		rentalDays,
		totalPeriodDays,
		lineItems,
		subtotal,
		managementFee,
		managementFeePercent: managementFeeResult.actualPercentage,
		totalCosts,
		totalAdvancePayments,
		balance
	};
}

/**
 * Generate statement number
 */
export async function generateStatementNumber(
	buildingId: string,
	periodEnd: Date
): Promise<string> {
	const year = periodEnd.getFullYear();
	const shortBuildingId = buildingId.substring(0, 8).toUpperCase();

	// Get count of existing statements for this building and year
	// In production, you'd query the database
	const sequence = Math.floor(Math.random() * 9000) + 1000; // Placeholder

	return `NK-${shortBuildingId}-${year}-${String(sequence).padStart(4, '0')}`;
}
