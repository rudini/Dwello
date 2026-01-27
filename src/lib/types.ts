// Building types
export interface Building {
	id: string;
	name?: string;
	address: string;
	postalCode: string;
	city: string;
	canton?: string;
	country?: string;
	latitude?: number;
	longitude?: number;
	buildingType?: string;
	yearBuilt?: number;
	createdAt?: Date | string;
	updatedAt?: Date | string;
}

// Building with apartment statistics
export interface BuildingWithStats extends Building {
	apartmentCount: number;
	occupiedCount: number;
	vacantCount: number;
}

// Buildings list response
export interface BuildingsListData {
	buildings: BuildingWithStats[];
	total: number;
	page: number;
	pageSize: number;
}

// Apartment types
export interface Apartment {
	id: string;
	building_id: string;
	floor: string;
	address_unit: string;
	size_m2: number;
	room_count: number;
	occupancy_status: 'Vermietet' | 'Leer' | 'Gesperrt';
	created_at?: Date;
	updated_at?: Date;
}

// Tenant types
export interface Tenant {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number?: string;
	address?: string;
	postal_code?: string;
	city?: string;
	created_at?: Date;
	updated_at?: Date;
}

// Rental Contract types
export interface RentalContract {
	id: string;
	apartment_id: string;
	tenant_id: string;
	start_date: Date | string;
	end_date?: Date | string;
	base_rent_chf: number;
	additional_rent_chf?: number;
	advance_payment_chf?: number;
	status: 'Aktiv' | 'Beendet';
	created_at?: Date;
	updated_at?: Date;
}

// Contract History item (derived from RentalContract + Tenant)
export interface ContractHistory {
	id: string;
	tenant_name: string;
	tenant_first_name: string;
	tenant_last_name: string;
	period: string; // "DD.MM.YYYY - DD.MM.YYYY"
	rent_brutto: number; // in CHF
	status: 'AKTIV' | 'Beendet';
	start_date: Date | string;
	end_date?: Date | string;
}

// Monthly costs breakdown
export interface MonthlyCosts {
	base_rent: number;
	advance_payment?: number;
	parking?: number;
	total_brutto: number;
}

// Apartment Details page data
export interface ApartmentDetailsData {
	apartment: Apartment;
	building: Building;
	currentTenant?: Tenant;
	currentContract?: RentalContract;
	monthlyCosts: MonthlyCosts;
	contractHistory: ContractHistory[];
}

// Apartment with building info for list view
export interface ApartmentWithBuilding extends Apartment {
	building_name?: string;
	building_address: string;
	building_city: string;
	current_tenant_name?: string;
	current_rent?: number;
}

// Apartments list response
export interface ApartmentsListData {
	apartments: ApartmentWithBuilding[];
	total: number;
	page: number;
	pageSize: number;
	buildings: { id: string; name: string; address: string }[];
}

// Tenant with current occupancy info for list view
export interface TenantWithOccupancy extends Tenant {
	current_apartment?: string;
	current_building?: string;
	contract_status?: 'Aktiv' | 'Beendet' | null;
}

// Tenants list response
export interface TenantsListData {
	tenants: TenantWithOccupancy[];
	total: number;
	page: number;
	pageSize: number;
}

// Contract with full details for list view
export interface ContractWithDetails extends RentalContract {
	tenant_name: string;
	tenant_first_name: string;
	tenant_last_name: string;
	apartment_unit: string;
	building_name?: string;
	building_address: string;
	total_rent: number;
}

// Contracts list response
export interface ContractsListData {
	contracts: ContractWithDetails[];
	total: number;
	page: number;
	pageSize: number;
	buildings: { id: string; name: string; address: string }[];
	apartments: { id: string; unit: string; building_id: string }[];
}

// Invoice Category types
export interface Category {
	id: string;
	name: string;
	nameDE?: string;
	nameFR?: string;
	nameIT?: string;
	nameEN?: string;
	isAllowedUtilityCost: boolean;
	description?: string;
	sortOrder?: number;
}

// Distribution Key types
export interface DistributionKey {
	id: string;
	name: string;
	nameDE?: string;
	nameFR?: string;
	nameIT?: string;
	nameEN?: string;
	type: 'predefined' | 'custom';
	formula?: string;
	description?: string;
	isActive: boolean;
}

// Invoice types
export interface Invoice {
	id: string;
	buildingId: string;
	invoiceDate: string;
	billingEntity: string;
	description: string;
	amount: number;
	categoryId?: string;
	distributionKeyId?: string;
	isValidUtilityCost: boolean;
	llmConfidence?: number;
	llmReasoning?: string;
	manualOverrideBy?: string;
	manualOverrideReason?: string;
	createdAt?: string;
	updatedAt?: string;
}

// Invoice with related data for list view
export interface InvoiceWithDetails extends Invoice {
	buildingName?: string;
	buildingAddress: string;
	category?: Category;
	distributionKey?: DistributionKey;
	categorizationStatus: 'pending' | 'auto-categorized' | 'manual';
}

// Invoices list response
export interface InvoicesListData {
	invoices: InvoiceWithDetails[];
	total: number;
	page: number;
	pageSize: number;
	buildings: { id: string; name: string; address: string }[];
	categories: Category[];
}

// Categories list response
export interface CategoriesListData {
	categories: Category[];
	total: number;
}

// Heating Profile types
export interface HeatingProfile {
	id: string;
	name: string;
	type: 'predefined' | 'custom';
	description?: string;
	isActive: boolean;
	monthlyPercentages: {
		january: number;
		february: number;
		march: number;
		april: number;
		may: number;
		june: number;
		july: number;
		august: number;
		september: number;
		october: number;
		november: number;
		december: number;
	};
}

// System Configuration types
export type AccountingPeriod = 'calendar' | 'july-june' | 'october-september';

export interface SystemConfig {
	id: string;
	accountingPeriod: AccountingPeriod;
	managementFeePercentage: number; // 0-3%
	defaultHeatingProfileId?: string;
	defaultDistributionKeyId?: string;
	companyName?: string;
	companyAddress?: string;
	iban?: string;
	updatedAt?: string;
}

// Configuration page data
export interface ConfigPageData {
	config: SystemConfig;
	heatingProfiles: HeatingProfile[];
	distributionKeys: DistributionKey[];
}
