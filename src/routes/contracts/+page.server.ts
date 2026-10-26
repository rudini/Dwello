import type { ContractsListData, ContractWithDetails } from '$lib/types';
import type { ContractStatus } from '../../../backend/src/api/contract';
import type { PageServerLoad } from './$types';
import { missingByContract } from '$lib/server/missing-statements';
import { monthlyTotal, type ContractRow } from '$lib/server/contract-history';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// the status filters the backend knows; the type keeps them equal to its list
const filters: Record<ContractStatus, true> = { active: true, ended: true, future: true };

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
		if (Object.hasOwn(filters, status)) params.set('status', status);

		const [contractsRes, buildingsRes, apartmentsRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/contracts?${params}`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=1000`),
			fetch(`${BACKEND_URL}/api/v1/apartments?limit=100`)
		]);

		const contractsData = await contractsRes.json();
		const rows: ContractRow[] = contractsData.contracts || contractsData.data || [];
		// #211: the same rule as the contract page; no mark when it cannot be checked
		const missing = await missingByContract(fetch, rows);
		const buildingsData = await buildingsRes.json();
		const apartmentsData = await apartmentsRes.json();

		const contracts: ContractWithDetails[] = rows.map((c) => ({
			id: c.id,
			apartmentId: c.apartmentId,
			tenantId: c.tenantId,
			startDate: c.startDate,
			endDate: c.endDate,
			terminated: c.terminated,
			status: c.status, // the backend decides it (#784, #815)
			baseRent: c.baseRent,
			additionalRent: c.additionalRent,
			monthlyAdvancePayment: c.monthlyAdvancePayment,
			tenantName: c.tenantName,
			apartmentNumber: c.apartmentNumber,
			buildingName: c.buildingName,
			buildingAddress: c.buildingAddress,
			totalRent: monthlyTotal(c),
			missingStatement: !!missing?.get(c.id)?.length
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
			contracts: [],
			total: 0,
			page,
			pageSize,
			buildings: [],
			apartments: []
		};
	}
};
