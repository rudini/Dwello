import type { StatementPayment, StatementStatus, StatementWithDetails as StatementResponse } from '../../backend/src/api/statement';
import type { DocumentSummary } from '../../backend/src/api/document';
import type { SplitKey } from '../../backend/src/services/split-keys';
import type {
	InvoiceWithDetails as InvoiceResponse,
	LatestKey
} from '../../backend/src/api/invoice';
import type {
	ContractResponse,
	ContractWithDetails as ContractRow
} from '../../backend/src/api/contract';
import type { ApartmentStatus, ApartmentWithDetails } from '../../backend/src/api/apartment';
import type {
	BuildingAddress,
	BuildingWithStats as BuildingResponse
} from '../../backend/src/api/building';
import type {
	AllocabilityProposal,
	CategoryWithUsage as CategoryResponse
} from '../../backend/src/api/category';
import type {
	DistributionKeyWithUsage,
	MasterDataType
} from '../../backend/src/api/distribution-key';
import type { HeatingProfileDetails } from '../../backend/src/api/heating-profile';
import type { TenantResponse, TenantWithOccupancy } from '../../backend/src/api/tenant';

/** A backend type as its JSON arrives: dates as ISO strings */
export type Json<T> = { [K in keyof T]: T[K] extends Date ? string : T[K] extends Date | null ? string | null : T[K] };
// ============================================================================
// Core Entity Types - Match backend schema (camelCase)
// ============================================================================

// The building as the pages show it, derived from GET /buildings/:id (#837, ADR 0005)
type ApiBuilding = Json<BuildingResponse>;
export type Building = BuildingAddress &
	Partial<
		Pick<
			ApiBuilding,
			'country' | 'buildingType' | 'yearBuilt' | 'noTank' | 'createdAt' | 'updatedAt'
		>
	>;

// Building with apartment statistics
export interface BuildingWithStats
	extends Building, Pick<ApiBuilding, 'apartmentCount' | 'occupiedCount' | 'vacantCount'> {
	reletStarts?: string[]; // Vertragsbeginn of each relet apartment, from the BFF: the backend counts only occupied and vacant
	reservedCount?: number;
}

// What the Gebäude- und Wohnungsregister (GWR) knows of an address, read by the BFF (#479)
export interface AddressHit {
	egid: string;
	street: string;
	postalCode: string;
	city: string;
	canton: string;
}

type RegisterField = 'number' | 'floor' | 'area' | 'rooms';
export interface RegisterApartment {
	number: string;
	floor: number | null;
	area: string;
	rooms: string;
	missing: RegisterField[]; // what the register lacks, for the landlord to enter
}

export interface RegisterBuilding {
	buildingType: string | null;
	yearBuilt: number | null;
	apartments: RegisterApartment[];
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
export type { ApartmentStatus, LatestKey };

// The apartment as the pages show it, derived from GET /apartments/:id (#837, ADR 0005)
type ApiApartment = Json<ApartmentWithDetails>;
export type Apartment = Pick<ApiApartment, 'id' | 'buildingId' | 'number' | 'floor' | 'status'> &
	Partial<
		Pick<
			ApiApartment,
			'nextContractStart' | 'currentContractEnd' | 'lastContractEnd' | 'createdAt' | 'updatedAt'
		>
	> & {
		area: string | number; // decimal from DB
		rooms: string | number; // decimal from DB (e.g., 3.5)
	};

// The tenant as GET /tenants/:id answers it, derived from the backend instead of declared again (AP1, ADR 0003):
// a field the backend adds arrives here without a change; a page may hold only part of it
type ApiTenant = Json<TenantResponse>;
export type Tenant = Pick<ApiTenant, 'id' | 'firstName' | 'lastName' | 'language'> &
	Partial<
		Omit<ApiTenant, 'contractCount' | 'anonymisedOn' | 'currentApartment' | 'currentBuilding'>
	>;

// The contract as GET /contracts/:id answers it, derived from the backend (AP1, ADR 0005); a page may hold only part of it
type ApiContract = Json<ContractResponse>;
export type RentalContract = Pick<
	ApiContract,
	'id' | 'apartmentId' | 'tenantId' | 'startDate' | 'status' | 'baseRent' | 'monthlyAdvancePayment'
> &
	Partial<
		Pick<
			ApiContract,
			| 'endDate'
			| 'terminated' // endDate is a Kündigungstermin of an open-ended contract, not agreed
			| 'noticeReceivedOn' // A-3
			| 'billedUntil' // «Abgerechnet bis» (#133)
			| 'additionalRent'
			| 'advancePayments' // each Akonto with its «Gültig ab» (#464)
			| 'proposedAdvanceFrom' // «Gültig ab» the form proposes for a new Akonto (#815)
			| 'flatRateUtilityCharge' // «Nebenkostenpauschale» (#429): in «Monatlich total», never billed
			| 'managementFeeAgreed' // #89
			| 'managementFeePercent'
			| 'agreedCategoryIds' // #91
			| 'agreedFrom' // #368
			| 'referenceIndex'
			| 'contractPdf'
			| 'notes'
			| 'createdAt'
			| 'updatedAt'
		>
	>;

// One row of a contract history (apartment or tenant page)
export type ContractHistory = Pick<
	ApiContract,
	'id' | 'status' | 'startDate' | 'endDate' | 'terminated'
> & {
	tenantName: string;
	monthlyTotal: number; // in CHF
	apartment?: string;
};

// Monthly costs breakdown
export interface MonthlyCosts {
	baseRent: number;
	advancePayment?: number;
	flatRateUtilityCharge?: number; // «Nebenkostenpauschale» (#429)
	additionalRent?: number;
	monthlyTotal: number;
}

// A row of GET /apartments as the list shows it (#837, ADR 0005)
export type ApartmentListItem = Apartment & Pick<ApiApartment, 'buildingName'>;

// Apartments list response
export interface ApartmentsListData {
	apartments: ApartmentListItem[];
	total: number;
	page: number;
	pageSize: number;
	buildings: { id: string; name: string; address: string }[];
}

// A row of GET /tenants as the list shows it (#837, ADR 0005): whether a contract runs today (isActive) or none runs
// and one is signed for later (isFuture, F-4, #58) comes from the backend
type ApiTenantRow = Json<TenantWithOccupancy>;
export type TenantListItem = Tenant &
	Pick<ApiTenantRow, 'isActive' | 'isFuture'> & {
		currentApartment?: string | null; // the backend's apartment number in words
		currentBuilding?: ApiTenantRow['currentBuilding'] | null;
		nextContractStart?: string | null; // Vertragsbeginn of a future contract, from GET /contracts
	};

// Tenants list response
export interface TenantsListData {
	tenants: TenantListItem[];
	total: number;
	page: number;
	pageSize: number;
}

// Contract with full details for list view
export interface ContractWithDetails
	extends
		RentalContract,
		Pick<Json<ContractRow>, 'tenantName' | 'apartmentNumber' | 'buildingName' | 'buildingAddress'> {
	totalRent: number;
	missingStatement?: boolean; // #211: an ended period with rent days but no statement
}

// Contracts list response
export interface ContractsListData {
	contracts: ContractWithDetails[];
	total: number;
	page: number;
	pageSize: number;
	buildings: { id: string; name: string; address: string }[];
	apartments: { id: string; number: string; buildingId: string }[];
}

// The master data as the German interface shows it, derived from the backend rows (#837, ADR 0005): `name` is the
// German name, a missing text is empty
type ApiCategory = Json<CategoryResponse>;
export type Category = Pick<
	ApiCategory,
	'id' | 'isAllowedUtilityCost' | 'isHeatingCost' | 'isFuel'
> & {
	name: string;
	nameFR: string;
	nameIT: string;
	nameEN: string;
	description: string;
	sortOrder: number;
};

export type CategoryWithUsage = Category & {
	key: string; // the stored name: the English key of a predefined category, which names its reason (#186)
	usageCount: number;
	allocableInvoiceCount: number; // the invoices a save as «nicht umlagefähig» takes out (#309)
	predefined: boolean;
};

/** The KI's proposal whether a new category is umlagefähig, or why there is none, for what it checked */
export type Proposal = { name: string; description: string } & (
	AllocabilityProposal | { error: string }
);

type ApiDistributionKey = Json<DistributionKeyWithUsage>;
export type DistributionKey = Pick<ApiDistributionKey, 'id'> &
	Partial<Pick<ApiDistributionKey, 'nameFR' | 'nameIT' | 'nameEN'>> & {
		name: string;
		type: MasterDataType;
		formula: string;
		description: string;
		usageCount: number;
	};

// The invoice as the pages show it, derived from GET /invoices/:id (AP1, ADR 0005); dates and ids pass unchanged
type ApiInvoice = Json<InvoiceResponse>;
export type Invoice = Pick<
	ApiInvoice,
	| 'id'
	| 'buildingId'
	| 'invoiceDate'
	| 'invoiceNumber'
	| 'servicePeriodStart' // Leistungszeitraum: the time the invoice bills, if not its date
	| 'servicePeriodEnd'
	| 'description'
	| 'categoryId'
	| 'distributionKeyId'
	| 'isValidUtilityCost'
	| 'manualOverrideReason'
	| 'createdAt'
	| 'updatedAt'
	| 'beleg' // the uploaded file, with what the KI saw on it when it was uploaded (#233)
> &
	Amounts<Pick<ApiInvoice, 'amount' | 'llmConfidence'>> & {
		billingEntity: string;
	};

// Invoice with related data for list view
export interface InvoiceWithDetails extends Invoice {
	buildingName: string;
	buildingAddress: string;
	category?: Category & { key?: string; predefined?: boolean }; // key and predefined name its reason (#292)
	distributionKey?: Pick<DistributionKey, 'id' | 'name'>;
	llmCategory?: Pick<Category, 'id' | 'name'>; // what the KI suggested
	inPeriodAmount?: number; // with the filter «Abrechnungsperiode»: its part in the period (#454)
	categorizationStatus: 'pending' | 'auto-categorized' | 'manual';
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
	kiOff: boolean; // «Keine KI»: the dialog says that nobody reads the files (#626)
}

type ApiHeatingProfile = Json<HeatingProfileDetails>;
export type HeatingProfile = Pick<
	ApiHeatingProfile,
	'id' | 'name' | 'nameFR' | 'nameIT' | 'nameEN' | 'monthlyPercentages'
> & {
	nameDE: string;
	type: MasterDataType;
	description: string;
};

/** How far the local KI's model is (#577); unknown with a KI outside the server or when the backend cannot say */
// 'none': no KI chosen yet (#620, «Später entscheiden» at the setup), as long as the operator did not set it
export type KiModel =
	{ state: 'ready' | 'failed' | 'unknown' | 'none' } | { state: 'loading'; percent: number };

// Statement types
export type { StatementStatus };

/** A statement an invoice is in: its number and status, to link it (#455) */
export type BilledStatement = { id: string; statementNumber: string; status: StatementStatus };

/** A statement as the backend answers it (#837, ADR 0005): the frontend types below take the fields it passes on */
type ApiStatement = Json<StatementResponse>;
/** Amounts the backend sends as decimal strings, as the BFF hands them on: numbers */
type Amounts<T> = { [K in keyof T]: T[K] extends string ? number : T[K] extends string | null ? number | null : T[K] };

/** A position as the backend stores it; the BFF hands on its amounts as numbers */
type ApiLineItem = ApiStatement['lineItems'][number];

export interface StatementLineItem
	extends Pick<ApiLineItem, 'id' | 'categoryId' | 'distributionKeyId'>,
		// Wohnungsanteil: the apartment's part of the total by the key; Zeitanteil 0–1
		Amounts<Pick<ApiLineItem, 'totalAmount' | 'tenantShare' | 'apartmentShare' | 'periodShare'>> {
	categoryName: string;
	distributionKeyName?: string;
	percentage: number;
	shareDays: { days: number; total: number } | null; // the Zeitanteil as days, where it is one (#208)
	byProfile?: boolean; // the Zeitanteil is the heating profile's share
	invoices: StatementLineInvoice[]; // what the position billed (#96); none before
}

/** An invoice a position billed, or the change of the Tankbestand; with its days where its invoices bill different days (#226) */
export type StatementLineInvoice = NonNullable<ApiLineItem['invoices']>[number] & {
	part: NonNullable<ApiLineItem['invoiceParts']>[number] | null;
};

export interface Statement
	extends Pick<ApiStatement, 'id' | 'statementNumber' | 'tenantId' | 'apartmentId' | 'periodStart' | 'periodEnd' | 'statementDate' | 'rentalDays' | 'status' | 'paymentDeadline'>,
		Partial<Pick<ApiStatement, 'contractId' | 'paidDate' | 'nextReminderFrom' | 'reminderToSend' | 'remindersCounted' | 'oldAddress' | 'pdfGeneratedAt' | 'notes' | 'createdAt' | 'updatedAt'>>,
		// the balance positive when the tenant owes, negative a refund
		Amounts<Pick<StatementResponse, 'totalCosts' | 'totalAdvancePayments' | 'balance'>>,
		// what was paid; a refund paid to the tenant negative (#93)
		Partial<Amounts<Pick<StatementResponse, 'paidAmount'>>> {
	buildingId: string;
	managementFee: number; // 0 when it has none
	managementFeePercent: number; // rate used when the statement was generated; 0 when it has none
	paymentResets?: { resetOn: string; paidDate: string | null }[]; // payments taken back (#92)
	correctionDeclined?: { on: string } | null; // «Nicht berichtigt» (#454)
	lastReminderDate?: string | null;
}

export interface StatementWithDetails
	extends Statement,
		Pick<ApiStatement, keyof StatementPayment | 'rentalStart' | 'rentalEnd'>,
		// a berichtigte Abrechnung: the statement it replaces with its Akonto (#464), and what replaced it (#120)
		Partial<Pick<ApiStatement, 'replaces' | 'replacedBy' | 'priorPaidOn' | 'final'>>,
		// what it allows, decided by the backend (#788): the page shows buttons and hints by it, the status only as
		// label; the BFF answers false where the backend leaves one out
		Required<
			Pick<
				ApiStatement,
				'editable' | 'correctable' | 'asksPayment' | 'superseded' | 'advanceChanged' | 'redeliverable' | 'refund' | 'newPdfToSend'
			>
		> {
	tenantName: string;
	resent: { id: string; newPdf: boolean; sentAt: string | null; createdAt: string }[]; // sendings after the first (#534, #968)
	newPdfMadeAt?: string | null; // when the new PDF still to send was made (#968)
	pdfBeforeChange?: { id: string; madeAt: string }[]; // the PDFs of a statement sent without a Dokument, kept before a change (#969)
	heatingProfileName?: string; // the profile the heating costs were spread with (A-10)
	tenantEmail?: string;
	tenantCorrespondenceChannel?: 'email' | 'letter';
	tenantLanguage?: Tenant['language'];
	tenantAddress?: string;
	apartmentUnit: string;
	apartmentFloor: number | string;
	buildingName: string;
	buildingAddress: string;
	lineItems: StatementLineItem[];
	splitKeys?: SplitKeyHint[]; // #528: the draft's lines of another key, names in the UI language
	priorPayments?: number; // what was paid on the replaced ones (#120)
	// #448: the Übertrag from the previous statement, a replaced Saldo the next one counted
	carriedFrom?: { id: string; statementNumber: string; balance: number } | null;
	openCarry?: boolean; // #506: no statement counts the Übertrag any more; the landlord settles it by hand
	carrySettledOn?: string | null; // #506: the day he did
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

// Stored letters such as payment reminders and uploaded files, as GET /documents lists them (#837, ADR 0005); an upload
// has no channel and no Versandstatus
type ApiDocument = Json<DocumentSummary>;
// optional where tests build a document; the backend always sends them
type OptionalDocumentFields = 'deliveryErrorCode' | 'paymentDeadline' | 'recipient' | 'notToSend';
export type StatementDocument = Omit<ApiDocument, OptionalDocumentFields> & Partial<Pick<ApiDocument, OptionalDocumentFields>>;

/** The Sicherung as the backend reports it (#718): off without a folder, setup until the landlord confirmed a code */
export type BackupState = { backup: 'off' | 'setup' | 'ok' | 'stale'; since?: string };

/** #528: the invoices of a Kategorie billed by another Verteilschlüssel than its largest share, names in the UI language */
export type SplitKeyHint = SplitKey & {
	categoryName: string;
	keyName: string;
	mainKeyName: string;
	buildingId?: string; // the preview of several buildings names each (Code-Review 528-1 C-3)
	buildingName?: string;
};
