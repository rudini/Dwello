import type { ContractHistory } from '$lib/types';
import { contractStatusOn, localToday } from '$lib/contract-status';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
type BackendContract = Record<string, any>;

const amount = (value: unknown) => Number(value ?? 0);

/** Monatlich total of a contract: base rent, additional rent and advance payment */
export const monthlyTotal = (c: BackendContract) =>
	amount(c.baseRent) + amount(c.additionalRent) + amount(c.monthlyAdvancePayment);

/** Running today, ended, or signed for later */
export const contractStatus = (c: BackendContract): ContractHistory['status'] =>
	contractStatusOn(c.startDate, c.endDate, localToday());

/** One row of a contract history (apartment or tenant page) */
export const toContractHistory = (c: BackendContract, tenantName: string): ContractHistory => ({
	id: c.id,
	tenantName,
	monthlyTotal: monthlyTotal(c),
	status: contractStatus(c),
	startDate: c.startDate,
	endDate: c.endDate ?? null,
	terminated: !!c.terminated
});
