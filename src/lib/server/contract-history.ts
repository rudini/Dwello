import type { ContractHistory } from '$lib/types';
import { contractStatusOn } from '$lib/contract-status';
import { formatDate } from '$lib/utils/format';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
type BackendContract = Record<string, any>;

const amount = (value: unknown) => Number(value ?? 0);

/** Gross monthly rent of a contract: base rent, additional costs and advance payment */
export const grossRent = (c: BackendContract) =>
	amount(c.baseRent) + amount(c.additionalRent) + amount(c.monthlyAdvancePayment);

/** Running today, ended, or signed for later */
export const contractStatus = (c: BackendContract): ContractHistory['status'] =>
	contractStatusOn(c.startDate, c.endDate, new Date().toISOString().split('T')[0]);

/** One row of a contract history (apartment or tenant page) */
export const toContractHistory = (c: BackendContract, tenantName: string): ContractHistory => ({
	id: c.id,
	tenantName,
	period: `${formatDate(c.startDate)} - ${c.endDate ? formatDate(c.endDate) : 'heute'}`,
	rentBrutto: grossRent(c),
	status: contractStatus(c),
	startDate: c.startDate,
	endDate: c.endDate ?? null
});
