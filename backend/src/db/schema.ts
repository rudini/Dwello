/**
 * Database Schema Definition
 * Using Drizzle ORM for type-safe database operations
 */

import {
	pgTable,
	uuid,
	varchar,
	text,
	integer,
	decimal,
	boolean,
	timestamp,
	date,
	index,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// Buildings Table
// ============================================================================
export const buildings = pgTable(
	'buildings',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		name: varchar('name', { length: 255 }).notNull(),
		address: varchar('address', { length: 500 }).notNull(),
		postalCode: varchar('postal_code', { length: 10 }).notNull(),
		city: varchar('city', { length: 100 }).notNull(),
		canton: varchar('canton', { length: 2 }).notNull(),
		country: varchar('country', { length: 2 }).notNull().default('CH'),
		latitude: decimal('latitude', { precision: 10, scale: 7 }),
		longitude: decimal('longitude', { precision: 10, scale: 7 }),
		buildingType: varchar('building_type', { length: 50 }),
		yearBuilt: integer('year_built'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [index('buildings_city_idx').on(table.city)]
);

export const buildingsRelations = relations(buildings, ({ many }) => ({
	apartments: many(apartments),
	invoices: many(invoices)
}));

// ============================================================================
// Apartments Table
// ============================================================================
export const apartments = pgTable(
	'apartments',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		buildingId: uuid('building_id')
			.notNull()
			.references(() => buildings.id, { onDelete: 'cascade' }),
		number: varchar('number', { length: 20 }).notNull(),
		floor: integer('floor').notNull().default(0),
		area: decimal('area', { precision: 8, scale: 2 }).notNull(), // m²
		rooms: decimal('rooms', { precision: 3, scale: 1 }).notNull(), // e.g., 3.5
		status: varchar('status', { length: 20 }).notNull().default('vacant'), // occupied, vacant, reserved
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('apartments_building_id_idx').on(table.buildingId),
		uniqueIndex('apartments_building_number_idx').on(table.buildingId, table.number)
	]
);

export const apartmentsRelations = relations(apartments, ({ one, many }) => ({
	building: one(buildings, {
		fields: [apartments.buildingId],
		references: [buildings.id]
	}),
	contracts: many(rentalContracts),
	statements: many(utilityStatements)
}));

// ============================================================================
// Tenants Table
// ============================================================================
export const tenants = pgTable('tenants', {
	id: uuid('id').defaultRandom().primaryKey(),
	firstName: varchar('first_name', { length: 100 }).notNull(),
	lastName: varchar('last_name', { length: 100 }).notNull(),
	email: varchar('email', { length: 255 }),
	phone: varchar('phone', { length: 30 }),
	language: varchar('language', { length: 5 }).notNull().default('de'), // de, fr, it, rm, en
	address: varchar('address', { length: 500 }),
	postalCode: varchar('postal_code', { length: 10 }),
	city: varchar('city', { length: 100 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const tenantsRelations = relations(tenants, ({ many }) => ({
	contracts: many(rentalContracts),
	statements: many(utilityStatements)
}));

// ============================================================================
// Rental Contracts Table
// ============================================================================
export const rentalContracts = pgTable(
	'rental_contracts',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		apartmentId: uuid('apartment_id')
			.notNull()
			.references(() => apartments.id, { onDelete: 'cascade' }),
		tenantId: uuid('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'restrict' }),
		startDate: date('start_date').notNull(),
		endDate: date('end_date'), // null = ongoing
		baseRent: decimal('base_rent', { precision: 10, scale: 2 }).notNull(), // CHF
		additionalRent: decimal('additional_rent', { precision: 10, scale: 2 }).default('0'), // garage, parking
		monthlyAdvancePayment: decimal('monthly_advance_payment', { precision: 10, scale: 2 }).notNull(), // Akonto
		referenceIndex: decimal('reference_index', { precision: 6, scale: 4 }), // Swiss rental index
		contractPdf: text('contract_pdf'), // Base64 or URL
		notes: text('notes'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('contracts_apartment_id_idx').on(table.apartmentId),
		index('contracts_tenant_id_idx').on(table.tenantId),
		index('contracts_end_date_idx').on(table.endDate),
		index('contracts_dates_idx').on(table.startDate, table.endDate)
	]
);

export const rentalContractsRelations = relations(rentalContracts, ({ one, many }) => ({
	apartment: one(apartments, {
		fields: [rentalContracts.apartmentId],
		references: [apartments.id]
	}),
	tenant: one(tenants, {
		fields: [rentalContracts.tenantId],
		references: [tenants.id]
	}),
	statements: many(utilityStatements)
}));

// ============================================================================
// Categories Table (Utility Cost Categories)
// ============================================================================
export const categories = pgTable('categories', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	nameDE: varchar('name_de', { length: 100 }),
	nameFR: varchar('name_fr', { length: 100 }),
	nameIT: varchar('name_it', { length: 100 }),
	nameEN: varchar('name_en', { length: 100 }),
	isAllowedUtilityCost: boolean('is_allowed_utility_cost').notNull().default(true),
	description: text('description'),
	sortOrder: integer('sort_order').default(0),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	invoices: many(invoices),
	statementLineItems: many(utilityStatementLineItems)
}));

// ============================================================================
// Distribution Keys Table
// ============================================================================
export const distributionKeys = pgTable('distribution_keys', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	nameDE: varchar('name_de', { length: 100 }),
	nameFR: varchar('name_fr', { length: 100 }),
	nameIT: varchar('name_it', { length: 100 }),
	nameEN: varchar('name_en', { length: 100 }),
	type: varchar('type', { length: 20 }).notNull().default('predefined'), // predefined, custom
	formula: text('formula'), // For custom keys: {area}, {rooms}, {units}
	description: text('description'),
	sortOrder: integer('sort_order').default(0),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const distributionKeysRelations = relations(distributionKeys, ({ many }) => ({
	invoices: many(invoices),
	statementLineItems: many(utilityStatementLineItems)
}));

// ============================================================================
// Heating Distribution Profiles Table
// ============================================================================
export const heatingProfiles = pgTable('heating_profiles', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	nameDE: varchar('name_de', { length: 100 }),
	nameFR: varchar('name_fr', { length: 100 }),
	nameIT: varchar('name_it', { length: 100 }),
	nameEN: varchar('name_en', { length: 100 }),
	type: varchar('type', { length: 20 }).notNull().default('predefined'), // predefined, custom
	// Monthly percentages (must sum to 100)
	januaryPct: decimal('january_pct', { precision: 5, scale: 2 }).notNull(),
	februaryPct: decimal('february_pct', { precision: 5, scale: 2 }).notNull(),
	marchPct: decimal('march_pct', { precision: 5, scale: 2 }).notNull(),
	aprilPct: decimal('april_pct', { precision: 5, scale: 2 }).notNull(),
	mayPct: decimal('may_pct', { precision: 5, scale: 2 }).notNull(),
	junePct: decimal('june_pct', { precision: 5, scale: 2 }).notNull(),
	julyPct: decimal('july_pct', { precision: 5, scale: 2 }).notNull(),
	augustPct: decimal('august_pct', { precision: 5, scale: 2 }).notNull(),
	septemberPct: decimal('september_pct', { precision: 5, scale: 2 }).notNull(),
	octoberPct: decimal('october_pct', { precision: 5, scale: 2 }).notNull(),
	novemberPct: decimal('november_pct', { precision: 5, scale: 2 }).notNull(),
	decemberPct: decimal('december_pct', { precision: 5, scale: 2 }).notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ============================================================================
// Invoices Table
// ============================================================================
export const invoices = pgTable(
	'invoices',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		buildingId: uuid('building_id')
			.notNull()
			.references(() => buildings.id, { onDelete: 'cascade' }),
		invoiceNumber: varchar('invoice_number', { length: 50 }),
		billingEntityName: varchar('billing_entity_name', { length: 255 }).notNull(),
		billingEntityAddress: varchar('billing_entity_address', { length: 500 }),
		description: text('description').notNull(),
		categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
		distributionKeyId: uuid('distribution_key_id').references(() => distributionKeys.id, {
			onDelete: 'set null'
		}),
		amount: decimal('amount', { precision: 12, scale: 2 }).notNull(), // CHF
		isValidUtilityCost: boolean('is_valid_utility_cost').notNull().default(true),
		invoiceDate: date('invoice_date').notNull(),
		dueDate: date('due_date'),
		paidDate: date('paid_date'),
		// LLM categorization tracking
		llmCategoryId: uuid('llm_category_id').references(() => categories.id, {
			onDelete: 'set null'
		}),
		llmConfidence: decimal('llm_confidence', { precision: 5, scale: 4 }), // 0.0000 to 1.0000
		wasManuallyOverridden: boolean('was_manually_overridden').default(false),
		invoicePdf: text('invoice_pdf'), // Base64 or URL
		notes: text('notes'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('invoices_building_id_idx').on(table.buildingId),
		index('invoices_invoice_date_idx').on(table.invoiceDate),
		index('invoices_category_id_idx').on(table.categoryId)
	]
);

export const invoicesRelations = relations(invoices, ({ one }) => ({
	building: one(buildings, {
		fields: [invoices.buildingId],
		references: [buildings.id]
	}),
	category: one(categories, {
		fields: [invoices.categoryId],
		references: [categories.id]
	}),
	distributionKey: one(distributionKeys, {
		fields: [invoices.distributionKeyId],
		references: [distributionKeys.id]
	}),
	llmCategory: one(categories, {
		fields: [invoices.llmCategoryId],
		references: [categories.id]
	})
}));

// ============================================================================
// Utility Statements Table
// ============================================================================
export const utilityStatements = pgTable(
	'utility_statements',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		tenantId: uuid('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'restrict' }),
		apartmentId: uuid('apartment_id')
			.notNull()
			.references(() => apartments.id, { onDelete: 'restrict' }),
		contractId: uuid('contract_id')
			.notNull()
			.references(() => rentalContracts.id, { onDelete: 'restrict' }),
		statementNumber: varchar('statement_number', { length: 50 }).notNull(),
		periodStart: date('period_start').notNull(),
		periodEnd: date('period_end').notNull(),
		statementDate: date('statement_date').notNull(),
		rentalDays: integer('rental_days').notNull(),
		totalCosts: decimal('total_costs', { precision: 12, scale: 2 }).notNull(),
		totalAdvancePayments: decimal('total_advance_payments', { precision: 12, scale: 2 }).notNull(),
		managementFee: decimal('management_fee', { precision: 12, scale: 2 }).default('0'),
		balance: decimal('balance', { precision: 12, scale: 2 }).notNull(), // positive = tenant owes, negative = refund
		status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, sent, paid, overdue
		paymentDeadline: date('payment_deadline'),
		paidDate: date('paid_date'),
		paidAmount: decimal('paid_amount', { precision: 12, scale: 2 }),
		reminderSentDate: date('reminder_sent_date'),
		pdfBlob: text('pdf_blob'), // Base64 encoded PDF
		qrBillReference: varchar('qr_bill_reference', { length: 27 }), // Swiss QR reference
		notes: text('notes'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('statements_tenant_id_idx').on(table.tenantId),
		index('statements_apartment_id_idx').on(table.apartmentId),
		index('statements_period_start_idx').on(table.periodStart),
		index('statements_status_idx').on(table.status),
		index('statements_tenant_period_idx').on(table.tenantId, table.periodStart),
		uniqueIndex('statements_number_idx').on(table.statementNumber)
	]
);

export const utilityStatementsRelations = relations(utilityStatements, ({ one, many }) => ({
	tenant: one(tenants, {
		fields: [utilityStatements.tenantId],
		references: [tenants.id]
	}),
	apartment: one(apartments, {
		fields: [utilityStatements.apartmentId],
		references: [apartments.id]
	}),
	contract: one(rentalContracts, {
		fields: [utilityStatements.contractId],
		references: [rentalContracts.id]
	}),
	lineItems: many(utilityStatementLineItems)
}));

// ============================================================================
// Utility Statement Line Items Table
// ============================================================================
export const utilityStatementLineItems = pgTable(
	'utility_statement_line_items',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		statementId: uuid('statement_id')
			.notNull()
			.references(() => utilityStatements.id, { onDelete: 'cascade' }),
		categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
		distributionKeyId: uuid('distribution_key_id').references(() => distributionKeys.id, {
			onDelete: 'set null'
		}),
		description: varchar('description', { length: 255 }).notNull(),
		totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(), // Building total
		tenantShare: decimal('tenant_share', { precision: 12, scale: 2 }).notNull(), // Tenant's portion
		sharePercentage: decimal('share_percentage', { precision: 8, scale: 4 }), // e.g., 12.5000%
		sortOrder: integer('sort_order').default(0),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [index('line_items_statement_id_idx').on(table.statementId)]
);

export const utilityStatementLineItemsRelations = relations(
	utilityStatementLineItems,
	({ one }) => ({
		statement: one(utilityStatements, {
			fields: [utilityStatementLineItems.statementId],
			references: [utilityStatements.id]
		}),
		category: one(categories, {
			fields: [utilityStatementLineItems.categoryId],
			references: [categories.id]
		}),
		distributionKey: one(distributionKeys, {
			fields: [utilityStatementLineItems.distributionKeyId],
			references: [distributionKeys.id]
		})
	})
);

// ============================================================================
// Configuration Table (Key-Value Store)
// ============================================================================
export const configuration = pgTable(
	'configuration',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		key: varchar('key', { length: 100 }).notNull(),
		value: text('value').notNull(),
		description: text('description'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [uniqueIndex('config_key_idx').on(table.key)]
);

// ============================================================================
// Type Exports for Use in Application
// ============================================================================
export type Building = typeof buildings.$inferSelect;
export type NewBuilding = typeof buildings.$inferInsert;

export type Apartment = typeof apartments.$inferSelect;
export type NewApartment = typeof apartments.$inferInsert;

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

export type RentalContract = typeof rentalContracts.$inferSelect;
export type NewRentalContract = typeof rentalContracts.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type DistributionKey = typeof distributionKeys.$inferSelect;
export type NewDistributionKey = typeof distributionKeys.$inferInsert;

export type HeatingProfile = typeof heatingProfiles.$inferSelect;
export type NewHeatingProfile = typeof heatingProfiles.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type UtilityStatement = typeof utilityStatements.$inferSelect;
export type NewUtilityStatement = typeof utilityStatements.$inferInsert;

export type UtilityStatementLineItem = typeof utilityStatementLineItems.$inferSelect;
export type NewUtilityStatementLineItem = typeof utilityStatementLineItems.$inferInsert;

export type Configuration = typeof configuration.$inferSelect;
export type NewConfiguration = typeof configuration.$inferInsert;
