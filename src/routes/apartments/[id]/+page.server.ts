import type { ApartmentDetailsData, Apartment, Building, Tenant, RentalContract, MonthlyCosts, ContractHistory, ApartmentStatus } from '$lib/types';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { toContractHistory } from '$lib/server/contract-history';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ params, fetch }): Promise<ApartmentDetailsData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/apartments/${params.id}`);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Wohnung nicht gefunden');
			}
			throw error(response.status, 'Fehler beim Laden der Wohnung');
		}

		const data = await response.json();

		// Map building data (camelCase from backend)
		const building: Building = {
			id: data.building?.id || data.buildingId,
			name: data.building?.name || data.buildingName || '',
			address: data.building?.address || data.buildingAddress || '',
			postalCode: data.building?.postalCode || data.buildingPostalCode || '',
			city: data.building?.city || data.buildingCity || '',
			canton: data.building?.canton || data.buildingCanton || '',
			country: data.building?.country || 'CH'
		};

		// Map apartment data (camelCase from backend)
		const status: ApartmentStatus = data.status || (data.currentTenantId ? 'occupied' : 'vacant');
		const apartment: Apartment = {
			id: data.id,
			buildingId: data.buildingId,
			number: data.number || '',
			floor: data.floor || 0,
			area: data.area || '0',
			rooms: data.rooms || '0',
			status
		};

		// Map tenant data (camelCase from backend)
		const currentTenant: Tenant | null = data.currentTenant ? {
			id: data.currentTenant.id,
			firstName: data.currentTenant.firstName,
			lastName: data.currentTenant.lastName,
			email: data.currentTenant.email || null,
			phone: data.currentTenant.phone || null,
			language: data.currentTenant.language || 'de'
		} : null;

		// Map contract data (camelCase from backend)
		const currentContract: RentalContract | null = data.currentContract ? {
			id: data.currentContract.id,
			apartmentId: data.id,
			tenantId: data.currentContract.tenantId,
			startDate: data.currentContract.startDate,
			endDate: data.currentContract.endDate || null,
			baseRent: data.currentContract.baseRent || '0',
			additionalRent: data.currentContract.additionalRent || null,
			monthlyAdvancePayment: data.currentContract.monthlyAdvancePayment || '0'
		} : null;

		// Calculate monthly costs
		const baseRent = Number(currentContract?.baseRent || 0);
		const additionalRent = Number(currentContract?.additionalRent || 0);
		const advancePayment = Number(currentContract?.monthlyAdvancePayment || 0);

		const monthlyCosts: MonthlyCosts = {
			baseRent,
			advancePayment,
			additionalRent,
			totalBrutto: baseRent + additionalRent + advancePayment
		};

		// Map contract history (camelCase from backend)
		const contractHistory: ContractHistory[] = (data.contractHistory || []).map(
			(c: Record<string, string>) =>
				toContractHistory(c, { firstName: c.tenantFirstName ?? '', lastName: c.tenantLastName ?? '' })
		);


		return {
			apartment,
			building,
			currentTenant,
			currentContract,
			monthlyCosts,
			contractHistory
		};
	} catch (err) {
		console.error('Failed to fetch apartment:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden der Wohnung');
	}
};
