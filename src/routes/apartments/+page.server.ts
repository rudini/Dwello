import type { ApartmentWithDetails as ApiApartment } from '../../../backend/src/api/apartment';
import type { ApartmentsListData, ApartmentWithBuilding, Json } from '$lib/types';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ url, fetch }): Promise<ApartmentsListData> => {
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
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=1000`)
		]);

		const apartmentsData = await apartmentsRes.json();
		const buildingsData = await buildingsRes.json();

		const apartments: ApartmentWithBuilding[] = (
			apartmentsData.apartments ||
			apartmentsData.data ||
			[]
		).map((a: Json<ApiApartment>) => ({
			id: a.id,
			buildingId: a.buildingId,
			number: a.number || '',
			floor: a.floor || 0,
			area: a.area || '0',
			rooms: a.rooms || '0',
			status: a.status || 'vacant',
			buildingName: a.buildingName || '',
			nextContractStart: a.nextContractStart ?? null,
			currentContractEnd: a.currentContractEnd ?? null,
			lastContractEnd: a.lastContractEnd ?? null
		}));

		const buildings = (buildingsData.buildings || buildingsData.data || []).map(
			(b: Record<string, unknown>) => ({
				id: b.id,
				name: b.name || '',
				address: b.address || ''
			})
		);

		return {
			apartments,
			total: apartmentsData.total || 0,
			page,
			pageSize,
			buildings
		};
	} catch (err) {
		console.error('Failed to fetch apartments:', err);
		return {
			apartments: [],
			total: 0,
			page,
			pageSize,
			buildings: []
		};
	}
};
