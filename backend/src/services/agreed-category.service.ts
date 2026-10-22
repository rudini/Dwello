/**
 * #91: the Nebenkosten each Mietvertrag agrees (Art. 257a Abs. 2 OR). A row per category: agreed, or answered «nicht
 * vereinbart»; a category without a row is not answered yet and is not billed until the landlord says it is agreed
 */

import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, contractCategories } from '../db/schema';
import { getInvoicesForStatement } from './invoice.service';
import { fuelStockChange } from './fuel-stock.service';
import { CodedError } from './coded-error';

type Query = Pick<typeof db, 'insert' | 'execute'>;

const answer = (rows: { contractId: string; categoryId: string; agreed: boolean; agreedFrom?: string | null }[], q: Query = db) =>
	q
		.insert(contractCategories)
		.values(rows)
		.onConflictDoUpdate({
			target: [contractCategories.contractId, contractCategories.categoryId],
			set: { agreed: sql`excluded.agreed`, agreedFrom: sql`excluded.agreed_from` }
		});

/** The ids of the umlagefähige categories the contract agrees; one no longer umlagefähig bills nothing anyway */
export async function agreedCategoryIds(contractId: string): Promise<string[]> {
	const rows = await db
		.select({ id: contractCategories.categoryId })
		.from(contractCategories)
		.innerJoin(categories, eq(categories.id, contractCategories.categoryId))
		.where(
			and(
				eq(contractCategories.contractId, contractId),
				eq(contractCategories.agreed, true),
				eq(categories.isAllowedUtilityCost, true)
			)
		);
	return rows.map((row) => row.id);
}

/**
 * The contract's list as the form shows it: the categories given are agreed, the others it answers are not. A new
 * contract answers every umlagefähige category (without a list: all agreed); a saved one only those it had answered,
 * so a category not answered yet stays a question for the wizard (code review W10c S3 C-1). One statement that locks
 * the categories it reads, so one deleted meanwhile is no foreign key error, and an unknown id is left out
 */
export async function setAgreedCategories(
	contractId: string,
	agreedIds: string[] | undefined,
	q: Query = db,
	{ answeredOnly = false } = {}
) {
	const ids = agreedIds?.map((id) => sql`${id}::uuid`);
	const agreed = !ids ? categories.isAllowedUtilityCost : ids.length ? sql`${categories.id} IN (${sql.join(ids, sql`, `)})` : sql`false`;
	const answered = answeredOnly
		? sql`${categories.isAllowedUtilityCost} AND ${categories.id} IN (SELECT category_id FROM contract_categories WHERE contract_id = ${contractId}::uuid)`
		: categories.isAllowedUtilityCost;
	await q.execute(sql`
		INSERT INTO contract_categories (contract_id, category_id, agreed)
		SELECT ${contractId}::uuid, ${categories.id}, coalesce(${agreed}, false) FROM ${categories}
		WHERE ${answered} OR ${agreed}
		FOR KEY SHARE
		ON CONFLICT (contract_id, category_id) DO UPDATE SET agreed = excluded.agreed`);
}

/** The landlord's answer whether the contract agrees one category, «Vereinbart ab» a day (#368); «nicht vereinbart» has none */
export const answerAgreement = (contractId: string, categoryId: string, agreed: boolean, from?: string) =>
	answer([{ contractId, categoryId, agreed, agreedFrom: (agreed && from) || null }]);

/** «Vereinbart ab» of the agreed categories that have a day (#368) */
export async function agreedFromDays(contractId: string): Promise<Record<string, string>> {
	const rows = await db
		.select({ id: contractCategories.categoryId, from: contractCategories.agreedFrom })
		.from(contractCategories)
		.where(and(eq(contractCategories.contractId, contractId), eq(contractCategories.agreed, true), sql`${contractCategories.agreedFrom} IS NOT NULL`));
	return Object.fromEntries(rows.map((row) => [row.id, row.from!]));
}

/** The form's days (#368): every agreed category of the contract gets its day, or none */
export async function setAgreedFrom(contractId: string, days: Record<string, string>, q: Query = db) {
	await q.execute(sql`UPDATE contract_categories SET agreed_from = NULL WHERE contract_id = ${contractId}::uuid`);
	for (const [categoryId, from] of Object.entries(days))
		await q.execute(
			sql`UPDATE contract_categories SET agreed_from = ${from}::date WHERE contract_id = ${contractId}::uuid AND category_id = ${categoryId}::uuid AND agreed`
		);
}

/** A day before the Vertragsbeginn or after the Vertragsende is refused (Fachreview 368-B M-2); the start itself is allowed */
export function checkAgreedFrom(contract: { startDate: string; endDate: string | null }, days: (string | undefined)[]) {
	for (const day of days) {
		if (!day) continue;
		if (day < contract.startDate) throw new CodedError('AGREED_FROM_BEFORE_START', 'The day is before the contract start', { date: day });
		if (contract.endDate && day > contract.endDate) throw new CodedError('AGREED_FROM_AFTER_END', 'The day is after the contract end', { date: day });
	}
}

/**
 * The categories with costs for the contract in the period (amounts not summing to zero over days it rents) and its
 * answer for each: true, false, or null when not answered yet
 */
export async function agreementsInPeriod(
	contract: { id: string; startDate: string; endDate: string | null; buildingId: string },
	periodStart: string,
	periodEnd: string
) {
	const costs = [
		...(await getInvoicesForStatement(contract.buildingId, periodStart, periodEnd)),
		...(await fuelStockChange(contract.buildingId, periodStart, periodEnd))
	];
	const totals = new Map<string, number>();
	for (const { categoryId, inPeriod } of costs) {
		const rented = inPeriod.end >= contract.startDate && (!contract.endDate || inPeriod.start <= contract.endDate);
		if (categoryId && rented) totals.set(categoryId, (totals.get(categoryId) ?? 0) + inPeriod.amount);
	}
	const answers = await db
		.select({ categoryId: contractCategories.categoryId, agreed: contractCategories.agreed })
		.from(contractCategories)
		.where(eq(contractCategories.contractId, contract.id));
	return [...totals]
		.filter(([, total]) => Math.round(total * 100) !== 0)
		.map(([categoryId]) => ({ categoryId, agreed: answers.find((row) => row.categoryId === categoryId)?.agreed ?? null }));
}
