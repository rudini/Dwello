interface DashboardData {
	portfolio: {
		totalBuildings: number;
		totalApartments: number;
		occupiedApartments: number;
		vacantApartments: number;
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

export const load = async (): Promise<DashboardData> => {
	// Mock dashboard data
	return {
		portfolio: {
			totalBuildings: 3,
			totalApartments: 26,
			occupiedApartments: 22,
			vacantApartments: 4,
			occupancyRate: 84.6
		},
		financial: {
			outstandingStatements: 8,
			totalPending: 12450.0,
			overdueAmount: 2890.0,
			paidThisMonth: 45600.0
		},
		statements: {
			draft: 2,
			sent: 5,
			paid: 18,
			overdue: 3
		},
		recentActivity: [
			{
				id: 'act-001',
				type: 'payment_received',
				title: 'Zahlung eingegangen',
				description: 'Anna Schmidt hat CHF 422.50 bezahlt',
				timestamp: '2025-01-28T10:30:00Z'
			},
			{
				id: 'act-002',
				type: 'statement_created',
				title: 'Abrechnung erstellt',
				description: '4 neue Abrechnungen für Seepark Residenz',
				timestamp: '2025-01-27T14:15:00Z'
			},
			{
				id: 'act-003',
				type: 'reminder_sent',
				title: 'Mahnung versendet',
				description: '2. Mahnung an Peter Weber gesendet',
				timestamp: '2025-01-26T09:00:00Z'
			},
			{
				id: 'act-004',
				type: 'invoice_added',
				title: 'Rechnung erfasst',
				description: 'Heizkosten Q4 2024 - CHF 8\'500.00',
				timestamp: '2025-01-25T16:45:00Z'
			},
			{
				id: 'act-005',
				type: 'payment_received',
				title: 'Zahlung eingegangen',
				description: 'Maria Keller hat CHF 199.50 bezahlt',
				timestamp: '2025-01-24T11:20:00Z'
			}
		],
		buildingOccupancy: [
			{
				buildingId: 'building-001',
				buildingName: 'Musterhaus Zentrum',
				totalApartments: 12,
				occupiedApartments: 11,
				occupancyRate: 91.7
			},
			{
				buildingId: 'building-002',
				buildingName: 'Seepark Residenz',
				totalApartments: 8,
				occupiedApartments: 7,
				occupancyRate: 87.5
			},
			{
				buildingId: 'building-003',
				buildingName: 'Alpenblick',
				totalApartments: 6,
				occupiedApartments: 4,
				occupancyRate: 66.7
			}
		]
	};
};
