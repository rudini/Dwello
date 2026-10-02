import type { ContractHistory } from '$lib/types';
import { loadDocuments } from '$lib/server/documents';
import { fetchTenant, toTenant } from '$lib/server/tenant';
import { grossRent, toContractHistory } from '$lib/server/contract-history';
import { formatDate } from '$lib/utils/format';
import type { PageServerLoad } from './$types';

type BackendTenant = Awaited<ReturnType<typeof fetchTenant>>;

// Apartment the tenant currently rents, if any
function currentOccupancy(data: BackendTenant) {
	if (!data.currentContract) return null;
	const { currentContract: contract, currentApartment = {}, currentBuilding = {} } = data;
	return {
		apartment: `Wohnung ${currentApartment.number}`,
		building: currentBuilding.name,
		rent: grossRent(contract),
		startDate: formatDate(contract.startDate)
	};
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	const data = await fetchTenant(fetch, params.id);
	const tenant = toTenant(data);

	return {
		tenant,
		currentOccupancy: currentOccupancy(data),
		contractHistory: (data.contracts ?? []).map((c: Record<string, unknown>) =>
			toContractHistory(c, `${tenant.firstName} ${tenant.lastName}`)
		) as ContractHistory[],
		documents: await loadDocuments(fetch, `tenantId=${tenant.id}`)
	};
};
