import type { ContractHistory, Json } from '$lib/types';
import type { ContractWithDetails } from '../../../backend/src/api/contract';

/** A row of `GET /contracts` as its JSON arrives */
export type ContractRow = Json<ContractWithDetails>;

const amount = (value: unknown) => Number(value ?? 0);

/** Monatlich total of a contract: base rent, additional rent, Akonto and Nebenkostenpauschale (#429) */
export const monthlyTotal = (c: Partial<ContractRow>) =>
	amount(c.baseRent) +
	amount(c.additionalRent) +
	amount(c.monthlyAdvancePayment) +
	amount(c.flatRateUtilityCharge);

/** One row of a contract history (apartment or tenant page) */
export const toContractHistory = (
	c: Pick<ContractRow, 'id' | 'startDate' | 'status'> & Partial<ContractRow>,
	tenantName: string
): ContractHistory => ({
	id: c.id,
	tenantName,
	monthlyTotal: monthlyTotal(c),
	status: c.status, // running today, ended or signed for later, by the Swiss day (H-28, #717)
	startDate: c.startDate,
	endDate: c.endDate ?? null,
	terminated: !!c.terminated
});
