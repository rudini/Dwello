import type { RentalContract } from '$lib/types';
import { error } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface ContractEditData {
	contract: RentalContract;
	tenants: { id: string; name: string }[];
	apartments: { id: string; unit: string; building: string; status: string }[];
}

export const load = async ({ params, fetch }): Promise<ContractEditData> => {
	try {
		const [contractRes, tenantsRes, apartmentsRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/contracts/${params.id}`),
			fetch(`${BACKEND_URL}/api/v1/tenants?limit=100`),
			fetch(`${BACKEND_URL}/api/v1/apartments?limit=100`)
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
			apartment_id: data.apartmentId,
			tenant_id: data.tenantId,
			start_date: data.startDate,
			end_date: data.endDate,
			base_rent_chf: Number(data.baseRent) || 0,
			additional_rent_chf: Number(data.additionalRent) || 0,
			advance_payment_chf: Number(data.advancePayment) || 0,
			status: data.endDate ? 'Beendet' : 'Aktiv'
		};

		const tenants = (tenantsData.data || []).map((t: Record<string, unknown>) => ({
			id: t.id,
			name: `${t.firstName} ${t.lastName}`
		}));

		const apartments = (apartmentsData.data || []).map((a: Record<string, unknown>) => ({
			id: a.id,
			unit: a.number || '',
			building: (a.building as Record<string, string>)?.name || '',
			status: a.currentTenantId ? 'Vermietet' : 'Leer'
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
