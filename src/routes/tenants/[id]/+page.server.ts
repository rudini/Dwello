import type { Tenant, ContractHistory } from '$lib/types';
import { error } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface TenantDetailsData {
	tenant: Tenant;
	currentOccupancy: {
		apartment: string;
		building: string;
		rent: number;
		startDate: string;
	} | null;
	contractHistory: ContractHistory[];
}

export const load = async ({ params, fetch }): Promise<TenantDetailsData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/tenants/${params.id}`);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Mieter nicht gefunden');
			}
			throw error(response.status, 'Fehler beim Laden des Mieters');
		}

		const data = await response.json();

		const tenant: Tenant = {
			id: data.id,
			first_name: data.firstName || '',
			last_name: data.lastName || '',
			email: data.email || '',
			phone_number: data.phone || '',
			address: data.address || '',
			postal_code: data.postalCode || '',
			city: data.city || ''
		};

		const currentOccupancy = data.currentContract ? {
			apartment: `Wohnung ${data.currentApartment?.number || ''}`,
			building: data.currentBuilding?.name || '',
			rent: Number(data.currentContract.baseRent || 0) +
			      Number(data.currentContract.additionalRent || 0) +
			      Number(data.currentContract.advancePayment || 0),
			startDate: formatDate(data.currentContract.startDate)
		} : null;

		const contractHistory: ContractHistory[] = (data.contracts || []).map((c: Record<string, unknown>) => ({
			id: c.id,
			tenant_name: `${tenant.first_name} ${tenant.last_name}`,
			tenant_first_name: tenant.first_name,
			tenant_last_name: tenant.last_name,
			period: c.endDate
				? `${formatDate(c.startDate as string)} - ${formatDate(c.endDate as string)}`
				: `${formatDate(c.startDate as string)} - heute`,
			rent_brutto: Number(c.baseRent || 0) + Number(c.additionalRent || 0) + Number(c.advancePayment || 0),
			status: c.endDate ? 'Beendet' : 'AKTIV',
			start_date: c.startDate as string,
			end_date: c.endDate as string | undefined
		}));

		return { tenant, currentOccupancy, contractHistory };
	} catch (err) {
		console.error('Failed to fetch tenant:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden des Mieters');
	}
};

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString('de-CH');
}
