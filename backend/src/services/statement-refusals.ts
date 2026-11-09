/**
 * What refuses a statement made without the wizard, or sent: categories not answered as agreed, allocable invoices
 * without category, a distribution key that cannot be calculated
 */

import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, rentalContracts } from '../db/schema';
import { agreementsInPeriod } from './agreed-category.service';
import { formatCHF, formatSwissDate } from './pdf-format';
import { agreedIn, getUncategorizedInvoices, uncalculableKeyInvoices } from './held-invoices';
import { CodedError } from './coded-error';

// The correction is made without the wizard, which asks whether a category with costs and no answer is agreed (#91):
// it would drop out unasked, so the landlord answers in the wizard first (merge review W10c-2 C-1)
export async function refuseOpenAgreements(
	contractId: string,
	buildingId: string,
	periodStart: string,
	periodEnd: string,
	code = 'STATEMENT_AGREEMENTS_OPEN'
) {
	const [contract] = await db
		.select({ id: rentalContracts.id, startDate: rentalContracts.startDate, endDate: rentalContracts.endDate })
		.from(rentalContracts)
		.where(eq(rentalContracts.id, contractId));
	const open = (await agreementsInPeriod({ ...contract, buildingId }, periodStart, periodEnd)).filter((answer) => answer.agreed === null);
	if (!open.length) return;
	const named = await db
		.select({ name: categories.name, nameDE: categories.nameDE })
		.from(categories)
		.where(inArray(categories.id, open.map((answer) => answer.categoryId)));
	throw new CodedError(code, 'Whether the contract agrees these categories is not answered', {
		categories: named.map((category) => category.nameDE || category.name).join(', ')
	});
}

// #382: without the wizard, which holds them, an allocable invoice without category would go to every tenant unchecked
export async function refuseUncategorized(buildingId: string, periodStart: string, periodEnd: string, code = 'STATEMENT_UNCATEGORIZED_INVOICES') {
	const uncategorized = await getUncategorizedInvoices(buildingId, periodStart, periodEnd);
	if (!uncategorized.length) return;
	throw new CodedError(code, 'Allocable invoices of the period have no category', {
		invoices: uncategorized
			.map((invoice) => `${invoice.billingEntityName}, ${formatSwissDate(invoice.invoiceDate)}, CHF ${formatCHF(Number(invoice.amount))}`)
			.join('; ')
	});
}

// #1221 (product owner): a key that cannot be calculated for the building's apartments holds its invoices, one key at a time
// #1333 (product owner): sending a draft refuses too, then says to recalculate it (Fachreview 1333-1 V-1)
// of a statement only the invoices it bills (Fachreview 1333-1 V-2)
export async function refuseUncalculableKeys(
	buildingId: string,
	periodStart: string,
	periodEnd: string,
	then = 'STATEMENT_KEY_THEN_RETRY',
	statement: { agreedCategoryIds: string[] | null } = { agreedCategoryIds: null }
) {
	const failing = agreedIn(statement, await uncalculableKeyInvoices(buildingId, periodStart, periodEnd));
	if (!failing.length) return;
	const [{ distributionKeyName, buildingName, reason, apartment }] = failing;
	const held = failing.filter((invoice) => invoice.distributionKeyName === distributionKeyName);
	const delivery = held.find((invoice) => invoice.fuelStock); // of another period, it distributes the Veränderung Tankbestand (#1323)
	throw new CodedError('STATEMENT_KEY_NOT_CALCULABLE', 'The distribution key cannot be calculated for the apartments of the building', {
		key: distributionKeyName,
		building: buildingName,
		invoices: held
			.map((invoice) => `${invoice.billingEntityName}, ${formatSwissDate(invoice.invoiceDate)}, CHF ${formatCHF(Number(invoice.amount))}`)
			.join('; '),
		reason, // #1315: why, and for which apartment
		...(apartment && { apartment }),
		...(delivery && { fuelStock: 'STATEMENT_KEY_FUEL_STOCK', date: delivery.invoiceDate }),
		then
	});
}
