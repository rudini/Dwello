import { calculateBuildingDistribution } from './distribution-key.service';
import { apartmentsOf } from './apartment.service';
import { getInvoicesForStatement } from './invoice.service';

// The invoices of a building's period that hold its statement run: the run waits until they are fixed
/**
 * The building's invoices the period would bill without a category (#382): Dwello checks the agreement of the
 * Mietvertrag through the category, so the run waits until each has one or is not allocable
 */
export async function getUncategorizedInvoices(buildingId: string, periodStart: string, periodEnd: string) {
	return (await getInvoicesForStatement(buildingId, periodStart, periodEnd))
		.filter((invoice) => !invoice.categoryId)
		.map(({ billingEntityName, invoiceDate, amount }) => ({ billingEntityName, invoiceDate, amount }));
}

/**
 * #1221 (product owner): the period's invoices whose Verteilschlüssel cannot be calculated for the building's
 * apartments, with the key's name; the run holds them instead of splitting them equally
 */
export async function uncalculableKeyInvoices(buildingId: string, start: string, end: string) {
	const [bills, apartments] = await Promise.all([getInvoicesForStatement(buildingId, start, end), apartmentsOf(buildingId)]);
	if (!apartments.length) return [];
	const failing: string[] = [];
	for (const id of new Set(bills.flatMap((bill) => bill.distributionKeyId ?? [])))
		if (!(await calculateBuildingDistribution(id, apartments, 1)).isValid) failing.push(id);
	return bills
		.filter((bill) => failing.includes(bill.distributionKeyId!))
		.map(({ id, billingEntityName, description, invoiceDate, amount, distributionKey, building }) => ({
			id,
			billingEntityName,
			description,
			invoiceDate,
			amount,
			distributionKeyName: distributionKey!.nameDE || distributionKey!.name,
			buildingName: building!.name
		}));
}
