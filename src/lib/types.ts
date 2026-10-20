import type { LatestKey } from './invoice';
// ============================================================================
// Core Entity Types - Match backend schema (camelCase)
// ============================================================================

// Building types
export interface Building {
	id: string;
	name: string;
	address: string;
	postalCode: string;
	city: string;
	canton: string;
	country?: string;
	buildingType?: string | null;
	yearBuilt?: number | null;
	noTank?: boolean; // no tank or decommissioned (#72)
	createdAt?: Date | string;
	updatedAt?: Date | string;
}

// Building with apartment statistics
export interface BuildingWithStats extends Building {
	apartmentCount: number;
	occupiedCount: number;
	vacantCount: number;
	reletStarts?: string[]; // Vertragsbeginn of each relet apartment, from the BFF: the backend counts only occupied and vacant
	reservedCount?: number;
}

// Buildings list response
export interface BuildingsListData {
	buildings: BuildingWithStats[];
	total: number;
	page: number;
	pageSize: number;
}

// Apartment status values (match backend)
// occupied and relet follow from the rental contracts; vacant and reserved are set by hand
export type ApartmentStatus = 'occupied' | 'relet' | 'vacant' | 'reserved';

// Apartment types (camelCase to match backend)
export interface Apartment {
	id: string;
	buildingId: string;
	number: string;
	floor: number;
	area: string | number; // decimal from DB
	rooms: string | number; // decimal from DB (e.g., 3.5)
	status: ApartmentStatus;
	nextContractStart?: string | null;
	currentContractEnd?: string | null; // last day of the contract running today (A-4)
	lastContractEnd?: string | null; // last day of the latest ended contract: «Leer seit» the day after (#145)
	createdAt?: Date | string;
	updatedAt?: Date | string;
}

// Tenant types (camelCase to match backend)
export interface Tenant {
	id: string;
	firstName: string;
	lastName: string;
	email?: string | null;
	phone?: string | null;
	language: 'de' | 'fr' | 'it' | 'en';
	address?: string | null;
	postalCode?: string | null;
	city?: string | null;
	country?: string; // ISO 3166 code of the Korrespondenzadresse, CH by default
	correspondenceChannel?: 'email' | 'letter';
	createdAt?: Date | string;
	updatedAt?: Date | string;
}

// Rental Contract types (camelCase to match backend)
export interface RentalContract {
	id: string;
	apartmentId: string;
	tenantId: string;
	startDate: string;
	endDate?: string | null;
	terminated?: boolean; // endDate is a Kündigungstermin of an open-ended contract, not agreed
	noticeReceivedOn?: string | null; // the day the notice arrived (A-3)
	billedUntil?: string | null; // «Abgerechnet bis» (#133): billed outside Dwello up to this day
	baseRent: string | number; // decimal from DB
	additionalRent?: string | number | null;
	monthlyAdvancePayment: string | number; // Akonto that applies today, or on the start of a future contract
	advancePayments?: { validFrom: string; amount: string }[]; // each Akonto with its «Gültig ab» (#464)
	flatRateUtilityCharge?: string | number; // «Nebenkostenpauschale» (#429): in «Monatlich total», never billed
	managementFeeAgreed?: boolean; // #89: without it no Verwaltungspauschale
	managementFeePercent?: string | null; // own rate, before the run's
	agreedCategoryIds?: string[]; // #91: the umlagefähige categories it agrees
	referenceIndex?: string | number | null;
	contractPdf?: string | null;
	notes?: string | null;
	createdAt?: Date | string;
	updatedAt?: Date | string;
}

// Contract History item (derived from RentalContract + Tenant)
export interface ContractHistory {
	id: string;
	tenantName: string;
	monthlyTotal: number; // in CHF
	status: 'active' | 'ended' | 'future';
	apartment?: string;
	startDate: string;
	endDate?: string | null;
	terminated?: boolean;
}

// Monthly costs breakdown
export interface MonthlyCosts {
	baseRent: number;
	advancePayment?: number;
	flatRateUtilityCharge?: number; // «Nebenkostenpauschale» (#429)
	additionalRent?: number;
	monthlyTotal: number;
}

// Apartment with building info for list view
export interface ApartmentWithBuilding extends Apartment {
	buildingName?: string;
	buildingAddress: string;
	buildingCity: string;
	nextContractStart?: string | null;
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
	currentApartment?: string | null;
	currentBuilding?: string | null;
	nextContractStart?: string | null; // Vertragsbeginn of a future contract
	isActive: boolean; // a contract runs today
	isFuture: boolean; // none runs today, one is signed for later (F-4, #58)
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
	tenantName: string;
	tenantFirstName: string;
	tenantLastName: string;
	apartmentNumber: string;
	buildingName?: string;
	buildingAddress: string;
	totalRent: number;
	missingStatement?: boolean; // #211: an ended period with rent days but no statement
}

// Contracts list response
export interface ContractsListData {
	today: string; // the server's day, so that every Vertragsstatus is computed from the same one
	contracts: ContractWithDetails[];
	total: number;
	page: number;
	pageSize: number;
	buildings: { id: string; name: string; address: string }[];
	apartments: { id: string; number: string; buildingId: string }[];
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
	// Shared by the heating profile at a tenant change (heating, chimney sweep), not by days
	isHeatingCost?: boolean;
	// Brennstoff (#100): deliveries of Heizmaterial, the only categories with a Tankbestand
	isFuel?: boolean;
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
	/** Leistungszeitraum: the time the invoice bills, if not its date */
	servicePeriodStart?: string | null;
	servicePeriodEnd?: string | null;
	billingEntity: string;
	description: string;
	amount: number;
	categoryId?: string;
	distributionKeyId?: string;
	isValidUtilityCost: boolean;
	llmConfidence?: number;
	manualOverrideReason?: string;
	createdAt?: string;
	updatedAt?: string;
}

// Invoice with related data for list view
export interface InvoiceWithDetails extends Invoice {
	buildingName?: string;
	buildingAddress: string;
	category?: Category & { key?: string; predefined?: boolean }; // key and predefined name its reason (#292)
	distributionKey?: Pick<DistributionKey, 'id' | 'name'>;
	llmCategory?: Pick<Category, 'id' | 'name'>; // what the KI suggested
	inPeriodAmount?: number; // with the filter «Abrechnungsperiode»: its part in the period (#454)
	categorizationStatus: 'pending' | 'auto-categorized' | 'manual';
	// the uploaded file of the invoice, with what the KI saw on it when it was uploaded (#233)
	beleg: { fileName: string; mimeType: string; deductedAmount?: string | null; nonAllocableItems?: boolean } | null;
	invoiceNumber?: string;
}

// Invoices list response
export interface InvoicesListData {
	invoices: InvoiceWithDetails[];
	total: number;
	page: number;
	pageSize: number;
	buildings: { id: string; name: string; address: string; tank?: string }[]; // tank: the category of its tank (#451)
	categories: Category[];
	years: string[]; // Rechnungsdatum years offered in the filter
	distributionKeys: { id: string; name: string }[]; // offered for the invoices of «Rechnungen hochladen»
	defaultDistributionKeyId: string; // preselected there, as set in the settings
	latestKeys: LatestKey[]; // proposed there (#379)
}

// Heating Profile types
export interface HeatingProfile {
	id: string;
	name: string;
	nameDE?: string;
	nameFR?: string | null;
	nameIT?: string | null;
	nameEN?: string | null;
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

// Statement types
export type StatementStatus = 'draft' | 'sent' | 'paid' | 'settled' | 'overdue' | 'replaced';

/** A statement an invoice is in: its number and status, to link it (#455) */
export type BilledStatement = { id: string; statementNumber: string; status: StatementStatus };

export interface StatementLineItem {
	id: string;
	categoryId: string;
	categoryName: string;
	distributionKeyId?: string;
	distributionKeyName?: string;
	totalAmount: number;
	tenantShare: number;
	percentage: number;
	apartmentShare: number | null; // Wohnungsanteil: the apartment's part of the total by the key
	periodShare: number | null; // Zeitanteil, 0–1
	shareDays: { days: number; total: number } | null; // the Zeitanteil as days, where it is one (#208)
	byProfile?: boolean; // the Zeitanteil is the heating profile's share
	invoices: StatementLineInvoice[]; // what the position billed (#96); none before
}

/** An invoice a position billed, or the change of the Tankbestand; with its days where its invoices bill different days (#226) */
export interface StatementLineInvoice {
	id: string;
	description: string;
	amount: number;
	start: string;
	end: string;
	fuelStock?: true;
	part: {
		days: number;
		total: number;
		noPeriod?: true;
		whole?: { start: string; end: string; amount: number };
		profile?: { percent: number }; // a heating invoice by the Heizprofil's months in its days (#71)
	} | null;
}

export interface Statement {
	id: string;
	statementNumber: string;
	tenantId: string;
	apartmentId: string;
	buildingId: string;
	periodStart: string;
	periodEnd: string;
	statementDate: string;
	rentalDays: number;
	totalCosts: number;
	totalAdvancePayments: number;
	managementFee: number;
	managementFeePercent: number; // rate used when the statement was generated
	balance: number; // positive = tenant owes, negative = refund
	status: StatementStatus;
	paymentDeadline: string;
	paidDate?: string;
	paidAmount?: number | null; // what was paid; a refund paid to the tenant negative (#93)
	contractId?: string;
	paymentResets?: { resetOn: string; paidDate: string | null }[]; // payments taken back (#92)
	correctionDeclined?: { on: string } | null; // «Nicht berichtigt» (#454)
	lastReminderDate?: string;
	nextReminderFrom?: string | null; // the day after the last reminder's Zahlungsfrist; none after the 3rd (#107)
	reminderToSend?: boolean; // a reminder still to send holds the next Mahnstufe (#449)
	oldAddress?: boolean; // A-5 (#114): the moved-out tenant still has the building's address
	pdfGeneratedAt?: string;
	notes?: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface StatementWithDetails extends Statement {
	tenantName: string;
	heatingProfileName?: string; // the profile the heating costs were spread with (A-10)
	tenantEmail?: string;
	tenantCorrespondenceChannel?: 'email' | 'letter';
	tenantLanguage?: Tenant['language'];
	tenantAddress?: string;
	apartmentUnit: string;
	apartmentFloor: string;
	buildingName: string;
	buildingAddress: string;
	rentalStart: string; // the Mietvertrag's days within the period, YYYY-MM-DD (#248)
	rentalEnd: string;
	lineItems: StatementLineItem[];
	// a berichtigte Abrechnung: the statement it replaces, what was paid on the replaced ones and where (#120)
	replaces?: {
		id: string;
		statementNumber: string;
		statementDate: string;
		totalAdvancePayments?: number | string; // #464: its Akonto, to warn when the berichtigte one counts another
	} | null;
	replacedBy?: { id: string; statementNumber: string } | null;
	priorPayments?: number;
	priorPaidOn?: string[];
	// #448: a Schlussabrechnung, the Übertrag from the previous statement, a replaced Saldo the next one counted
	final?: boolean;
	carriedFrom?: { id: string; statementNumber: string; balance: number } | null;
	offsetWith?: { statementNumber: string; amount: number }[];
}

export interface StatementsListData {
	statements: StatementWithDetails[];
	total: number;
	page: number;
	pageSize: number;
	buildings: { id: string; name: string }[];
	/** Which statements a contract or period filter shows, as a sentence; null without such a filter */
	scope: string | null;
	statusCounts: {
		draft: number;
		sent: number;
		paid: number;
		settled: number;
		overdue: number;
	};
}

// Stored letters such as payment reminders (PDF lives in the backend)
export interface StatementDocument {
	id: string;
	tenantId: string;
	statementId: string | null;
	type: 'reminder' | 'statement' | 'upload'; // an upload has no channel and no Versandstatus
	reminderLevel: number | null;
	title: string;
	fileName: string;
	mimeType: 'application/pdf' | 'image/jpeg' | 'image/png';
	channel: 'email' | 'letter' | null;
	status: 'sent' | 'to_send' | null;
	sentAt: string | null;
	deliveryError: string | null;
	deliveryErrorCode?: string | null;
	paymentDeadline?: string | null; // the Zahlungsfrist a reminder prints
	recipient?: string | null; // the e-mail address it went to (#449)
	notToSend?: 'paid' | 'replaced' | null; // a reminder to send whose statement is paid or replaced since (#449)
	createdAt: string;
	tenantName: string;
	statementNumber: string | null;
}
