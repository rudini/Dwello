import type { RentalContract, Tenant, Apartment, Building } from '$lib/types';
import { error } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface ContractDetailsData {
	contract: RentalContract & {
		tenant: Tenant;
		apartment: Apartment;
		building: Building;
	};
	rentBreakdown: {
		baseRent: number;
		additionalRent: number;
		advancePayment: number;
		total: number;
	};
}

export const load = async ({ params, fetch }): Promise<ContractDetailsData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/contracts/${params.id}`);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Vertrag nicht gefunden');
			}
			throw error(response.status, 'Fehler beim Laden des Vertrags');
		}

		const data = await response.json();

		const baseRent = Number(data.baseRent) || 0;
		const additionalRent = Number(data.additionalRent) || 0;
		const advancePayment = Number(data.advancePayment) || 0;

		const contract = {
			id: data.id,
			apartment_id: data.apartmentId,
			tenant_id: data.tenantId,
			start_date: data.startDate,
			end_date: data.endDate,
			base_rent_chf: baseRent,
			additional_rent_chf: additionalRent,
			advance_payment_chf: advancePayment,
			status: data.endDate ? 'Beendet' as const : 'Aktiv' as const,
			tenant: {
				id: data.tenant?.id || data.tenantId,
				first_name: data.tenant?.firstName || '',
				last_name: data.tenant?.lastName || '',
				email: data.tenant?.email || '',
				phone_number: data.tenant?.phone || ''
			},
			apartment: {
				id: data.apartment?.id || data.apartmentId,
				building_id: data.apartment?.buildingId || '',
				floor: data.apartment?.floor || '',
				address_unit: data.apartment?.number || '',
				size_m2: data.apartment?.area ? Number(data.apartment.area) : undefined,
				room_count: data.apartment?.rooms ? Number(data.apartment.rooms) : undefined,
				occupancy_status: 'Vermietet' as const
			},
			building: {
				id: data.building?.id || '',
				name: data.building?.name || '',
				address: data.building?.address || '',
				postalCode: data.building?.postalCode || '',
				city: data.building?.city || ''
			}
		};

		return {
			contract,
			rentBreakdown: {
				baseRent,
				additionalRent,
				advancePayment,
				total: baseRent + additionalRent + advancePayment
			}
		};
	} catch (err) {
		console.error('Failed to fetch contract:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden des Vertrags');
	}
};
