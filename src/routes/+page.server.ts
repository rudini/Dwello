const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface DashboardStats {
	totalBuildings: number;
	totalApartments: number;
	occupiedApartments: number;
	vacantApartments: number;
	pendingStatements: number;
	overdueStatements: number;
}

interface DashboardAPIResponse {
	portfolio: {
		totalBuildings: number;
		totalApartments: number;
		occupiedApartments: number;
		vacantApartments: number;
	};
	financial: {
		outstandingStatements: number;
	};
	statements: {
		overdue: number;
	};
}

export const load = async ({ fetch }): Promise<{ stats: DashboardStats }> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/dashboard`);

		if (response.ok) {
			const data: DashboardAPIResponse = await response.json();
			// Map nested API response to flat DashboardStats structure
			return {
				stats: {
					totalBuildings: data.portfolio.totalBuildings,
					totalApartments: data.portfolio.totalApartments,
					occupiedApartments: data.portfolio.occupiedApartments,
					vacantApartments: data.portfolio.vacantApartments,
					pendingStatements: data.financial.outstandingStatements,
					overdueStatements: data.statements.overdue
				}
			};
		}
	} catch (error) {
		console.error('Failed to fetch dashboard stats:', error);
	}

	// Fallback to empty stats if API fails
	return {
		stats: {
			totalBuildings: 0,
			totalApartments: 0,
			occupiedApartments: 0,
			vacantApartments: 0,
			pendingStatements: 0,
			overdueStatements: 0
		}
	};
};
