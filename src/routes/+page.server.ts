const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface DashboardStats {
	totalBuildings: number;
	totalApartments: number;
	occupiedApartments: number;
	vacantApartments: number;
	pendingStatements: number;
	overdueStatements: number;
}

export const load = async ({ fetch }): Promise<{ stats: DashboardStats }> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/dashboard`);

		if (response.ok) {
			const data = await response.json();
			return { stats: data };
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
