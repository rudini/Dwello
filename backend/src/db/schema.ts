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
	uniqueIndex,
	primaryKey,
	jsonb,
	type AnyPgColumn
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
		noTank: boolean('no_tank').notNull().default(false), // no tank or decommissioned: no Tankbestand asked (#72)
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
		status: varchar('status', { length: 20 }).notNull().default('vacant'), // vacant, reserved; occupied is computed from the contracts (apartmentStatus)
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
	language: varchar('language', { length: 5 }).notNull().default('de'), // de, fr, it, en
	address: varchar('address', { length: 500 }),
	postalCode: varchar('postal_code', { length: 10 }),
	city: varchar('city', { length: 100 }),
	country: varchar('country', { length: 2 }).notNull().default('CH'), // ISO 3166 code of the Korrespondenzadresse
	correspondenceChannel: varchar('correspondence_channel', { length: 10 }).notNull().default('letter'), // email, letter
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
		terminated: boolean('terminated').default(false).notNull(), // endDate is a Kündigungstermin, not agreed
		noticeReceivedOn: date('notice_received_on'), // the day the notice arrived (A-3), only with terminated
		billedUntil: date('billed_until'), // «Abgerechnet bis» (#133): billed outside Dwello up to this day
		movedOut: boolean('moved_out').default(false).notNull(), // «Mieter ist ausgezogen» after this end (A-6)
		documentsCheckedOn: date('documents_checked_on'), // «Als geprüft markieren» for this end (#459)
		baseRent: decimal('base_rent', { precision: 10, scale: 2 }).notNull(), // CHF
		additionalRent: decimal('additional_rent', { precision: 10, scale: 2 }).default('0'), // garage, parking
		monthlyAdvancePayment: decimal('monthly_advance_payment', { precision: 10, scale: 2 }).notNull(), // Akonto
		// «Nebenkostenpauschale» (#429): counts in «Monatlich total», never billed
		flatRateUtilityCharge: decimal('flat_rate_utility_charge', { precision: 10, scale: 2 }).default('0').notNull(),
		// #89: the run's rate applies only with a fee agreed; an own rate (0–10 %) takes precedence
		managementFeeAgreed: boolean('management_fee_agreed').default(false).notNull(),
		managementFeePercent: decimal('management_fee_percent', { precision: 5, scale: 2 }),
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

// #464: the Akonto of a contract per «Gültig ab» (the first of a month); the first amount applies from the
// Vertragsbeginn whatever its day
export const contractAdvancePayments = pgTable(
	'contract_advance_payments',
	{
		contractId: uuid('contract_id')
			.notNull()
			.references(() => rentalContracts.id, { onDelete: 'cascade' }),
		validFrom: date('valid_from').notNull(),
		amount: decimal('amount', { precision: 10, scale: 2 }).notNull()
	},
	(table) => [primaryKey({ columns: [table.contractId, table.validFrom] })]
);

// #91: the Nebenkosten a contract agrees, or answered «nicht vereinbart»; no row: not answered, not billed
export const contractCategories = pgTable(
	'contract_categories',
	{
		contractId: uuid('contract_id')
			.notNull()
			.references(() => rentalContracts.id, { onDelete: 'cascade' }),
		categoryId: uuid('category_id')
			.notNull()
			.references(() => categories.id, { onDelete: 'cascade' }),
		agreed: boolean('agreed').notNull()
	},
	(table) => [primaryKey({ columns: [table.contractId, table.categoryId] })]
);

// ============================================================================
// Categories Table (Utility Cost Categories)
// ============================================================================
// Master data shared by categories and distribution keys: a description, a position in lists and timestamps
const describedAndOrdered = () => ({
	description: text('description'),
	sortOrder: integer('sort_order').default(0),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const categories = pgTable('categories', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	nameDE: varchar('name_de', { length: 100 }),
	nameFR: varchar('name_fr', { length: 100 }),
	nameIT: varchar('name_it', { length: 100 }),
	nameEN: varchar('name_en', { length: 100 }),
	isAllowedUtilityCost: boolean('is_allowed_utility_cost').notNull().default(true),
	// Heating costs (Art. 5 VMWG): shared by the heating profile at a tenant change; separate hot water by days
	isHeatingCost: boolean('is_heating_cost').notNull().default(false),
	// Brennstoff (#100): its invoices are deliveries of Heizmaterial; only such a heating cost category has a Tankbestand
	isFuel: boolean('is_fuel').notNull().default(false),
	type: varchar('type', { length: 20 }).notNull().default('predefined'), // predefined, custom
	...describedAndOrdered()
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
	...describedAndOrdered()
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
		// Leistungszeitraum: the period the invoice bills; without it the Rechnungsdatum decides the Abrechnungsperiode
		servicePeriodStart: date('service_period_start'),
		servicePeriodEnd: date('service_period_end'),
		dueDate: date('due_date'),
		paidDate: date('paid_date'),
		// LLM categorization tracking
		llmCategoryId: uuid('llm_category_id').references(() => categories.id, {
			onDelete: 'set null'
		}),
		llmConfidence: decimal('llm_confidence', { precision: 5, scale: 4 }), // 0.0000 to 1.0000
		wasManuallyOverridden: boolean('was_manually_overridden').default(false),
		manualOverrideReason: text('manual_override_reason'), // why the KI category was overridden
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

// The Beleg of an invoice: its uploaded file, at most one, deleted with the invoice
export const invoiceDocuments = pgTable('invoice_documents', {
	invoiceId: uuid('invoice_id')
		.primaryKey()
		.references(() => invoices.id, { onDelete: 'cascade' }),
	fileName: varchar('file_name', { length: 255 }).notNull(),
	mimeType: varchar('mime_type', { length: 50 }).notNull(),
	content: text('content').notNull(), // Base64 encoded file
	// what the KI saw on the file when it was uploaded (#233): amounts already paid it deducts, costs not allocable
	deductedAmount: decimal('deducted_amount', { precision: 12, scale: 2 }),
	nonAllocableItems: boolean('non_allocable_items').default(false).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Heating oil in the tank on a reading day, in CHF; heating costs are stock at the start + purchases − stock at the end
export const fuelStocks = pgTable(
	'fuel_stocks',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		buildingId: uuid('building_id')
			.notNull()
			.references(() => buildings.id, { onDelete: 'cascade' }),
		readingDate: date('reading_date').notNull(),
		amount: decimal('amount', { precision: 12, scale: 2 }).notNull(), // CHF
		// the heating cost category the consumption is billed in
		categoryId: uuid('category_id')
			.notNull()
			.references(() => categories.id, { onDelete: 'restrict' }),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [uniqueIndex('fuel_stocks_building_id_reading_date_key').on(table.buildingId, table.readingDate)]
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
/** Own value and the building's total by unit: the fraction a simple distribution key gives the apartment */
export type KeyValues = Record<'area' | 'units' | 'rooms', [number, number]>;

// A month's share of the heating costs; a month split by a move-in or move-out with its share in the profile and its
// days (#451), absent before
export type MonthShare = { month: number; percentage: number; full?: number; days?: number; total?: number };

// An invoice of a position over different days (#226): its days in the period, its amount for them, the tenant's days
export type InvoicePart = {
	start: string;
	end: string;
	amount: number;
	days: number;
	total: number;
	noPeriod?: true; // an invoice without Leistungszeitraum: it bills the period (#241)
	whole?: { start: string; end: string; amount: number }; // a Leistungszeitraum beyond the period, with the invoice's amount
	fuelStock?: true; // the change of the Tankbestand, not an invoice (#239)
	// a heating invoice shared by the Heizprofil's months in its days (#71): the tenant's months, those days' months
	profile?: { percent: number; months: MonthShare[]; periodMonths: MonthShare[] };
};

/** One line of the Akonto on a statement (#464): whole months of one amount, or the days of a split month */
export type AdvanceLine = { from: string; to: string; amount: number; total: number } & (
	| { months: number }
	| { days: number; daysInMonth: number }
);
// An invoice a position billed (#96): its amount in the period and the days it bills there, its Rechnungsdatum and
// Rechnungsnummer that name it in the PDF (#451; absent on statements created before); the change of the Tankbestand is
// billed like one (#239) under the id fuel-stock-<period end>
export type BilledInvoice = { id: string; description: string; invoiceDate?: string; invoiceNumber?: string; amount: number; start: string; end: string; fuelStock?: true };

// The heating costs as the statement shares them (#209): by days, or by the profile with its names at the time
type HeatingProfileNames = { name: string; nameDE: string | null; nameFR: string | null; nameIT: string | null; nameEN: string | null };
/** A payment taken back (#92): the day of the reset and what it cleared */
export type PaymentReset = { resetOn: string; paidDate: string | null; paidAmount: string | null };

export type HeatingShare =
	// the chosen profile and why it was not applied (#247); both absent on statements created before
	| { byDays: true; reason?: 'wholePeriod' | 'noHeatingMonths'; names?: HeatingProfileNames }
	| {
			byDays: false;
			percent: number;
			months: MonthShare[];
			periodPercent?: number; // the period's months in the profile (#229); absent on statements of #209
			periodMonths?: MonthShare[]; // where they do not carry 100 % (#232); absent before
			names: HeatingProfileNames;
	  };

// The last statement number given per prefix NK-{building}-{year}-, so a deleted draft's number is not given again (#97)
export const statementNumbers = pgTable('statement_numbers', {
	prefix: varchar('prefix', { length: 50 }).primaryKey(),
	lastNumber: integer('last_number').notNull()
});

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
		// the billed rent days; the contract's dates may not change them (contract.service.ts, statementsChanged)
		rentalStart: date('rental_start').notNull(),
		rentalEnd: date('rental_end').notNull(),
		totalCosts: decimal('total_costs', { precision: 12, scale: 2 }).notNull(),
		totalAdvancePayments: decimal('total_advance_payments', { precision: 12, scale: 2 }).notNull(),
		managementFeePercent: decimal('management_fee_percent', { precision: 5, scale: 2 }),
		managementFee: decimal('management_fee', { precision: 12, scale: 2 }).default('0'),
		// Settings of the generation run, printed in the PDF
		heatingProfileId: uuid('heating_profile_id').references(() => heatingProfiles.id, { onDelete: 'set null' }),
		// the Tankbestand readings the statement was created with
		fuelStock: jsonb('fuel_stock').$type<{ categoryId: string; openingDate: string; opening: string; closingDate: string; closing: string }>(),
		keyValues: jsonb('key_values').$type<KeyValues>(),
		heatingShare: jsonb('heating_share').$type<HeatingShare>(),
		// #464: the Akonto lines as calculated (months × amount); null: created before, the PDF prints only the total
		advanceLines: jsonb('advance_lines').$type<AdvanceLine[]>(),
		agreedCategoryIds: jsonb('agreed_category_ids').$type<string[]>(), // agreed when created (#91); null: before
		paymentResets: jsonb('payment_resets').$type<PaymentReset[]>().notNull().default([]), // payments taken back (#92)
		paymentRecordedAt: timestamp('payment_recorded_at'), // when the payment was recorded (#92)
		// «Nicht berichtigt» (#454): the day and the result of the recalculation the landlord did not correct to
		// TODO(fachlich prüfen, #538): «Nicht berichtigt» has no glossary row yet
		correctionDeclined: jsonb('correction_declined').$type<{ on: string; result: string }>(),
		// a berichtigte Abrechnung: the statement it replaces and what was already paid on that one and its own (#120)
		replacesId: uuid('replaces_id').references((): AnyPgColumn => utilityStatements.id),
		priorPayments: decimal('prior_payments', { precision: 12, scale: 2 }).notNull().default('0'),
		// the Übertrag: the statement of the same Mietvertrag whose Saldo below CHF 5 this one counts in (#448)
		carriedFromId: uuid('carried_from_id').references((): AnyPgColumn => utilityStatements.id),
		balance: decimal('balance', { precision: 12, scale: 2 }).notNull(), // positive = tenant owes, negative = refund
		status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, sent, paid, settled (#448), replaced; overdue is computed from the payment deadline
		paymentDeadline: date('payment_deadline'),
		paidDate: date('paid_date'),
		paidAmount: decimal('paid_amount', { precision: 12, scale: 2 }),
		reminderSentDate: date('reminder_sent_date'),
		pdfBlob: text('pdf_blob'), // Base64 encoded PDF
		pdfGeneratedAt: timestamp('pdf_generated_at'),
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
		uniqueIndex('statements_number_idx').on(table.statementNumber),
		uniqueIndex('statements_replaces_idx').on(table.replacesId)
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
		apartmentShare: decimal('apartment_share', { precision: 12, scale: 2 }), // the apartment's part of the total by the key
		periodShare: decimal('period_share', { precision: 8, scale: 4 }), // 0-1: days rented, or the heating profile's share
		// the period share as days (#208): the tenant's days in the days billed, and those days; null when not a ratio of days
		positionRentalDays: integer('position_rental_days'),
		billedDays: integer('billed_days'),
		invoiceParts: jsonb('invoice_parts').$type<InvoicePart[]>(), // the invoices of a position over different days (#226)
		invoices: jsonb('invoices').$type<BilledInvoice[]>(), // the invoices it billed (#96); null: created before
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
// Documents Table (generated letters such as payment reminders, files uploaded to a tenant)
// ============================================================================
export const documents = pgTable(
	'documents',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		tenantId: uuid('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'restrict' }),
		statementId: uuid('statement_id').references(() => utilityStatements.id, { onDelete: 'restrict' }),
		type: varchar('type', { length: 30 }).notNull(), // reminder, statement (e-mailed, #86), upload
		reminderLevel: integer('reminder_level'), // 1 = Zahlungserinnerung, 2 and 3 = Mahnung
		title: varchar('title', { length: 255 }).notNull(),
		fileName: varchar('file_name', { length: 255 }).notNull(),
		content: text('content').notNull(), // Base64 encoded file
		mimeType: varchar('mime_type', { length: 50 }).notNull().default('application/pdf'),
		channel: varchar('channel', { length: 10 }), // email, letter; null for an upload
		status: varchar('status', { length: 20 }), // sent, to_send; null for an upload
		sentAt: timestamp('sent_at'),
		deliveryError: text('delivery_error'),
		recipient: varchar('recipient', { length: 255 }), // the e-mail address it went to (#449); null for a letter or an upload
		paymentDeadline: date('payment_deadline'), // the Zahlungsfrist a reminder prints; null for an upload
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('documents_tenant_id_idx').on(table.tenantId),
		index('documents_statement_id_idx').on(table.statementId),
		index('documents_status_idx').on(table.status)
	]
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

// The Protokoll under «Einstellungen» (#357): logins and changes, each with its time and a snapshot of what it names
export const auditLog = pgTable('audit_log', {
	id: uuid('id').defaultRandom().primaryKey(),
	occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
	action: varchar('action', { length: 50 }).notNull(),
	details: jsonb('details').$type<Record<string, unknown>>().notNull()
});

// Konto mit Passwort (#576): the sign-in without a provider; the password only as Argon2id hash
export const localAccounts = pgTable('local_accounts', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	failedAttempts: integer('failed_attempts').notNull().default(0),
	lockedUntil: timestamp('locked_until', { withTimezone: true }),
	passwordChangedAt: timestamp('password_changed_at', { withTimezone: true }).defaultNow().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// #580: the KI set in the browser, one row; the API key only encrypted (ki-settings.service.ts)
export const kiSettings = pgTable('ki_settings', {
	id: integer('id').primaryKey().default(1),
	mode: varchar('mode', { length: 10 }).notNull().$type<'local' | 'provider' | 'none'>(),
	baseUrl: text('base_url'),
	model: text('model'),
	provider: text('provider'),
	providerCountry: text('provider_country'),
	apiKeyEncrypted: text('api_key_encrypted'),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

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

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type Configuration = typeof configuration.$inferSelect;
export type NewConfiguration = typeof configuration.$inferInsert;
