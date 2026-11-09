/**
 * #1409: the Mietertrag of the Jahresbericht: Nettomiete, Zusatzmiete and Nebenkostenpauschale the contracts of the
 * building agree for the year, a broken month by its days as in `advanceLines`; not checked against payments
 * (PO 09.11.2026, V-13 option 2)
 */

import { and, eq, gte, isNull, lte, or } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, rentalContracts } from '../db/schema';
import { advanceLines } from './advance-payment.service';
import { roundToRappen } from './pdf-format';

/** Amounts added up, to the Rappen */
export const sum = (values: number[]) => roundToRappen(values.reduce((total, value) => total + value, 0));

export async function incomeOf(buildingId: string, start: string, end: string) {
	const contracts = await db
		.select({
			startDate: rentalContracts.startDate,
			endDate: rentalContracts.endDate,
			baseRent: rentalContracts.baseRent,
			additionalRent: rentalContracts.additionalRent,
			flatRateUtilityCharge: rentalContracts.flatRateUtilityCharge
		})
		.from(rentalContracts)
		.innerJoin(apartments, eq(apartments.id, rentalContracts.apartmentId))
		.where(
			and(
				eq(apartments.buildingId, buildingId),
				lte(rentalContracts.startDate, end),
				or(isNull(rentalContracts.endDate), gte(rentalContracts.endDate, start))
			)
		);
	const over = (amount: (contract: (typeof contracts)[number]) => string | null) =>
		sum(
			contracts.flatMap((contract) =>
				advanceLines(
					[{ validFrom: contract.startDate, amount: parseFloat(amount(contract) ?? '0') }],
					new Date(contract.startDate > start ? contract.startDate : start),
					new Date(contract.endDate && contract.endDate < end ? contract.endDate : end)
				).map(({ total }) => total)
			)
		);
	const amounts = {
		netRent: over((c) => c.baseRent),
		additionalRent: over((c) => c.additionalRent),
		flatRateUtilityCharge: over((c) => c.flatRateUtilityCharge)
	};
	return { ...amounts, total: sum(Object.values(amounts)) };
}
