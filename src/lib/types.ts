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
