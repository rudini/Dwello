/**
 * Statements as they are calculated: the calculation of a contract's period, a new statement, its recalculation and
 * correction, and what refuses them
 */
import { eq, sql, and, isNull } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db } from '../db/connection';
import {
	utilityStatements,
	utilityStatementLineItems,
	type NewUtilityStatement,
	type NewUtilityStatementLineItem,
	type KeyValues
} from '../db/schema';
import { calculateBalance, calculateStatementForContract, countingWith, generateStatementNumber, keyValuesAmong } from './calculation.service';
import { formatCHF, roundToRappen } from './pdf-format';
import { getTypedConfig } from './config.service';
import { fuelStockChange } from './fuel-stock.service';
import { apartmentsOf } from './apartment.service';
import { CodedError } from './coded-error';
import { belowMinimum } from './pdf-format';
import { isReplaced, replacedInSql } from './counting-statements';
import { daysAfter, swissToday } from './today';
import { paymentOf } from './statement-payment';
import { carriedOverId } from './carry-over';
import type { StatementWithDetails } from '../api/statement';
import { refuseOpenAgreements, refuseUncalculableKeys, refuseUncategorized } from './statement-refusals';
import { getStatement } from './statement-query.service';

/** Parameters of a statement calculation; the management fee overrides the configured default */
export interface StatementInput {
	contractId: string;
	periodStart: string;
	periodEnd: string;
	heatingProfileId?: string;
	managementFeePercent?: number;
	replacing?: string; // #1403: the statement a recalculation would replace, for the Übertrag it would count
}

/**
 * Calculate a contract's statement for a period without storing it; a statement of the contract and the same period
 * replaced without a berichtigte Abrechnung yet is replaced by it, which offsets what was paid on it (#120)
 */
export async function calculateStatement(input: StatementInput) {
	const calculation = await calculateStatementForContract(
		input.contractId,
		new Date(input.periodStart),
		new Date(input.periodEnd),
		input.heatingProfileId,
		input.managementFeePercent
	);
	const replaced = await openReplaced(input);
	const priorPayments = replaced ? paidSoFar(replaced) : 0;
	const carried = await carriedOver(input);
	const carryOver = carried ? Number(carried.balance) : 0;
	const balance = calculateBalance(calculation.totalCosts + carryOver, calculation.totalAdvancePayments + priorPayments);
	return { ...calculation, balance, priorPayments, carryOver, carriedFromId: carried?.id ?? null, replacesId: replaced?.id ?? null };
}

/**
 * The Übertrag (#448): the latest earlier statement of the Mietvertrag with a Saldo carried over that no statement of
 * another period counts yet; not an open one (#506, Fachreview 506-1 V-1) or one settled by hand
 */
async function carriedOver({ contractId, periodStart, periodEnd, replacing }: Pick<StatementInput, 'contractId' | 'periodStart' | 'periodEnd' | 'replacing'>) {
	const [carried] = await db
		.select({ id: utilityStatements.id, balance: utilityStatements.balance })
		.from(utilityStatements)
		.where(sql`${utilityStatements.id} = ${carriedOverId(contractId, periodStart, periodEnd, replacing)}`);
	return carried;
}

/** What was paid on a replaced statement and on the ones it replaced itself; a refund paid to the tenant counts negative */
const paidSoFar = (replaced: { paidAmount: string | null; priorPayments: string }) =>
	roundToRappen(Number(replaced.paidAmount ?? 0) + Number(replaced.priorPayments));

async function openReplaced({ contractId, periodStart, periodEnd }: StatementInput) {
	const successor = alias(utilityStatements, 'successor');
	const [replaced] = await db
		.select({ id: utilityStatements.id, paidAmount: utilityStatements.paidAmount, priorPayments: utilityStatements.priorPayments })
		.from(utilityStatements)
		.leftJoin(successor, eq(successor.replacesId, utilityStatements.id))
		.where(
			and(
				eq(utilityStatements.contractId, contractId),
				replacedInSql,
				eq(utilityStatements.periodStart, periodStart),
				eq(utilityStatements.periodEnd, periodEnd),
				isNull(successor.id)
			)
		)
		.limit(1);
	return replaced;
}

// The Tankbestand readings the statement bills by, only when the contract agrees the tank's category (#91, V-3); a
// statement from before #91 (agreed: null) billed every category
export const agreedStock = async (input: { buildingId: string; periodStart: string; periodEnd: string }, agreedCategoryIds: string[] | null) =>
	agreedStockOf(await fuelStockChange(input.buildingId, input.periodStart, input.periodEnd), agreedCategoryIds);

/** The readings of a period's change of the Tankbestand, if its category is agreed */
export const agreedStockOf = ([change]: Awaited<ReturnType<typeof fuelStockChange>>, agreedCategoryIds: string[] | null) =>
	change && (!agreedCategoryIds || agreedCategoryIds.includes(change.categoryId)) ? change.stock : null;

// The columns and positions a calculation gives a statement: shared by a new draft and a recalculated one (#338)
async function calculatedRows(input: StatementInput & { buildingId: string }) {
	await refuseUncalculableKeys(input.buildingId, input.periodStart, input.periodEnd);
	const calculation = await calculateStatement(input);
	const values = {
		tenantId: calculation.tenantId,
		apartmentId: calculation.apartmentId,
		contractId: input.contractId,
		periodStart: input.periodStart,
		periodEnd: input.periodEnd,
		rentalDays: calculation.rentalDays,
		rentalStart: calculation.rentalStart,
		rentalEnd: calculation.rentalEnd,
		totalCosts: String(calculation.totalCosts),
		totalAdvancePayments: String(calculation.totalAdvancePayments),
		advanceLines: calculation.advanceLines,
		managementFee: String(calculation.managementFee),
		managementFeePercent: String(calculation.managementFeePercent),
		heatingProfileId: input.heatingProfileId || null,
		heatingShare: calculation.heating,
		fuelStock: await agreedStock(input, calculation.agreedCategoryIds),
		agreedCategoryIds: calculation.agreedCategoryIds,
		agreedFrom: calculation.agreedFrom,
		keyValues: await keyValuesOf(input.buildingId, calculation.apartmentId, calculation.rentalStart),
		balance: String(calculation.balance),
		replacesId: calculation.replacesId,
		priorPayments: String(calculation.priorPayments),
		carriedFromId: calculation.carriedFromId
	};
	const lineItems = calculation.lineItems.map((item, index) => ({
		categoryId: item.categoryId,
		distributionKeyId: item.distributionKeyId,
		description: item.description,
		totalAmount: String(item.totalBuildingAmount),
		tenantShare: String(item.tenantShare),
		// Share column next to building total and tenant share: the tenant's share of the building total
		sharePercentage: item.totalBuildingAmount ? String((item.tenantShare / item.totalBuildingAmount) * 100) : '0',
		apartmentShare: String(item.apartmentShare),
		periodShare: String(item.periodShare),
		positionRentalDays: item.positionRentalDays,
		billedDays: item.billedDays,
		invoiceParts: item.invoiceParts,
		invoices: item.invoices,
		segments: item.segments,
		sortOrder: index
	}));
	return { values, lineItems, carryOver: calculation.carryOver };
}

/** Calculate a contract's statement and store it as a draft with its line items */
export async function generateStatement(
	input: StatementInput & { buildingId: string }
): Promise<StatementWithDetails> {
	const { values, lineItems } = await calculatedRows(input);
	const statementNumber = await generateStatementNumber(
		input.buildingId,
		new Date(input.periodEnd)
	);

	const paymentDeadlineDays = await getTypedConfig('payment_deadline_days');
	const statementDate = swissToday();

	return createStatement(
		{ ...values, statementNumber, statementDate, status: 'draft', paymentDeadline: daysAfter(statementDate, paymentDeadlineDays) },
		lineItems
	);
}

// What «Neu berechnen» gives a statement now (#338): its Heizprofil and Verwaltungspauschale, what was paid on the
// statement it replaces
async function recalculated(statement: StatementWithDetails) {
	const { contractId, periodStart, periodEnd, heatingProfileId, managementFeePercent } = statement;
	const rows = await calculatedRows({
		contractId,
		buildingId: statement.building!.id,
		periodStart,
		periodEnd,
		heatingProfileId: heatingProfileId ?? undefined,
		managementFeePercent: managementFeePercent === null ? undefined : Number(managementFeePercent),
		replacing: statement.id
	});
	const { totalCosts, totalAdvancePayments } = rows.values;
	const balance = calculateBalance(Number(totalCosts) + rows.carryOver, Number(totalAdvancePayments) + Number(statement.priorPayments));
	return { ...rows, balance: String(balance) };
}

// The tenant's share per position, as a key to compare (#454, Fachreview 454-1 E-3)
const sharesOf = (items: { categoryId: string | null; distributionKeyId: string | null; tenantShare: string }[]) =>
	JSON.stringify(
		items
			.filter((item) => Number(item.tenantShare) !== 0)
			.map((item) => `${item.categoryId}/${item.distributionKeyId}/${Number(item.tenantShare).toFixed(2)}`)
			.sort()
	);

/**
 * #454 (Fachreview 454-1 E-3): whether recalculating a sent statement would change its Saldo or the tenant's share of a
 * position, and the result (to remember a «Nicht berichtigen», E-6); null when it cannot be recalculated
 */
export async function recalculation(statement: StatementWithDetails) {
	const now = await recalculated(statement).catch(() => null);
	if (!now) return null;
	const result = JSON.stringify([now.balance, sharesOf(now.lineItems)]);
	const changes = result !== JSON.stringify([String(Number(statement.balance)), sharesOf(statement.lineItems)]);
	// the raw Saldos, below CHF 5 too: such a Saldo is carried over (#1023, replaces V-30 A); a Nachzahlung waived
	// under #94 is no longer claimed (Fachreview 1023-1 M-1)
	const waived = paymentOf(statement, swissToday()).waived;
	const [before, after] = [waived ? 0 : Number(statement.balance), Number(now.balance)];
	// #546 (Fachreview 546-1 V-2, V-4): the raw Saldo it gives, the difference to the one billed, and whether it is below CHF 5
	const balance = Number(now.balance).toFixed(2);
	const difference = roundToRappen(Number(now.balance) - Number(statement.balance)).toFixed(2);
	const small = (value: number) => value !== 0 && belowMinimum(value); // either Saldo (code review 546-1 C-2)
	const belowMin = !statement.final && (small(Number(now.balance)) || small(Number(statement.balance)));
	// #1403 (Fachreview 1403-1 V-1, V-2): what the berichtigte Abrechnung would claim after what was paid on this one,
	// 0 for a refund or a Saldo it carries over
	const owed = calculateBalance(Number(now.values.totalCosts) + now.carryOver, Number(now.values.totalAdvancePayments) + paidSoFar(statement));
	const open = (owed > 0 && (statement.final || !belowMinimum(owed)) ? owed : 0).toFixed(2);
	return { changes, result, raises: after >= before, lowers: after < before, now: { balance, difference, belowMinimum: belowMin, declineCosts: after >= before && Number(difference) > 0 ? difference : null, open } };
}

/**
 * Calculate a draft again from the invoices as they are now (#338): same number, Heizprofil and Verwaltungspauschale,
 * new amounts and positions; a sent or paid statement is corrected by a berichtigte Abrechnung instead (#120)
 */
export async function recalculateStatement(id: string): Promise<StatementWithDetails> {
	const draft = await getStatement(id);
	if (!draft) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (draft.status !== 'draft') throw new CodedError('STATEMENT_NOT_RECALCULABLE', 'Only a draft can be recalculated');
	// the wizard asks only for contracts without a statement: the landlord deletes the draft first (review 338-1 C-3)
	await refuseOpenAgreements(draft.contractId, draft.building!.id, draft.periodStart, draft.periodEnd, 'STATEMENT_RECALCULATION_AGREEMENTS_OPEN');
	await refuseUncategorized(draft.building!.id, draft.periodStart, draft.periodEnd, 'STATEMENT_RECALCULATION_UNCATEGORIZED_INVOICES');
	const { values, lineItems, balance } = await recalculated(draft);
	// a berichtigte Abrechnung keeps the statement it replaces and what was paid on it (review 338-1 C-1)
	const kept = { replacesId: draft.replacesId, priorPayments: draft.priorPayments, balance };
	await db.transaction(async (tx) => {
		await tx.delete(utilityStatementLineItems).where(eq(utilityStatementLineItems.statementId, id));
		await tx
			.update(utilityStatements)
			.set({ ...values, ...kept, pdfBlob: null, pdfGeneratedAt: null, updatedAt: new Date() })
			.where(eq(utilityStatements.id, id));
		if (lineItems.length) await tx.insert(utilityStatementLineItems).values(lineItems.map((item) => ({ ...item, statementId: id })));
	});
	return (await getStatement(id))!;
}

/**
 * Create a new statement
 */
export async function createStatement(
	data: NewUtilityStatement,
	lineItems: Omit<NewUtilityStatementLineItem, 'statementId'>[] = []
): Promise<StatementWithDetails> {
	// Statement and line items are written together or not at all
	const statement = await db.transaction(async (tx) => {
		const [statement] = await tx.insert(utilityStatements).values(data).returning();
		if (lineItems.length > 0) {
			await tx.insert(utilityStatementLineItems).values(
				lineItems.map((item, index) => ({
					...item,
					statementId: statement.id,
					sortOrder: item.sortOrder ?? index
				}))
			);
		}
		return statement;
	});

	// Fetch and return with details
	const result = await getStatement(statement.id);
	if (!result) {
		throw new Error('Failed to fetch created statement');
	}

	return result;
}

/** The apartment's and the building's area, apartments and rooms: what a simple distribution key divides by; with a day
 * only the apartments that count on it (#1284, Fachreview 1284-1 V-2) */
export async function keyValuesOf(buildingId: string, apartmentId: string, day?: string): Promise<KeyValues | null> {
	const all = await apartmentsOf(buildingId);
	return keyValuesAmong(day ? countingWith(all, day) : all, apartmentId); // with the values of that day (#1301)
}

/**
 * The berichtigte Abrechnung of a replaced statement: a draft of the same Mietvertrag and Abrechnungsperiode with the
 * same Heizprofil and Verwaltungspauschale, from today's data, with a new number; none without Mietstage in the period
 */
export async function correctStatement(id: string): Promise<StatementWithDetails> {
	const replaced = await getStatement(id);
	if (!replaced) throw new CodedError('STATEMENT_NOT_FOUND', 'Statement not found');
	if (!isReplaced(replaced)) throw new CodedError('STATEMENT_NOT_REPLACED', 'Statement is not replaced');
	if (replaced.replacedBy)
		throw new CodedError('STATEMENT_ALREADY_CORRECTED', 'Statement already has a berichtigte Abrechnung', {
			number: replaced.replacedBy.statementNumber
		});
	await refuseOpenAgreements(replaced.contractId, replaced.building!.id, replaced.periodStart, replaced.periodEnd);
	await refuseUncategorized(replaced.building!.id, replaced.periodStart, replaced.periodEnd);
	try {
		return await generateStatement({
			contractId: replaced.contractId,
			buildingId: replaced.building!.id,
			periodStart: replaced.periodStart,
			periodEnd: replaced.periodEnd,
			heatingProfileId: replaced.heatingProfileId ?? undefined,
			managementFeePercent: replaced.managementFeePercent === null ? undefined : Number(replaced.managementFeePercent)
		});
	} catch (error) {
		if (!(error instanceof CodedError && error.code === 'CONTRACT_NOT_IN_PERIOD')) throw error;
		// what the tenant paid comes back to him, a refund paid to him goes back to the landlord; only sent: nothing
		const paid = paidSoFar(replaced);
		const params = { number: replaced.statementNumber, amount: formatCHF(Math.abs(paid)) };
		const message = 'The contract has no rent days in the period';
		if (paid > 0) throw new CodedError('STATEMENT_NO_RENTAL_DAYS_PAID', message, params);
		if (paid < 0) throw new CodedError('STATEMENT_NO_RENTAL_DAYS_REFUNDED', message, params);
		throw new CodedError('STATEMENT_NO_RENTAL_DAYS_SENT', message, params);
	}
}
