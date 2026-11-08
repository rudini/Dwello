import { calculateBuildingDistribution } from './distribution-key.service';
import { apartmentsOf } from './apartment.service';
import { countingWith, cutDays } from './prorating.service';
import { getInvoice, getInvoicesForStatement } from './invoice.service';
import { fuelStockChange } from './fuel-stock.service';

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

/** The invoices of the list a statement bills: of the categories its Mietvertrag agreed when it was created, and those
 * without one; a statement before #91 billed every one */
export const agreedIn = <T extends { categoryId: string | null }>(statement: { agreedCategoryIds: string[] | null }, list: T[]) =>
	list.filter((invoice) => !statement.agreedCategoryIds || !invoice.categoryId || statement.agreedCategoryIds.includes(invoice.categoryId));

// #1315 (product owner): why a key fails for the building, and for which apartment if it fails for one
const REASONS: Record<string, string> = { FORMULA_NEGATIVE: 'NEGATIVE', FORMULA_ALL_ZERO: 'ALL_ZERO', FORMULA_NOT_A_NUMBER: 'DIVISION_BY_ZERO' };
type Apartments = Awaited<ReturnType<typeof apartmentsOf>>;
async function failureAmong(keyId: string, apartments: { id: string; number: string; area: number; rooms: number }[]) {
	const result = await calculateBuildingDistribution(keyId, apartments, 1);
	if (result.isValid) return null;
	const code = result.errorCode?.code === 'FORMULA_APARTMENT_FAILED' ? String(result.errorCode.params.reason) : result.errorCode?.code;
	const apartment = apartments.find((one) => one.id === result.apartmentId)?.number ?? null;
	return { reason: `STATEMENT_KEY_REASON_${REASONS[code ?? ''] ?? 'OTHER'}`, apartment };
}

// #1336: over the apartments the calculation counts in each part of the period, with their values of that day (#1284,
// «Aufgehoben ab»; #1301, code review 1309-5 C-1)
async function keyFailure(keyId: string, apartments: Apartments, start: string, end: string) {
	for (const day of [start, ...cutDays(apartments, start, end)]) {
		const counted = countingWith(apartments, day);
		const failure = counted.length ? await failureAmong(keyId, counted) : null;
		if (failure) return failure;
	}
	return null;
}

/**
 * #1221 (product owner): the invoices whose Verteilschlüssel cannot be calculated for the building's apartments, with
 * the key's name and why (#1315); the run holds them instead of splitting them equally. The period's invoices and the
 * delivery whose key distributes the Veränderung Tankbestand, also of another period (#1323, marked fuelStock)
 */
export async function uncalculableKeyInvoices(buildingId: string, start: string, end: string) {
	const [bills, apartments, [stock]] = await Promise.all([
		getInvoicesForStatement(buildingId, start, end),
		apartmentsOf(buildingId),
		fuelStockChange(buildingId, start, end)
	]);
	if (!apartments.length) return [];
	const deliveryId = stock?.distributionKey?.deliveryId;
	const delivery = deliveryId && !bills.some((bill) => bill.id === deliveryId) ? await getInvoice(deliveryId) : null;
	const all = [...bills, ...(delivery ? [{ ...delivery, fuelStock: true }] : [])];
	const failures = new Map<string, Awaited<ReturnType<typeof keyFailure>>>();
	for (const id of new Set(all.flatMap((bill) => bill.distributionKeyId ?? []))) failures.set(id, await keyFailure(id, apartments, start, end));
	return all
		.filter((bill) => failures.get(bill.distributionKeyId!))
		.map(({ id, billingEntityName, description, invoiceDate, amount, categoryId, distributionKeyId, distributionKey, building, ...rest }) => ({
			id,
			billingEntityName,
			description,
			invoiceDate,
			amount,
			categoryId,
			distributionKeyName: distributionKey!.nameDE || distributionKey!.name,
			buildingName: building!.name,
			...failures.get(distributionKeyId!)!,
			...('fuelStock' in rest && { fuelStock: true })
		}));
}
