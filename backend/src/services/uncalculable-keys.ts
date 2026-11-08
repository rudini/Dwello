import { calculateBuildingDistribution } from './distribution-key.service';
import { listApartments } from './apartment.service';
import { getInvoicesForStatement } from './invoice.service';

/** The building's apartments with the values a Verteilschlüssel reads */
export async function apartmentsOf(buildingId: string) {
	const { apartments } = await listApartments({ buildingId, limit: 1000 });
	return apartments.map((a) => ({ id: a.id, area: parseFloat(a.area), rooms: parseFloat(a.rooms) }));
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
