import type { ApartmentDetailsData } from '$lib/types';
import { error } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load = async ({ params, fetch }): Promise<ApartmentDetailsData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/apartments/${params.id}`);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Wohnung nicht gefunden');
			}
			throw error(response.status, 'Fehler beim Laden der Wohnung');
		}

		const data = await response.json();

		const building = {
			id: data.building?.id || data.buildingId,
			name: data.building?.name || data.buildingName || '',
			address: data.building?.address || data.buildingAddress || '',
			postalCode: data.building?.postalCode || data.buildingPostalCode || '',
			city: data.building?.city || data.buildingCity || '',
			country: data.building?.country || 'CH'
		};

		const apartment = {
			id: data.id,
			building_id: data.buildingId,
			floor: data.floor || '',
			address_unit: data.number || '',
			size_m2: data.area ? Number(data.area) : undefined,
			room_count: data.rooms ? Number(data.rooms) : undefined,
			occupancy_status: data.currentTenantId ? 'Vermietet' as const : 'Leer' as const
		};

		const currentTenant = data.currentTenant ? {
			id: data.currentTenant.id,
			first_name: data.currentTenant.firstName,
			last_name: data.currentTenant.lastName,
			email: data.currentTenant.email || '',
			phone_number: data.currentTenant.phone || ''
		} : null;

		const currentContract = data.currentContract ? {
			id: data.currentContract.id,
			apartment_id: data.id,
			tenant_id: data.currentContract.tenantId,
			start_date: new Date(data.currentContract.startDate),
			base_rent_chf: Number(data.currentContract.baseRent) || 0,
			additional_rent_chf: Number(data.currentContract.additionalRent) || 0,
			advance_payment_chf: Number(data.currentContract.advancePayment) || 0,
			status: 'Aktiv' as const
		} : null;

		const baseRent = currentContract?.base_rent_chf || 0;
		const additionalRent = currentContract?.additional_rent_chf || 0;
		const advancePayment = currentContract?.advance_payment_chf || 0;

		const monthlyCosts = {
			base_rent: baseRent,
			advance_payment: advancePayment,
			parking: additionalRent,
			total_brutto: baseRent + additionalRent + advancePayment
		};

		const contractHistory = (data.contractHistory || []).map((c: Record<string, unknown>) => ({
			id: c.id,
			tenant_name: `${c.tenantFirstName || ''} ${c.tenantLastName || ''}`.trim(),
			tenant_first_name: c.tenantFirstName || '',
			tenant_last_name: c.tenantLastName || '',
			period: c.endDate
				? `${formatDate(c.startDate as string)} - ${formatDate(c.endDate as string)}`
				: `${formatDate(c.startDate as string)} - Heute`,
			rent_brutto: Number(c.baseRent || 0) + Number(c.additionalRent || 0) + Number(c.advancePayment || 0),
			status: c.endDate ? 'Beendet' as const : 'AKTIV' as const,
			start_date: new Date(c.startDate as string),
			end_date: c.endDate ? new Date(c.endDate as string) : undefined
		}));

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

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString('de-CH');
}
