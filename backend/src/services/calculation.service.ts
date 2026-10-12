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

import { like, max } from 'drizzle-orm';
import { db } from '../db/connection';
import { utilityStatements } from '../db/schema';
import { getInvoicesForStatement } from './invoice.service';
import { fuelStockChange } from './fuel-stock.service';
import { calculateBuildingDistribution } from './distribution-key.service';
import { getTypedConfig } from './config.service';
import {
	calculateApartmentProrating,
	handleMidYearMoves
} from './prorating.service';
import { getApartment, listApartments } from './apartment.service';
import { getContract } from './contract.service';
import { roundTo5Rappen, roundToRappen } from './pdf-format';
import { CodedError } from './coded-error';

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
	periodShare: number; // share of the period (0-1): days rented / period days, or the heating profile's shares of the months rented
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
	// each invoice's amount in the period and the days it bills there (the whole period without a Leistungszeitraum)
	invoices: Array<{
		id: string;
		description: string;
		amount: number;
		start: string;
		end: string;
	}>;
	isHeatingCost: boolean;
}

// An invoice of the period, or the change of the Tankbestand billed like one
type PeriodCost = Pick<
	Awaited<ReturnType<typeof getInvoicesForStatement>>[number],
	'id' | 'description' | 'categoryId' | 'distributionKeyId' | 'inPeriod'
> & {
	category: { name: string; isHeatingCost: boolean } | null;
	distributionKey: { name: string } | null;
};

// The group of the invoice's category and distribution key, still without amounts
const emptyGroup = (invoice: PeriodCost): InvoiceGroup => ({
	categoryId: invoice.categoryId,
	categoryName: invoice.category?.name || 'Nicht kategorisiert',
	distributionKeyId: invoice.distributionKeyId,
	distributionKeyName: invoice.distributionKey?.name || 'Gleichmässig',
	totalAmount: 0,
	invoices: [],
	isHeatingCost: invoice.category?.isHeatingCost ?? false
});

function groupInvoicesByCategory(invoices: PeriodCost[]): InvoiceGroup[] {
	const groups = new Map<string, InvoiceGroup>();

	for (const invoice of invoices) {
		const key = `${invoice.categoryId || 'uncategorized'}-${invoice.distributionKeyId || 'none'}`;
		const group = groups.get(key) ?? groups.set(key, emptyGroup(invoice)).get(key)!;
		group.totalAmount += invoice.inPeriod.amount;
		group.invoices.push({ id: invoice.id, description: invoice.description, ...invoice.inPeriod });
	}

	return Array.from(groups.values());
}

const isoDay = (date: Date) => date.toISOString().split('T')[0];
const days = (start: string, end: string) => Math.max(0, (Date.parse(end) - Date.parse(start)) / 86_400_000 + 1);

/**
 * The tenant's share (0–1) of a group: each invoice weighs with its amount, and the tenant bears the part of the days it
 * bills that he rented (without a Leistungszeitraum the whole period: his rental days / the period's days)
 */
function rentalShare(group: InvoiceGroup, rentalStart: string, rentalEnd: string) {
	// ponytail: a group summing to 0 (invoice and credit over different Leistungszeiträume) bills nothing; per-invoice shares if that occurs
	if (group.totalAmount === 0) return 0;
	const rented = group.invoices.reduce((sum, invoice) => {
		const from = invoice.start > rentalStart ? invoice.start : rentalStart;
		const to = invoice.end < rentalEnd ? invoice.end : rentalEnd;
		return sum + (invoice.amount * days(from, to)) / days(invoice.start, invoice.end);
	}, 0);
	return rented / group.totalAmount;
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
			share: roundToRappen(equalShare),
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
			share: roundToRappen(equalShare),
			percentage: 1 / buildingApartments.length
		};
	}

	const apartmentDist = result.distributions.find((d) => d.apartmentId === targetApartmentId);

	if (!apartmentDist) {
		return { share: 0, percentage: 0 };
	}

	return {
		share: roundToRappen(apartmentDist.amount),
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
	const fee = roundToRappen((totalCosts * feePercentage) / 100);

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

	return roundToRappen(months * monthlyAdvancePayment);
}

/**
 * Calculate balance (tenant owes vs. refund), rounded to 5 Rappen: the amount the tenant pays or gets back
 */
export function calculateBalance(totalCosts: number, totalAdvancePayments: number): number {
	return roundTo5Rappen(totalCosts - totalAdvancePayments);
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
		throw new CodedError('CONTRACT_NOT_FOUND', 'Contract not found');
	}

	// Get apartment and building details
	const apartment = await getApartment(contract.apartmentId);
	if (!apartment) {
		throw new CodedError('APARTMENT_NOT_FOUND', 'Apartment not found');
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
		throw new CodedError('CONTRACT_NOT_IN_PERIOD', 'Contract does not overlap with the specified period');
	}

	const rentalDays = contractOverlap.overlapDays;
	const totalPeriodDays = prorating.totalPeriodDays;

	// Get all valid invoices for the building in the period
	const [start, end] = [isoDay(periodStart), isoDay(periodEnd)];
	const invoices = [
		...(await getInvoicesForStatement(buildingId, start, end)),
		...(await fuelStockChange(buildingId, start, end))
	];

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
		let periodShare: number;

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
			tenantShare = roundToRappen(heatingResult.share);
			periodShare = heatingResult.percentage / 100;
		} else {
			// By days: the tenant's days within the days each invoice bills in the period
			periodShare = rentalShare(group, isoDay(contractOverlap.overlapStart), isoDay(contractOverlap.overlapEnd));
			tenantShare = roundToRappen(apartmentShareResult.share * periodShare);
		}

		lineItems.push({
			categoryId: group.categoryId,
			categoryName: group.categoryName,
			distributionKeyId: group.distributionKeyId,
			distributionKeyName: group.distributionKeyName,
			description: group.categoryName,
			totalBuildingAmount: group.totalAmount,
			apartmentShare: apartmentShareResult.share,
			tenantShare: roundToRappen(tenantShare),
			periodShare: Math.round(periodShare * 10000) / 10000,
			isHeatingCost: group.isHeatingCost
		});

		subtotal += tenantShare;
	}

	subtotal = roundToRappen(subtotal);

	// Management fee: a percentage (chosen per generation run, otherwise the configured default) of the tenant's own
	// utility costs, so the tenant can check the rate on the statement
	const feePercent = managementFeePercent ?? (await getTypedConfig('management_fee_pct'));
	const managementFee = calculateManagementFee(subtotal, feePercent).fee;
	const totalCosts = roundToRappen(subtotal + managementFee);

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
		managementFeePercent: feePercent,
		totalCosts,
		totalAdvancePayments,
		balance
	};
}

/**
 * Next statement number of a building and year: NK-<building>-<year>-0001, 0002, …
 * Counts on from the highest one, so a deleted statement's number does not come back while later ones exist
 */
export async function generateStatementNumber(buildingId: string, periodEnd: Date): Promise<string> {
	const prefix = `NK-${buildingId.substring(0, 8).toUpperCase()}-${periodEnd.getUTCFullYear()}-`;
	const [{ highest }] = await db
		.select({ highest: max(utilityStatements.statementNumber) })
		.from(utilityStatements)
		.where(like(utilityStatements.statementNumber, `${prefix}%`));
	const sequence = highest ? Number(highest.slice(prefix.length)) + 1 : 1;

	return `${prefix}${String(sequence).padStart(4, '0')}`;
}
