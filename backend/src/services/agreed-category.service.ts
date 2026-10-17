/**
 * #91: the Nebenkosten each Mietvertrag agrees (Art. 257a Abs. 2 OR). A row per category: agreed, or answered «nicht
 * vereinbart»; a category without a row is not answered yet and is not billed until the landlord says it is agreed
 */

import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, contractCategories } from '../db/schema';
import { getInvoicesForStatement } from './invoice.service';
import { fuelStockChange } from './fuel-stock.service';

type Query = Pick<typeof db, 'select' | 'insert'>;

const answer = (rows: { contractId: string; categoryId: string; agreed: boolean }[], q: Query = db) =>
	q
		.insert(contractCategories)
		.values(rows)
		.onConflictDoUpdate({ target: [contractCategories.contractId, contractCategories.categoryId], set: { agreed: sql`excluded.agreed` } });

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
 * The contract's list as the form shows it: the categories given are agreed, every other umlagefähige one is not;
 * without a list (a new contract) every umlagefähige category is agreed
 */
export async function setAgreedCategories(contractId: string, agreedIds: string[] | undefined, q: Query = db) {
	const umlagefaehig = await q.select({ id: categories.id }).from(categories).where(eq(categories.isAllowedUtilityCost, true));
	const agreed = agreedIds ?? umlagefaehig.map((category) => category.id);
	const ids = new Set([...umlagefaehig.map((category) => category.id), ...agreed]);
	if (ids.size) await answer([...ids].map((categoryId) => ({ contractId, categoryId, agreed: agreed.includes(categoryId) })), q);
}

/** The landlord's answer whether the contract agrees one category */
export const answerAgreement = (contractId: string, categoryId: string, agreed: boolean) =>
	answer([{ contractId, categoryId, agreed }]);

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
