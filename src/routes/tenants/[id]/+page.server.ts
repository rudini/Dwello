import type { Tenant, ContractHistory } from '$lib/types';
import type { PageServerLoad } from './$types';
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

export const load: PageServerLoad = async ({ params, fetch }): Promise<TenantDetailsData> => {
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
			firstName: data.firstName || '',
			lastName: data.lastName || '',
			email: data.email || null,
			phone: data.phone || null,
			language: data.language || 'de',
			address: data.address || null,
			postalCode: data.postalCode || null,
			city: data.city || null
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
			id: c.id as string,
			tenantName: `${tenant.firstName} ${tenant.lastName}`,
			tenantFirstName: tenant.firstName,
			tenantLastName: tenant.lastName,
			period: c.endDate
				? `${formatDate(c.startDate as string)} - ${formatDate(c.endDate as string)}`
				: `${formatDate(c.startDate as string)} - heute`,
			rentBrutto: Number(c.baseRent || 0) + Number(c.additionalRent || 0) + Number(c.advancePayment || 0),
			isActive: !c.endDate,
			startDate: c.startDate as string,
			endDate: (c.endDate as string) || null
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
