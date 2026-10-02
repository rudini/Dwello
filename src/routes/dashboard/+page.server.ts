import type { PageServerLoad } from './$types';

interface DashboardData {
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
		outstandingStatements: number;
		totalPending: number;
		overdueAmount: number;
		paidThisMonth: number;
	};
	statements: {
		draft: number;
		sent: number;
		paid: number;
		overdue: number;
	};
	recentActivity: {
		id: string;
		type: 'statement_created' | 'invoice_added' | 'payment_received' | 'reminder_sent';
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

export const load: PageServerLoad = async ({ fetch }): Promise<DashboardData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/dashboard`);
		if (!response.ok) {
			throw new Error(`Backend returned ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Failed to fetch dashboard data:', error);
		// Return empty data when backend is unavailable
		return {
			portfolio: {
				totalBuildings: 0,
				totalApartments: 0,
				occupiedApartments: 0,
				reletApartments: 0,
				vacantApartments: 0,
				reservedApartments: 0,
				occupancyRate: 0
			},
			financial: {
				outstandingStatements: 0,
				totalPending: 0,
				overdueAmount: 0,
				paidThisMonth: 0
			},
			statements: {
				draft: 0,
				sent: 0,
				paid: 0,
				overdue: 0
			},
			recentActivity: [],
			buildingOccupancy: []
		};
	}
};
