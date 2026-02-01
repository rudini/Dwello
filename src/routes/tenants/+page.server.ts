import type { TenantsListData, TenantWithOccupancy } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load = async ({ url, fetch }): Promise<TenantsListData> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '12', 10);
	const search = url.searchParams.get('search') || '';
	const status = url.searchParams.get('status') || '';

	try {
		const params = new URLSearchParams();
		params.set('limit', String(pageSize));
		params.set('offset', String((page - 1) * pageSize));
		if (search) params.set('search', search);
		if (status) params.set('status', status);

		const response = await fetch(`${BACKEND_URL}/api/v1/tenants?${params}`);
		const data = await response.json();

		const tenants: TenantWithOccupancy[] = (data.data || []).map((t: Record<string, unknown>) => ({
			id: t.id,
			first_name: t.firstName || '',
			last_name: t.lastName || '',
			email: t.email || '',
			phone_number: t.phone || '',
			address: t.address || '',
			postal_code: t.postalCode || '',
			city: t.city || '',
			current_apartment: t.currentApartment
				? `Wohnung ${(t.currentApartment as Record<string, string>).number}`
				: undefined,
			current_building: (t.currentBuilding as Record<string, string>)?.name || undefined,
			contract_status: t.hasActiveContract ? 'Aktiv' : null
		}));

		return {
			tenants,
			total: data.total || 0,
			page,
			pageSize
		};
	} catch (error) {
		console.error('Failed to fetch tenants:', error);
		return {
			tenants: [],
			total: 0,
			page,
			pageSize
		};
	}
};
