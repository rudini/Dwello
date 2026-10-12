import type { RentalContract } from '$lib/types';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface ContractEditData {
	contract: RentalContract;
	tenants: { id: string; name: string }[];
	apartments: { id: string; unit: string; building: string; status: string }[];
}

export const load: PageServerLoad = async ({ params, fetch }): Promise<ContractEditData> => {
	try {
		const [contractRes, tenantsRes, apartmentsRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/contracts/${params.id}`),
			fetch(`${BACKEND_URL}/api/v1/tenants?limit=1000`), // far more than a small portfolio has, as in the wizard
			fetch(`${BACKEND_URL}/api/v1/apartments?limit=1000`)
		]);

		if (!contractRes.ok) {
			if (contractRes.status === 404) {
				throw error(404, 'Vertrag nicht gefunden');
			}
			throw error(contractRes.status, 'Fehler beim Laden des Vertrags');
		}

		const data = await contractRes.json();
		const tenantsData = await tenantsRes.json();
		const apartmentsData = await apartmentsRes.json();

		const contract: RentalContract = {
			id: data.id,
			apartmentId: data.apartmentId,
			tenantId: data.tenantId,
			startDate: data.startDate,
			endDate: data.endDate || null,
			terminated: !!data.terminated,
			baseRent: data.baseRent || '0',
			additionalRent: data.additionalRent || null,
			monthlyAdvancePayment: data.monthlyAdvancePayment || '0'
		};

		const tenants = (tenantsData.tenants || []).map((t: Record<string, unknown>) => ({
			id: t.id,
			name: `${t.firstName} ${t.lastName}`
		}));

		const apartments = (apartmentsData.apartments || []).map((a: Record<string, unknown>) => ({
			id: a.id,
			unit: a.number || '',
			building: (a.buildingName as string) || '',
			status: a.status || (a.currentTenantId ? 'occupied' : 'vacant')
		}));

		return { contract, tenants, apartments };
	} catch (err) {
		console.error('Failed to fetch contract for edit:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden des Vertrags');
	}
};
