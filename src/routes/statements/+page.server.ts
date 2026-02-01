import type { StatementsListData } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load = async ({ url, fetch }): Promise<StatementsListData> => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const pageSize = 10;
	const status = url.searchParams.get('status') || undefined;
	const buildingId = url.searchParams.get('building') || undefined;
	const search = url.searchParams.get('search') || undefined;

	try {
		// Fetch statements from backend
		const params = new URLSearchParams();
		params.set('limit', String(pageSize));
		params.set('offset', String((page - 1) * pageSize));
		if (status) params.set('status', status);
		if (buildingId) params.set('buildingId', buildingId);
		if (search) params.set('search', search);

		const [statementsRes, countsRes, buildingsRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/statements?${params}`),
			fetch(`${BACKEND_URL}/api/v1/statements/counts`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`)
		]);

		const statementsData = await statementsRes.json();
		const countsData = await countsRes.json();
		const buildingsData = await buildingsRes.json();

		// Transform backend data to match frontend types
		const statements = (statementsData.data || []).map((s: Record<string, unknown>) => ({
			id: s.id,
			statementNumber: s.statementNumber,
			tenantId: s.tenantId,
			apartmentId: s.apartmentId,
			buildingId: s.apartment?.buildingId || '',
			periodStart: s.periodStart,
			periodEnd: s.periodEnd,
			statementDate: s.statementDate,
			rentalDays: s.rentalDays,
			totalCosts: Number(s.totalCosts),
			totalAdvancePayments: Number(s.totalAdvancePayments),
			managementFee: Number(s.managementFee),
			balance: Number(s.balance),
			status: s.status,
			paymentDeadline: s.paymentDeadline,
			paidDate: s.paidDate,
			pdfGeneratedAt: s.pdfGeneratedAt,
			tenantName: s.tenant ? `${s.tenant.firstName} ${s.tenant.lastName}` : 'Unbekannt',
			tenantEmail: s.tenant?.email || '',
			apartmentUnit: s.apartment?.number || '',
			apartmentFloor: s.apartment?.floor || '',
			buildingName: s.building?.name || '',
			buildingAddress: s.building?.address || '',
			lineItems: s.lineItems || []
		}));

		const buildings = (buildingsData.data || []).map((b: Record<string, unknown>) => ({
			id: b.id,
			name: b.name
		}));

		return {
			statements,
			total: statementsData.total || 0,
			page,
			pageSize,
			buildings,
			statusCounts: {
				draft: countsData.draft || 0,
				sent: countsData.sent || 0,
				paid: countsData.paid || 0,
				overdue: countsData.overdue || 0
			}
		};
	} catch (error) {
		console.error('Failed to fetch statements:', error);
		// Return empty data on error
		return {
			statements: [],
			total: 0,
			page,
			pageSize,
			buildings: [],
			statusCounts: {
				draft: 0,
				sent: 0,
				paid: 0,
				overdue: 0
			}
		};
	}
};
