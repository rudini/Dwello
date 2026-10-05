/** One statement to be generated: a rental contract overlapping the period */
export interface PreviewRow {
	contractId: string;
	tenantName: string;
	apartmentNumber: string;
	totalCosts: number;
	balance: number;
}

/** What the Liegenschaftsverwalter chose in the period and building steps */
export interface WizardSelection {
	periodStart: string;
	periodEnd: string;
	heatingProfileId: string;
	managementFeePercent: number;
	managementFeeDistributionKeyId: string;
	buildingIds: string[];
}
