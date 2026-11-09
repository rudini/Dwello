/**
 * #1409: the Jahresbericht of a building and a calendar year: the Mietertrag the contracts agree for the year, a broken
 * month by its days as the Akonto of a statement (`advanceLines`), not checked against payments
 */

import { and, eq, gte, inArray, lte, min, or, isNull } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, contractAdvancePayments, invoices, rentalContracts } from '../db/schema';
import { advanceLines } from './advance-payment.service';
import { roundToRappen } from './pdf-format';
import type { AnnualReportBody } from '../api/report';

type Amounts = { validFrom: string; amount: number }[];
const sum = (values: number[]) => roundToRappen(values.reduce((total, value) => total + value, 0));

export async function annualReport(buildingId: string, year: number): Promise<AnnualReportBody> {
	const [start, end] = [`${year}-01-01`, `${year}-12-31`];
	const contracts = await db
		.select({
			id: rentalContracts.id,
			startDate: rentalContracts.startDate,
			endDate: rentalContracts.endDate,
			baseRent: rentalContracts.baseRent,
			additionalRent: rentalContracts.additionalRent,
			flatRateUtilityCharge: rentalContracts.flatRateUtilityCharge
		})
		.from(rentalContracts)
		.innerJoin(apartments, eq(apartments.id, rentalContracts.apartmentId))
		.where(and(eq(apartments.buildingId, buildingId), lte(rentalContracts.startDate, end), or(isNull(rentalContracts.endDate), gte(rentalContracts.endDate, start))));
	const advances = contracts.length
		? await db.select().from(contractAdvancePayments).where(inArray(contractAdvancePayments.contractId, contracts.map(({ id }) => id)))
		: [];

	const income = { netRent: [] as number[], additionalRent: [] as number[], advancePayments: [] as number[], flatRateUtilityCharge: [] as number[] };
	for (const contract of contracts) {
		const from = new Date(contract.startDate > start ? contract.startDate : start);
		const to = new Date(contract.endDate && contract.endDate < end ? contract.endDate : end);
		const over = (amounts: Amounts) => sum(advanceLines(amounts, from, to).map(({ total }) => total));
		const fixed = (amount: string | null) => over([{ validFrom: contract.startDate, amount: parseFloat(amount ?? '0') }]);
		income.netRent.push(fixed(contract.baseRent));
		income.additionalRent.push(fixed(contract.additionalRent));
		income.flatRateUtilityCharge.push(fixed(contract.flatRateUtilityCharge));
		income.advancePayments.push(
			over(advances.filter(({ contractId }) => contractId === contract.id).map(({ validFrom, amount }) => ({ validFrom, amount: parseFloat(amount) })))
		);
	}
	const totals = {
		netRent: sum(income.netRent),
		additionalRent: sum(income.additionalRent),
		advancePayments: sum(income.advancePayments),
		flatRateUtilityCharge: sum(income.flatRateUtilityCharge)
	};
	return { year, firstYear: await firstYear(buildingId, year), income: { ...totals, total: sum(Object.values(totals)) } };
}

/** The year of the building's first contract or invoice; without any, the year asked */
async function firstYear(buildingId: string, year: number) {
	const [[contract], [invoice]] = await Promise.all([
		db
			.select({ first: min(rentalContracts.startDate) })
			.from(rentalContracts)
			.innerJoin(apartments, eq(apartments.id, rentalContracts.apartmentId))
			.where(eq(apartments.buildingId, buildingId)),
		db.select({ first: min(invoices.invoiceDate) }).from(invoices).where(eq(invoices.buildingId, buildingId))
	]);
	const years = [contract?.first, invoice?.first].filter(Boolean).map((day) => Number(day!.slice(0, 4)));
	return Math.min(year, ...years);
}
