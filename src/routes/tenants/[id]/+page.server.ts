import { m } from '$lib/paraglide/messages';
import { fail, redirect } from '@sveltejs/kit';
import { deleteDocument, loadDocuments, uploadDocument } from '$lib/server/documents';
import { loadTenant } from '$lib/server/tenant';
import { monthlyTotal, toContractHistory } from '$lib/server/contract-history';
import { backendMessage } from '$lib/backend-error';
import type { Tenant } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
type BackendContract = Record<string, any>;

const apartmentOf = (c: BackendContract) =>
	m.buildings_apartment_number({ number: c.apartmentNumber });

// The running contract, otherwise the next one the tenant moves in with: the backend names it (H-28, #717)
function currentRental(contracts: BackendContract[], tenant: Tenant) {
	const contract = contracts.find((c) => c.id === tenant.rentalContractId);
	if (!contract) return null;
	return {
		contractId: contract.id as string,
		apartmentId: contract.apartmentId as string,
		apartment: apartmentOf(contract),
		building: contract.buildingName as string,
		monthlyTotal: monthlyTotal(contract),
		startDate: contract.startDate as string,
		upcoming: !!tenant.isFuture
	};
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	const tenant = await loadTenant(fetch, params.id);
	const { contracts } = await (
		await fetch(`${API}/contracts?tenantId=${params.id}&limit=100`)
	).json();
	const name = `${tenant.firstName} ${tenant.lastName}`;
	const [documents, former] = await Promise.all([
		loadDocuments(fetch, `tenantId=${tenant.id}`),
		// whether the tenant is a former one and which uploads predate the last end, the backend decides (#788)
		fetch(`${API}/tenants/${tenant.id}/former-documents`)
			.then(async (response) => (await response.json()).formerDocuments)
			.catch(() => null)
	]);
	// without the documents (they did not load) there is nothing to name
	const before = documents.filter((d) => former?.documentIds.includes(d.id));
	const formerDocuments = before.length
		? {
				endDate: former.endDate as string,
				contractId: former.contractId as string,
				checkedOn: former.checkedOn as string | null,
				documents: before
			}
		: null;

	return {
		tenant,
		rental: currentRental(contracts, tenant),
		contractHistory: contracts.map((c: BackendContract) => ({
			...toContractHistory(c, name),
			apartment: apartmentOf(c)
		})),
		documents,
		formerDocuments
	};
};

export const actions: Actions = {
	upload: async ({ params, fetch, request }) => uploadDocument(fetch, params.id, await request.formData()),
	deleteDocument: async ({ fetch, request }) => deleteDocument(fetch, await request.formData()),
	// «Als geprüft markieren» (#459): stored on the last contract, so the overview task ends
	checkDocuments: async ({ fetch, request }) => {
		const contractId = (await request.formData()).get('contractId');
		const response = await fetch(`${API}/contracts/${contractId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ documentsChecked: true })
		});
		if (!response.ok) return fail(response.status, { checkError: m.contracts_save_failed() });
	},
	// «Mieter anonymisieren» (#459): the replacement name in the landlord's language
	anonymise: async ({ params, fetch }) => {
		const response = await fetch(`${API}/tenants/${params.id}/anonymise`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				firstName: m.tenants_anonymised_first_name(),
				lastName: m.tenants_anonymised_last_name()
			})
		});
		if (!response.ok)
			return fail(response.status, {
				anonymiseError: backendMessage(
					await response.json().catch(() => null),
					m.tenants_anonymise_failed()
				)
			});
	},
	delete: async ({ params, fetch }) => {
		const response = await fetch(`${API}/tenants/${params.id}`, { method: 'DELETE' });
		// The backend keeps tenants with rental contracts: statements and documents refer to them
		if (!response.ok)
			return fail(response.status, {
				error: m.tenants_delete_failed()
			});
		throw redirect(303, '/tenants');
	}
};
