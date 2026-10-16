import { m } from '$lib/paraglide/messages';
import { plainAmount, servicePeriodOf, suggestionProvenance, validateInvoice, type Suggestion } from '$lib/invoice';
import { formatCurrency } from '$lib/utils/format';

/** What the backend proposes for an uploaded file (POST /invoices/extract, tests/contracts/invoice-extraction.json) */
export type Proposal = {
	invoiceCount: number;
	documentType: string; // invoice, reminder or credit_note
	fields: Record<
		| 'billingEntityName'
		| 'invoiceNumber'
		| 'invoiceDate'
		| 'amount'
		| 'servicePeriodStart'
		| 'servicePeriodEnd'
		| 'dueDate'
		| 'description',
		string | null
	>;
	deductedAmount: string | null;
	nonAllocableItems: boolean;
	unsure: string[];
	categorization: Suggestion | null;
	duplicateOf: string | null;
};

export const MAX_FILES = 20;
export const MAX_PAGES = 3; // the pages of a PDF the KI reads
const MAX_MEGABYTES = 10; // as the backend counts them: 10 × 1024 × 1024 bytes

/** The fields of one invoice as the dialog edits them */
export type UploadValues = {
	invoiceNumber: string;
	invoiceDate: string;
	servicePeriodStart: string;
	servicePeriodEnd: string;
	dueDate: string;
	amount: string;
	billingEntity: string;
	description: string;
	categoryId: string;
	distributionKeyId: string;
	isValidUtilityCost: boolean;
};

/**
 * One file in the dialog: being read, to check (with what the KI proposed), not read because Dwello did not answer,
 * or refused (not a file Dwello keeps)
 */
export type UploadRow = {
	key: number;
	file: File;
	status: 'reading' | 'check' | 'failed' | 'refused';
	values: UploadValues;
	suggestion: Suggestion | null;
	unsure: string[]; // fields the KI read without being sure
	missing: string[]; // fields the KI did not find in the file
	morePages: boolean; // the file has more pages than the KI was shown
	notes: string[]; // what the property manager should know about the file
	duplicateOf: string | null;
	several: boolean;
	selected: boolean;
	createError?: string; // why the invoice was not created
};

// The kinds of file Dwello keeps, told by their first bytes, as the backend checks them
const STARTS = [[0x25, 0x50, 0x44, 0x46, 0x2d], [0xff, 0xd8, 0xff], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]];

/** Why Dwello does not take the file, or null */
export async function fileRefusal(file: File): Promise<string | null> {
	if (file.size > MAX_MEGABYTES * 1024 * 1024) return m.backend_document_too_large({ megabytes: MAX_MEGABYTES });
	const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
	return STARTS.some((start) => start.every((byte, i) => head[i] === byte)) ? null : m.backend_document_type_not_allowed();
}

export const newRow = (key: number, file: File, defaults: { distributionKeyId: string }): UploadRow => ({
	key,
	file,
	status: 'reading',
	values: {
		invoiceNumber: '',
		invoiceDate: '',
		servicePeriodStart: '',
		servicePeriodEnd: '',
		dueDate: '',
		amount: '',
		billingEntity: '',
		description: '',
		categoryId: '',
		distributionKeyId: defaults.distributionKeyId,
		isValidUtilityCost: true
	},
	suggestion: null,
	unsure: [],
	missing: [],
	morePages: false,
	notes: [],
	duplicateOf: null,
	several: false,
	selected: true
});

// The fields the KI reads, in the order the dialog shows them, with their labels
const FIELD_LABELS: [string, () => string][] = [
	['billingEntityName', m.invoices_billing_entity],
	['invoiceNumber', m.invoices_invoice_number],
	['invoiceDate', m.invoices_date],
	['servicePeriodStart', m.invoices_service_period],
	['dueDate', m.invoices_due_date],
	['amount', m.invoices_amount],
	['description', m.invoices_description]
];

// What the property manager should know about the proposal, in the order the file raises it, and the fields to check
function notesOn(proposal: Proposal, morePages: boolean, check: string[]) {
	const fields = FIELD_LABELS.filter(([field]) => check.includes(field)).map(([, label]) => label());
	return [
		morePages && m.invoices_upload_more_pages({ pages: MAX_PAGES }),
		proposal.invoiceCount > 1 && m.invoices_upload_several(),
		proposal.duplicateOf && m.invoices_upload_duplicate(),
		proposal.documentType === 'reminder' && m.invoices_upload_reminder(),
		proposal.documentType === 'credit_note' && m.invoices_upload_credit_note(),
		proposal.deductedAmount && m.invoices_upload_deducted({ amount: formatCurrency(Number(proposal.deductedAmount)) }),
		proposal.nonAllocableItems && m.invoices_upload_mixed(),
		fields.length > 0 && m.invoices_upload_check_these({ fields: fields.join(', ') })
	].filter((note) => !!note) as string[];
}

/** The row with what the KI read; a sure Kategorie (70 % and more) is taken, as on «Neue Rechnung» */
export function withProposal(row: UploadRow, proposal: Proposal): UploadRow {
	const { fields } = proposal;
	const suggested = proposal.categorization;
	const category = suggested && suggested.confidence >= 0.7 ? suggested.category : null;
	const several = proposal.invoiceCount > 1;
	const missing = Object.entries(fields)
		.filter(([field, value]) => value === null && field !== 'servicePeriodEnd')
		.map(([field]) => field);
	const read: UploadValues = {
		...row.values,
		invoiceNumber: fields.invoiceNumber ?? '',
		invoiceDate: fields.invoiceDate ?? '',
		servicePeriodStart: fields.servicePeriodStart ?? '',
		servicePeriodEnd: fields.servicePeriodEnd ?? '',
		dueDate: fields.dueDate ?? '',
		amount: fields.amount ?? '',
		billingEntity: fields.billingEntityName ?? '',
		description: fields.description ?? '',
		categoryId: category?.id ?? '',
		isValidUtilityCost: category?.isAllowedUtilityCost ?? true
	};
	// what the property manager typed before (a file read again after a failure) stays
	const typed = Object.fromEntries(Object.entries(row.values).filter(([, value]) => value !== '' && value !== true));
	return {
		...row,
		status: 'check',
		values: { ...read, ...typed, distributionKeyId: row.values.distributionKeyId },
		suggestion: proposal.categorization,
		unsure: proposal.unsure,
		missing,
		notes: notesOn(proposal, row.morePages, [...proposal.unsure, ...missing]),
		duplicateOf: proposal.duplicateOf,
		several,
		// only an invoice is preselected, and only one that can be created as it is: not a file with several invoices,
		// one already entered, a Gutschrift, a Mahnung (domain review V-9, V-10) or one mixing in costs that are not
		// allocable, whose amount must be split first (product owner, persona review)
		selected: !several && !proposal.duplicateOf && proposal.documentType === 'invoice' && !proposal.nonAllocableItems
	};
}

/** The row to fill in by hand: the KI is not available, or the file cannot be opened to show it to the KI */
export const withoutKi = (row: UploadRow, reason: 'unavailable' | 'unreadable'): UploadRow => ({
	...row,
	status: 'check',
	notes: [reason === 'unavailable' ? m.backend_extraction_unavailable() : m.invoices_upload_unreadable()]
});

/** What the invoice still lacks, by field; a Kategorie is required here, unlike on «Neue Rechnung» (#217) */
export function checkRow(row: UploadRow): Record<string, string> {
	const errors = validateInvoice({ buildingId: 'chosen in the dialog', ...row.values });
	return row.values.categoryId ? errors : { ...errors, category: m.invoices_upload_category_missing() };
}

/** The new invoice as the backend takes it */
export function invoiceOf(row: UploadRow, buildingId: string) {
	const { values } = row;
	return {
		buildingId,
		invoiceNumber: values.invoiceNumber.trim() || null,
		billingEntityName: values.billingEntity.trim(),
		description: values.description.trim(),
		amount: plainAmount(values.amount),
		invoiceDate: values.invoiceDate,
		...servicePeriodOf(values),
		dueDate: values.dueDate || null,
		categoryId: values.categoryId,
		distributionKeyId: values.distributionKeyId || null,
		isValidUtilityCost: values.isValidUtilityCost,
		...suggestionProvenance(row.suggestion)
	};
}

/** The caution at a field the KI filled without being sure, or left empty because it did not find the value */
export function fieldNote(read: { unsure: string[]; missing: string[] }, field: string) {
	if (read.unsure.includes(field)) return { text: m.invoices_upload_unsure(), testid: `invoice-upload-unsure-${field}` };
	if (read.missing.includes(field))
		return { text: m.invoices_upload_missing(), testid: `invoice-upload-missing-${field}` };
}
