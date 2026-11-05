/** #1126: a Kostenabstimmung as the pages show it, its positions named in the UI language */
type Amounts = { buildingCosts: number; tenants: number; landlord: number };
export type Reconciliation = {
	positions: (Amounts & { label: string })[];
	total: Amounts;
	managementFee: number;
	nonAllocable: number;
	withoutStatement: number; // «Berichte» only: contracts of the period without a statement
	drafts: { id: string; tenantName: string }[];
	notUpToDate: { id: string; tenantName: string }[];
};
