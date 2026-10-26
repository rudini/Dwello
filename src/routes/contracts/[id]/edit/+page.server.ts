import { m } from '$lib/paraglide/messages';
import type { Json, RentalContract } from '$lib/types';
import type { ContractResponse } from '../../../../../backend/src/api/contract';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { agreeableCategories } from '$lib/server/category';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface ContractEditData {
	contract: RentalContract;
	tenant: string; // tenant and apartment are fixed (#152): the form only names them
	apartment: string;
	categories: { id: string; name: string }[]; // the umlagefähige ones it can agree (#91)
}

export const load: PageServerLoad = async ({ params, fetch }): Promise<ContractEditData> => {
	try {
		const contractRes = await fetch(`${BACKEND_URL}/api/v1/contracts/${params.id}`);

		if (!contractRes.ok) {
			if (contractRes.status === 404) {
				throw error(404, m.contracts_not_found());
			}
			throw error(contractRes.status, m.contracts_load_failed());
		}

		const { tenant, apartment, building, ...contract }: Json<ContractResponse> =
			await contractRes.json();

		return {
			contract,
			categories: await agreeableCategories(fetch),
			tenant: `${tenant.firstName} ${tenant.lastName}`,
			apartment: `${m.buildings_apartment_number({ number: apartment.number })} · ${building.name || building.address}`
		};
	} catch (err) {
		console.error('Failed to fetch contract for edit:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, m.contracts_load_failed());
	}
};
