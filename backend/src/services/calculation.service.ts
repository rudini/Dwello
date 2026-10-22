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

import { like, max, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { statementNumbers, utilityStatements, type AdvanceLine, type BilledInvoice, type HeatingProfile, type HeatingShare, type InvoicePart } from '../db/schema';
import { getInvoicesForStatement } from './invoice.service';
import { fuelStockChange } from './fuel-stock.service';
import { calculateBuildingDistribution } from './distribution-key.service';
import { getTypedConfig } from './config.service';
import {
	calculateApartmentProrating,
	handleMidYearMoves
} from './prorating.service';
import { getApartment, listApartments } from './apartment.service';
import { advanceLines, advancesOf } from './advance-payment.service';
import { billingStart, getContract } from './contract.service';
import { agreedCategoryIds, agreedFromDays } from './agreed-category.service';
import { calculateHeatingShare, getHeatingProfile } from './heating-profile.service';
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
	positionRentalDays: number | null; // the period share as days, when it is one: the tenant's days in the days billed (#208)
	billedDays: number | null; // and the days the position's invoices bill in the period
	invoiceParts: InvoicePart[] | null; // invoices over different days: each with its days, for the weighted share (#226)
	invoices: BilledInvoice[]; // the invoices it bills (#96)
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
	rentalStart: string; // the billed rent days, YYYY-MM-DD
	rentalEnd: string;
	totalPeriodDays: number;
	lineItems: CalculatedLineItem[];
	subtotal: number;
	managementFee: number;
	managementFeePercent: number;
	totalCosts: number;
	totalAdvancePayments: number;
	advanceLines: AdvanceLine[]; // the Akonto per amount and split month (#464)
	balance: number; // Positive = tenant owes, Negative = refund
	heating: HeatingShare | null; // as the heating costs were shared (#209)
	agreedCategoryIds: string[]; // the categories the contract agreed (#91)
	agreedFrom: Record<string, string>; // «Vereinbart ab» of those with a day (#368)
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
	} & Pick<InvoicePart, 'noPeriod' | 'whole' | 'fuelStock'> & Pick<BilledInvoice, 'invoiceDate' | 'invoiceNumber'>>;
	isHeatingCost: boolean;
}

// An invoice of the period, or the change of the Tankbestand billed like one
type PeriodCost = Pick<
	Awaited<ReturnType<typeof getInvoicesForStatement>>[number],
	'id' | 'description' | 'categoryId' | 'distributionKeyId' | 'inPeriod'
> & Partial<Pick<Awaited<ReturnType<typeof getInvoicesForStatement>>[number], 'invoiceDate' | 'invoiceNumber'>> & {
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
		const receipt = { invoiceDate: invoice.invoiceDate, ...(invoice.invoiceNumber && { invoiceNumber: invoice.invoiceNumber }) };
		group.invoices.push({ id: invoice.id, description: invoice.description, ...(receipt.invoiceDate && receipt), ...invoice.inPeriod });
	}

	return Array.from(groups.values());
}

const isoDay = (date: Date) => date.toISOString().split('T')[0];
const days = (start: string, end: string) => Math.max(0, (Date.parse(end) - Date.parse(start)) / 86_400_000 + 1);
// the tenant's days in an invoice's days
const rentedIn = ({ start, end }: { start: string; end: string }, rentalStart: string, rentalEnd: string) =>
	days(start > rentalStart ? start : rentalStart, end < rentalEnd ? end : rentalEnd);

/**
 * The tenant's part of a group in francs of the building's costs: each invoice's amount times the part of the days it
 * bills that he rented (without a Leistungszeitraum the whole period: his rental days / the period's days)
 */
const rentalShare = (group: InvoiceGroup, rentalStart: string, rentalEnd: string) =>
	group.invoices.reduce((sum, invoice) => sum + (invoice.amount * rentedIn(invoice, rentalStart, rentalEnd)) / days(invoice.start, invoice.end), 0);

// The share as days the tenant can check (#208): when every invoice of the group bills the same days, his days in them
// of those days; invoices over different days give a weighted share, with each invoice's days to recompute it (#226),
// except for a tenant over the whole period (he bears every day: «x/x Tage»)
type LineDays = Pick<CalculatedLineItem, 'positionRentalDays' | 'billedDays' | 'invoiceParts'>;
const noDays: LineDays = { positionRentalDays: null, billedDays: null, invoiceParts: null };
function daysOf(group: InvoiceGroup, rentalStart: string, rentalEnd: string, wholePeriod: boolean): LineDays {
	const [{ start, end }] = group.invoices;
	if (group.invoices.every((invoice) => invoice.start === start && invoice.end === end))
		return { ...noDays, positionRentalDays: rentedIn({ start, end }, rentalStart, rentalEnd), billedDays: days(start, end) };
	if (wholePeriod) return noDays;
	return { ...noDays, invoiceParts: group.invoices.map((invoice) => partOf(invoice, rentalStart, rentalEnd)) };
}

// An invoice under its position: its days in the period and the tenant's days in them (#226)
const partOf = (invoice: InvoiceGroup['invoices'][number], rentalStart: string, rentalEnd: string): InvoicePart => ({
	start: invoice.start,
	end: invoice.end,
	amount: invoice.amount,
	days: rentedIn(invoice, rentalStart, rentalEnd),
	total: days(invoice.start, invoice.end),
	...(invoice.noPeriod && { noPeriod: invoice.noPeriod }),
	...(invoice.whole && { whole: invoice.whole }),
	...(invoice.fuelStock && { fuelStock: invoice.fuelStock })
});

// #71: a heating invoice counts the Heizprofil's months in its days in the period, normalised to 100 %, from the
// rounded months as printed (#232); days whose months carry 0 % in the profile are shared by days (#137)
function byProfile(group: InvoiceGroup, profile: HeatingProfile, rentalStart: string, rentalEnd: string): InvoicePart[] {
	return group.invoices.map((invoice) => {
		const part = partOf(invoice, rentalStart, rentalEnd);
		const billed = calculateHeatingShare(profile, new Date(invoice.start), new Date(invoice.end), 100);
		if (billed.percentage <= 0) return part;
		const [from, to] = [invoice.start > rentalStart ? invoice.start : rentalStart, invoice.end < rentalEnd ? invoice.end : rentalEnd];
		const tenant = part.days ? calculateHeatingShare(profile, new Date(from), new Date(to), 100) : { percentage: 0, monthBreakdown: [] };
		const percent = roundToRappen((tenant.percentage / billed.percentage) * 100);
		return { ...part, profile: { percent, months: tenant.monthBreakdown, periodMonths: billed.monthBreakdown } };
	});
}
const partShare = (part: InvoicePart) => (part.profile ? part.profile.percent / 100 : part.days / part.total);

// The tenant's part of a group in francs of the building's costs and what it comes from: by days, or with a profile by
// its months in each invoice's days (#71), each invoice by its amount (#226, #237)
function sharedByInvoices(group: InvoiceGroup, rentalStart: string, rentalEnd: string, wholePeriod: boolean, profile: HeatingProfile | null) {
	if (!profile) return { rented: rentalShare(group, rentalStart, rentalEnd), shareDays: daysOf(group, rentalStart, rentalEnd, wholePeriod) };
	const invoiceParts = byProfile(group, profile, rentalStart, rentalEnd);
	const rented = invoiceParts.reduce((sum, part) => sum + part.amount * partShare(part), 0);
	return { rented, shareDays: { ...noDays, invoiceParts } };
}

// The run's Heizprofil share of a heating group; none where it shares by days (#137, #208)
async function byRunProfile(group: InvoiceGroup, apartmentShare: number, run: GroupRun) {
	const { contract, periodStart, periodEnd, heatingProfileId } = run;
	if (!group.isHeatingCost || !heatingProfileId) return null;
	const contractEnd = contract.endDate ? new Date(contract.endDate) : null;
	const result = await handleMidYearMoves(heatingProfileId, new Date(billingStart(contract)), contractEnd, periodStart, periodEnd, apartmentShare);
	return result.byDays ? null : result;
}

// «Vereinbart ab» (#368, Art. 269d Abs. 3 OR): only the rent days from that day, as if the contract began then
// (Heizkosten by the Heizprofil, else by days); null: a day after the contract's days in the period bills nothing
function fromDay(from: string | undefined, run: GroupRun, rental: { start: string; end: string }) {
	if (from && from > rental.end) return null;
	if (!from || from <= rental.start) return { run, rental };
	return { run: { ...run, contract: { ...run.contract, startDate: from, billedUntil: null }, wholePeriod: false }, rental: { start: from, end: rental.end } };
}

type GroupRun = { contract: { startDate: string; endDate: string | null; billedUntil: string | null }; periodStart: Date; periodEnd: Date; heatingProfileId?: string; wholePeriod: boolean };

// The tenant's part of a group: heating costs by the Heizprofil if available, where it shares by days (no heating
// months in the period) by days like any other invoice's, with its Leistungszeitraum (#137); a heating invoice with its
// own days counts the profile's months in them, not in the period (#71). A delivery into the building's tank comes with
// the whole period from getInvoicesForStatement: the consumption counts over it, by the profile or by days (#257, #451)
async function shareOfGroup(
	group: InvoiceGroup,
	apartment: { share: number; percentage: number },
	run: GroupRun,
	rental: { start: string; end: string }
): Promise<{ tenantShare: number; periodShare: number; shareDays: LineDays }> {
	const [start, end] = [isoDay(run.periodStart), isoDay(run.periodEnd)];
	const heating = await byRunProfile(group, apartment.share, run);
	const ownDays = group.invoices.some((invoice) => invoice.start !== start || invoice.end !== end);
	// shared by the profile over the period: no days
	if (heating && !ownDays) return { tenantShare: roundToRappen(heating.share), periodShare: heating.percentage / 100, shareDays: noDays };
	// by days, or by the profile's months: the tenant's part of the days each invoice bills in the period
	const profile = heating ? await getHeatingProfile(run.heatingProfileId!) : null;
	const { rented, shareDays } = sharedByInvoices(group, rental.start, rental.end, run.wholePeriod, profile);
	// invoices summing to zero: the apartment's share by the key of each invoice's part (#237)
	if (group.totalAmount === 0) return { tenantShare: roundToRappen(rented * apartment.percentage), periodShare: 0, shareDays };
	const periodShare = rented / group.totalAmount;
	return { tenantShare: roundToRappen(apartment.share * periodShare), periodShare, shareDays };
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
 * Calculate balance (tenant owes vs. refund), rounded to 5 Rappen: the amount the tenant pays or gets back
 */
export function calculateBalance(totalCosts: number, totalAdvancePayments: number): number {
	return roundTo5Rappen(totalCosts - totalAdvancePayments);
}

/** Rate of the Verwaltungspauschale: only where the contract agrees one (#89, Art. 257a Abs. 2 OR), its own rate first,
 * else the run's, else the setting */
async function feePercentOf(
	contract: { managementFeeAgreed: boolean; managementFeePercent: string | null },
	runPercent?: number
) {
	if (!contract.managementFeeAgreed) return 0;
	if (contract.managementFeePercent !== null) return parseFloat(contract.managementFeePercent);
	return runPercent ?? (await getTypedConfig('management_fee_pct'));
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

	// Group invoices by category; only the categories the contract agrees (#91, Art. 257a Abs. 2 OR): the share of its
	// apartment in the others is the landlord's. An invoice without a Kategorie has nothing to agree and is billed
	const agreed = await agreedCategoryIds(contractId);
	const agreedFrom = await agreedFromDays(contractId); // «Vereinbart ab» (#368)
	const invoiceGroups = groupInvoicesByCategory(invoices).filter((group) => !group.categoryId || agreed.includes(group.categoryId));

	// All apartments of the building share its costs according to the distribution key
	const { apartments: buildingApartmentRows } = await listApartments({ buildingId, limit: 1000 });
	const buildingApartments = buildingApartmentRows.map((a) => ({
		id: a.id,
		area: parseFloat(a.area),
		rooms: parseFloat(a.rooms)
	}));

	// Calculate line items
	const heating = await heatingOfRun(invoiceGroups, contract, periodStart, periodEnd, heatingProfileId);
	const lineItems: CalculatedLineItem[] = [];
	let subtotal = 0;
	const run = { contract, periodStart, periodEnd, heatingProfileId, wholePeriod: rentalDays === totalPeriodDays };
	const rental = { start: isoDay(contractOverlap.overlapStart), end: isoDay(contractOverlap.overlapEnd) };

	for (const group of invoiceGroups) {
		const days = fromDay(group.categoryId ? agreedFrom[group.categoryId] : undefined, run, rental);
		if (!days) continue;

		// Calculate apartment's share of building costs
		const apartmentShareResult = await calculateApartmentShare(
			buildingApartments,
			apartment.id,
			group.totalAmount,
			group.distributionKeyId
		);

		const { tenantShare, periodShare, shareDays } = await shareOfGroup(group, apartmentShareResult, days.run, days.rental);

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
			...shareDays,
			invoices: group.invoices.map(({ id, description, invoiceDate, invoiceNumber, amount, start, end, fuelStock }) => ({
				id,
				description,
				...(invoiceDate && { invoiceDate }),
				...(invoiceNumber && { invoiceNumber }),
				amount,
				start,
				end,
				...(fuelStock && { fuelStock })
			})),
			isHeatingCost: group.isHeatingCost
		});

		subtotal += tenantShare;
	}

	subtotal = roundToRappen(subtotal);

	// Management fee: a percentage of the tenant's own utility costs, so the tenant can check the rate on the statement
	const feePercent = await feePercentOf(contract, managementFeePercent);
	const managementFee = calculateManagementFee(subtotal, feePercent).fee;
	const totalCosts = roundToRappen(subtotal + managementFee);

	// The Akonto of each amount for the months it applied (#464); a contract without rows (made around the service) by
	// its one amount
	const amounts = (await advancesOf(contract.id)).map(({ validFrom, amount }) => ({ validFrom, amount: parseFloat(amount) }));
	const advance = advanceLines(
		amounts.length ? amounts : [{ validFrom: contract.startDate, amount: parseFloat(contract.monthlyAdvancePayment) }],
		contractOverlap.overlapStart,
		contractOverlap.overlapEnd
	);
	const totalAdvancePayments = roundToRappen(advance.reduce((sum, line) => sum + line.total, 0));

	// Calculate balance
	const balance = calculateBalance(totalCosts, totalAdvancePayments);

	return {
		contractId,
		apartmentId: contract.apartmentId,
		tenantId: contract.tenantId,
		periodStart,
		periodEnd,
		rentalDays,
		rentalStart: isoDay(contractOverlap.overlapStart),
		rentalEnd: isoDay(contractOverlap.overlapEnd),
		totalPeriodDays,
		lineItems,
		subtotal,
		managementFee,
		managementFeePercent: feePercent,
		totalCosts,
		totalAdvancePayments,
		advanceLines: advance,
		balance,
		heating,
		agreedCategoryIds: agreed,
		agreedFrom
	};
}

// What the PDF prints of the heating profile, kept with the statement (#209): the same for every heating position
async function heatingOfRun(
	groups: InvoiceGroup[],
	contract: { startDate: string; endDate: string | null; billedUntil: string | null },
	periodStart: Date,
	periodEnd: Date,
	heatingProfileId?: string
): Promise<StatementCalculation['heating']> {
	if (!heatingProfileId || !groups.some((group) => group.isHeatingCost)) return null;
	const profile = await getHeatingProfile(heatingProfileId);
	if (!profile) return { byDays: true }; // as the per-group calculation shares without a profile
	const contractEnd = contract.endDate ? new Date(contract.endDate) : null;
	const result = await handleMidYearMoves(profile.id, new Date(billingStart(contract)), contractEnd, periodStart, periodEnd, 100);
	// the profile's names as they were, so a renamed or deleted own profile still names the share it gave, or the one
	// chosen but not applied (#247)
	const { name, nameDE, nameFR, nameIT, nameEN } = profile;
	const names = { name, nameDE, nameFR, nameIT, nameEN };
	if (result.byDays) return { byDays: true, reason: result.reason, names };
	// months and percent rounded to two places by the calculation, as printed (#232)
	const { percentage: percent, monthBreakdown: months, periodPercentage: periodPercent } = result;
	// the period's months where they do not carry 100 %, for the division in the PDF (#232, F-7)
	const periodMonths = periodPercent === 100 ? undefined : result.periodBreakdown;
	return { byDays: false, percent, months, periodPercent, periodMonths, names };
}

/**
 * Next statement number of a building and year: NK-<building>-<year>-0001, 0002, …
 * Never gives a number twice, also after its draft was deleted: the gap stays (#97)
 */
export async function generateStatementNumber(buildingId: string, periodEnd: Date): Promise<string> {
	const prefix = `NK-${buildingId.substring(0, 8).toUpperCase()}-${periodEnd.getUTCFullYear()}-`;
	const [{ highest }] = await db
		.select({ highest: max(utilityStatements.statementNumber) })
		.from(utilityStatements)
		.where(like(utilityStatements.statementNumber, `${prefix}%`));
	// the first number of a prefix follows the highest existing one; after that the counter alone decides (#97)
	const [{ lastNumber }] = await db
		.insert(statementNumbers)
		.values({ prefix, lastNumber: highest ? Number(highest.slice(prefix.length)) + 1 : 1 })
		.onConflictDoUpdate({ target: statementNumbers.prefix, set: { lastNumber: sql`${statementNumbers.lastNumber} + 1` } })
		.returning({ lastNumber: statementNumbers.lastNumber });

	return `${prefix}${String(lastNumber).padStart(4, '0')}`;
}
