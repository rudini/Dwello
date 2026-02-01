import type { ApartmentsListData, ApartmentWithBuilding } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load = async ({ url, fetch }): Promise<ApartmentsListData> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '12', 10);
	const search = url.searchParams.get('search') || '';
	const buildingId = url.searchParams.get('building') || '';
	const status = url.searchParams.get('status') || '';

	try {
		const params = new URLSearchParams();
		params.set('limit', String(pageSize));
		params.set('offset', String((page - 1) * pageSize));
		if (search) params.set('search', search);
		if (buildingId) params.set('buildingId', buildingId);
		if (status) params.set('status', status);

		const [apartmentsRes, buildingsRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/apartments?${params}`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`)
		]);

		const apartmentsData = await apartmentsRes.json();
		const buildingsData = await buildingsRes.json();

		const apartments: ApartmentWithBuilding[] = (apartmentsData.data || []).map((a: Record<string, unknown>) => ({
			id: a.id,
			building_id: a.buildingId,
			floor: a.floor || '',
			address_unit: a.number || '',
			size_m2: a.area ? Number(a.area) : undefined,
			room_count: a.rooms ? Number(a.rooms) : undefined,
			occupancy_status: a.currentTenantId ? 'Vermietet' : 'Leer',
			building_name: (a.building as Record<string, string>)?.name || '',
			building_address: (a.building as Record<string, string>)?.address || '',
			building_city: (a.building as Record<string, string>)?.city || '',
			current_tenant_name: a.currentTenant
				? `${(a.currentTenant as Record<string, string>).firstName} ${(a.currentTenant as Record<string, string>).lastName}`
				: undefined,
			current_rent: a.currentRent ? Number(a.currentRent) : undefined
		}));

		const buildings = (buildingsData.buildings || buildingsData.data || []).map((b: Record<string, unknown>) => ({
			id: b.id,
			name: b.name || '',
			address: b.address || ''
		}));

		return {
			apartments,
			total: apartmentsData.total || 0,
			page,
			pageSize,
			buildings
		};
	} catch (error) {
		console.error('Failed to fetch apartments:', error);
		return {
			apartments: [],
			total: 0,
			page,
			pageSize,
			buildings: []
		};
	}
};
