import type { ContractsListData, ContractWithDetails } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load = async ({ url, fetch }): Promise<ContractsListData> => {
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
		if (status === 'active') params.set('status', 'active');
		if (status === 'ended') params.set('status', 'ended');

		const [contractsRes, buildingsRes, apartmentsRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/contracts?${params}`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`),
			fetch(`${BACKEND_URL}/api/v1/apartments?limit=100`)
		]);

		const contractsData = await contractsRes.json();
		const buildingsData = await buildingsRes.json();
		const apartmentsData = await apartmentsRes.json();

		const contracts: ContractWithDetails[] = (contractsData.data || []).map((c: Record<string, unknown>) => ({
			id: c.id,
			apartment_id: c.apartmentId,
			tenant_id: c.tenantId,
			start_date: c.startDate,
			end_date: c.endDate,
			base_rent_chf: Number(c.baseRent) || 0,
			additional_rent_chf: Number(c.additionalRent) || 0,
			advance_payment_chf: Number(c.advancePayment) || 0,
			status: c.endDate ? 'Beendet' : 'Aktiv',
			tenant_name: c.tenant
				? `${(c.tenant as Record<string, string>).firstName} ${(c.tenant as Record<string, string>).lastName}`
				: '',
			tenant_first_name: (c.tenant as Record<string, string>)?.firstName || '',
			tenant_last_name: (c.tenant as Record<string, string>)?.lastName || '',
			apartment_unit: (c.apartment as Record<string, string>)?.number || '',
			building_name: (c.building as Record<string, string>)?.name || '',
			building_address: (c.building as Record<string, string>)?.address || '',
			total_rent: Number(c.baseRent || 0) + Number(c.additionalRent || 0) + Number(c.advancePayment || 0)
		}));

		const buildings = (buildingsData.buildings || buildingsData.data || []).map((b: Record<string, unknown>) => ({
			id: b.id,
			name: b.name || '',
			address: b.address || ''
		}));

		const apartments = (apartmentsData.data || []).map((a: Record<string, unknown>) => ({
			id: a.id,
			unit: a.number || '',
			building_id: a.buildingId
		}));

		return {
			contracts,
			total: contractsData.total || 0,
			page,
			pageSize,
			buildings,
			apartments
		};
	} catch (error) {
		console.error('Failed to fetch contracts:', error);
		return {
			contracts: [],
			total: 0,
			page,
			pageSize,
			buildings: [],
			apartments: []
		};
	}
};
