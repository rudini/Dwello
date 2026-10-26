import { m } from '$lib/paraglide/messages';
import { toTenant } from '$lib/server/tenant';
import type { TenantWithOccupancy } from '../../../backend/src/services/tenant.service';
import type { Json, TenantsListData, TenantListItem } from '$lib/types';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ url, fetch }): Promise<TenantsListData> => {
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

		const [response, futureData] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/tenants?${params}`),
			// only for the contract start: failing, it leaves it out instead of emptying the list
			fetch(`${BACKEND_URL}/api/v1/contracts?status=future&limit=100`)
				.then((res) => (res.ok ? res.json() : { contracts: [] }))
				.catch(() => ({ contracts: [] }))
		]);
		const data = await response.json();
		// a tenant without a running contract may already have signed one for later
		const future: { tenantId: string; startDate: string }[] = futureData.contracts ?? [];
		const nextStart = (id: unknown) =>
			future
				.filter((c) => c.tenantId === id)
				.map((c) => c.startDate)
				.sort()[0] ?? null;

		const tenants: TenantListItem[] = (data.tenants || data.data || []).map(
			(t: Json<TenantWithOccupancy>) => ({
				...toTenant(t),
				currentApartment: t.currentApartment
					? m.buildings_apartment_number({ number: String(t.currentApartment) })
					: null,
				currentBuilding: t.currentBuilding || null,
				nextContractStart: nextStart(t.id),
				isActive: t.isActive === true,
				isFuture: t.isFuture === true
			})
		);

		return {
			tenants,
			total: data.total || 0,
			page,
			pageSize
		};
	} catch (err) {
		console.error('Failed to fetch tenants:', err);
		return {
			tenants: [],
			total: 0,
			page,
			pageSize
		};
	}
};
