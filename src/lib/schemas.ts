import { z } from 'zod';

// Building schema
export const BuildingSchema = z.object({
	id: z.string().uuid(),
	address: z.string().min(1),
	postal_code: z.string().min(1),
	city: z.string().min(1),
	country: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	created_at: z.date().optional(),
	updated_at: z.date().optional()
});

// Apartment schema
export const ApartmentSchema = z.object({
	id: z.string().uuid(),
	building_id: z.string().uuid(),
	floor: z.string().min(1),
	address_unit: z.string().min(1),
	size_m2: z.number().positive(),
	room_count: z.number().positive(),
	occupancy_status: z.enum(['Vermietet', 'Leer', 'Gesperrt']),
	created_at: z.date().optional(),
	updated_at: z.date().optional()
});

// Tenant schema
export const TenantSchema = z.object({
	id: z.string().uuid(),
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	email: z.string().email(),
	phone_number: z.string().optional(),
	address: z.string().optional(),
	postal_code: z.string().optional(),
	city: z.string().optional(),
	created_at: z.date().optional(),
	updated_at: z.date().optional()
});

// Rental Contract schema
export const RentalContractSchema = z.object({
	id: z.string().uuid(),
	apartment_id: z.string().uuid(),
	tenant_id: z.string().uuid(),
	start_date: z.date().or(z.string()),
	end_date: z.date().or(z.string()).optional(),
	base_rent_chf: z.number().nonnegative(),
	additional_rent_chf: z.number().nonnegative().optional(),
	advance_payment_chf: z.number().nonnegative().optional(),
	status: z.enum(['Aktiv', 'Beendet']),
	created_at: z.date().optional(),
	updated_at: z.date().optional()
});

// Monthly costs schema
export const MonthlyCostsSchema = z.object({
	base_rent: z.number().nonnegative(),
	advance_payment: z.number().nonnegative().optional(),
	parking: z.number().nonnegative().optional(),
	total_brutto: z.number().nonnegative()
});

// Apartment Details page schema
export const ApartmentDetailsDataSchema = z.object({
	apartment: ApartmentSchema,
	building: BuildingSchema,
	currentTenant: TenantSchema.optional(),
	currentContract: RentalContractSchema.optional(),
	monthlyCosts: MonthlyCostsSchema,
	contractHistory: z.array(
		z.object({
			id: z.string().uuid(),
			tenant_name: z.string(),
			tenant_first_name: z.string(),
			tenant_last_name: z.string(),
			period: z.string(),
			rent_brutto: z.number().nonnegative(),
			status: z.enum(['AKTIV', 'Beendet']),
			start_date: z.date().or(z.string()),
			end_date: z.date().or(z.string()).optional()
		})
	)
});

export type Building = z.infer<typeof BuildingSchema>;
export type Apartment = z.infer<typeof ApartmentSchema>;
export type Tenant = z.infer<typeof TenantSchema>;
export type RentalContract = z.infer<typeof RentalContractSchema>;
export type MonthlyCosts = z.infer<typeof MonthlyCostsSchema>;
export type ApartmentDetailsData = z.infer<typeof ApartmentDetailsDataSchema>;
