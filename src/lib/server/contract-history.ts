import type { ContractHistory } from '$lib/types';
import { formatDate } from '$lib/utils/format';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
type BackendContract = Record<string, any>;

const amount = (value: unknown) => Number(value ?? 0);

/** Gross monthly rent of a contract: base rent, additional costs and advance payment */
export const grossRent = (c: BackendContract) =>
	amount(c.baseRent) + amount(c.additionalRent) + amount(c.advancePayment);

/** One row of a contract history (apartment or tenant page) */
export const toContractHistory = (
	c: BackendContract,
	tenant: { firstName: string; lastName: string }
): ContractHistory => ({
	id: c.id,
	tenantName: `${tenant.firstName} ${tenant.lastName}`.trim(),
	tenantFirstName: tenant.firstName,
	tenantLastName: tenant.lastName,
	period: `${formatDate(c.startDate)} - ${c.endDate ? formatDate(c.endDate) : 'heute'}`,
	rentBrutto: grossRent(c),
	isActive: !c.endDate,
	startDate: c.startDate,
	endDate: c.endDate ?? null
});
