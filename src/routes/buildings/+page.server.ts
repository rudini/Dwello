import { countStatus } from '$lib/apartment';
import type { BuildingsListData } from '$lib/types';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ url, fetch }): Promise<BuildingsListData> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
	const search = url.searchParams.get('search') || '';
	const city = url.searchParams.get('city') || '';

	try {
		const params = new URLSearchParams();
		params.set('limit', String(pageSize));
		params.set('offset', String((page - 1) * pageSize));
		if (search) params.set('search', search);
		if (city) params.set('city', city);

		const [response, apartmentsRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/buildings?${params}`),
			fetch(`${BACKEND_URL}/api/v1/apartments?limit=1000`)
		]);
		const data = await response.json();
		const apartments: { buildingId: string; status: string }[] =
			(await apartmentsRes.json()).apartments ?? [];
		const inBuilding = (id: unknown) => apartments.filter((a) => a.buildingId === id);

		const buildings = (data.buildings || data.data || []).map((b: Record<string, unknown>) => ({
			id: b.id,
			name: b.name || '',
			address: b.address,
			postalCode: b.postalCode,
			city: b.city,
			canton: b.canton,
			country: b.country || 'CH',
			latitude: b.latitude ? Number(b.latitude) : undefined,
			longitude: b.longitude ? Number(b.longitude) : undefined,
			yearBuilt: b.yearBuilt ? Number(b.yearBuilt) : undefined,
			buildingType: b.buildingType,
			apartmentCount: Number(b.apartmentCount) || 0,
			occupiedCount: Number(b.occupiedCount) || 0,
			vacantCount: Number(b.vacantCount) || 0,
			reletCount: countStatus(inBuilding(b.id), 'relet'),
			reservedCount: countStatus(inBuilding(b.id), 'reserved')
		}));

		return {
			buildings,
			total: data.total || 0,
			page,
			pageSize
		};
	} catch (error) {
		console.error('Failed to fetch buildings:', error);
		return {
			buildings: [],
			total: 0,
			page,
			pageSize
		};
	}
};
