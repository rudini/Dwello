import { fail, redirect } from '@sveltejs/kit';
import { loadDocuments } from '$lib/server/documents';
import { loadTenant } from '$lib/server/tenant';
import { contractStatus, grossRent, toContractHistory } from '$lib/server/contract-history';
import type { Actions, PageServerLoad } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
type BackendContract = Record<string, any>;

const apartmentOf = (c: BackendContract) => `Wohnung ${c.apartmentNumber}`;

// The running contract, otherwise the next one the tenant moves in with
function currentRental(contracts: BackendContract[]) {
	const contract =
		contracts.find((c) => contractStatus(c) === 'active') ??
		contracts
			.filter((c) => contractStatus(c) === 'future')
			.sort((a, b) => (a.startDate < b.startDate ? -1 : 1))[0];
	if (!contract) return null;
	return {
		contractId: contract.id as string,
		apartmentId: contract.apartmentId as string,
		apartment: apartmentOf(contract),
		building: contract.buildingName as string,
		rent: grossRent(contract),
		startDate: contract.startDate as string,
		upcoming: contractStatus(contract) === 'future'
	};
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	const tenant = await loadTenant(fetch, params.id);
	const { contracts } = await (
		await fetch(`${API}/contracts?tenantId=${params.id}&limit=100`)
	).json();
	const name = `${tenant.firstName} ${tenant.lastName}`;

	return {
		tenant,
		rental: currentRental(contracts),
		contractHistory: contracts.map((c: BackendContract) => ({
			...toContractHistory(c, name),
			apartment: apartmentOf(c)
		})),
		documents: await loadDocuments(fetch, `tenantId=${tenant.id}`)
	};
};

export const actions: Actions = {
	delete: async ({ params, fetch }) => {
		const response = await fetch(`${API}/tenants/${params.id}`, { method: 'DELETE' });
		// The backend keeps tenants with rental contracts: statements and documents refer to them
		if (!response.ok)
			return fail(response.status, {
				error: 'Mieter mit Mietverträgen können nicht gelöscht werden.'
			});
		throw redirect(303, '/tenants');
	}
};
