/** One statement to be generated: a rental contract overlapping the period */
export interface PreviewRow {
	contractId: string;
	tenantName: string;
	apartmentNumber: string;
	totalCosts: number;
	totalAdvancePayments: number;
	balance: number;
	rentalDays?: number;
	totalPeriodDays?: number;
	movedOut?: boolean;
	fixedTerm?: boolean; // #76: befristet, its end not reached
	oldAddress?: boolean; // A-5 (#114): moved out, still with the building's address
}
