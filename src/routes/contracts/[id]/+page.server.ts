import type { RentalContract, Tenant, Apartment, Building, ApartmentStatus } from '$lib/types';
import type { PageServerLoad } from './$types';
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

export const load: PageServerLoad = async ({ params, fetch }): Promise<ContractDetailsData> => {
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
		const advancePayment = Number(data.monthlyAdvancePayment || data.advancePayment) || 0;

		const apartmentStatus: ApartmentStatus = data.apartment?.status || 'occupied';
		const contract: RentalContract & { tenant: Tenant; apartment: Apartment; building: Building } = {
			id: data.id,
			apartmentId: data.apartmentId,
			tenantId: data.tenantId,
			startDate: data.startDate,
			endDate: data.endDate || null,
			baseRent: data.baseRent || '0',
			additionalRent: data.additionalRent || null,
			monthlyAdvancePayment: data.monthlyAdvancePayment || '0',
			tenant: {
				id: data.tenant?.id || data.tenantId,
				firstName: data.tenant?.firstName || '',
				lastName: data.tenant?.lastName || '',
				email: data.tenant?.email || null,
				phone: data.tenant?.phone || null,
				language: data.tenant?.language || 'de'
			},
			apartment: {
				id: data.apartment?.id || data.apartmentId,
				buildingId: data.apartment?.buildingId || '',
				number: data.apartment?.number || '',
				floor: data.apartment?.floor || 0,
				area: data.apartment?.area || '0',
				rooms: data.apartment?.rooms || '0',
				status: apartmentStatus
			},
			building: {
				id: data.building?.id || '',
				name: data.building?.name || '',
				address: data.building?.address || '',
				postalCode: data.building?.postalCode || '',
				city: data.building?.city || '',
				canton: data.building?.canton || ''
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
