import { localToday } from '$lib/contract-status';
import type { ContractsListData, ContractWithDetails } from '$lib/types';
import type { PageServerLoad } from './$types';
import { missingByContract } from '$lib/server/missing-statements';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ url, fetch }): Promise<ContractsListData> => {
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
		if (['active', 'ended', 'future'].includes(status)) params.set('status', status);

		const [contractsRes, buildingsRes, apartmentsRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/contracts?${params}`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`),
			fetch(`${BACKEND_URL}/api/v1/apartments?limit=100`)
		]);

		const contractsData = await contractsRes.json();
		const rows: Record<string, unknown>[] = contractsData.contracts || contractsData.data || [];
		// #211: the same rule as the contract page; no mark when it cannot be checked
		const missing = await missingByContract(fetch, rows);
		const buildingsData = await buildingsRes.json();
		const apartmentsData = await apartmentsRes.json();

		const contracts: ContractWithDetails[] = rows.map((c) => ({
			id: c.id as string,
			apartmentId: c.apartmentId as string,
			tenantId: c.tenantId as string,
			startDate: c.startDate as string,
			endDate: (c.endDate as string) || null,
			terminated: !!c.terminated,
			baseRent: (c.baseRent as string) || '0',
			additionalRent: (c.additionalRent as string) || null,
			monthlyAdvancePayment: (c.monthlyAdvancePayment as string) || '0',
			tenantName: (c.tenantName as string) || '',
			tenantFirstName: '',
			tenantLastName: '',
			apartmentNumber: (c.apartmentNumber as string) || '',
			buildingName: (c.buildingName as string) || '',
			buildingAddress: (c.buildingAddress as string) || '',
			totalRent:
				Number(c.baseRent || 0) +
				Number(c.additionalRent || 0) +
				Number(c.monthlyAdvancePayment || 0),
			missingStatement: !!missing?.get(String(c.id))?.length
		}));

		const buildings = (buildingsData.buildings || buildingsData.data || []).map(
			(b: Record<string, unknown>) => ({
				id: b.id,
				name: b.name || '',
				address: b.address || ''
			})
		);

		const apartments = (apartmentsData.apartments || apartmentsData.data || []).map(
			(a: Record<string, unknown>) => ({
				id: a.id,
				number: a.number || '',
				buildingId: a.buildingId
			})
		);

		return {
			today: localToday(),
			contracts,
			total: contractsData.total || 0,
			page,
			pageSize,
			buildings,
			apartments
		};
	} catch (err) {
		console.error('Failed to fetch contracts:', err);
		return {
			today: localToday(),
			contracts: [],
			total: 0,
			page,
			pageSize,
			buildings: [],
			apartments: []
		};
	}
};
