import { fetchRecord } from '$lib/server/save-form';
import type { PageServerLoad } from './$types';

export interface DashboardData {
	portfolio: {
		totalBuildings: number;
		totalApartments: number;
		occupiedApartments: number;
		reletApartments: number;
		vacantApartments: number;
		reservedApartments: number;
		occupancyRate: number;
	};
	financial: {
		outstandingStatements: number; // sent, overdue included
		totalPending: number; // what tenants still owe, refunds excluded
		overdueAmount: number;
		paidThisMonth: number;
	};
	statements: { draft: number; sent: number; paid: number; overdue: number };
	recentActivity: {
		id: string;
		type: 'statement_created' | 'invoice_added' | 'payment_received';
		title: string;
		description: string;
		timestamp: string;
	}[];
	buildingOccupancy: {
		buildingId: string;
		buildingName: string;
		totalApartments: number;
		occupiedApartments: number;
		occupancyRate: number;
	}[];
}

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ fetch }): Promise<DashboardData> =>
	fetchRecord(fetch, `${BACKEND_URL}/api/v1/dashboard`, 'Dashboard');
