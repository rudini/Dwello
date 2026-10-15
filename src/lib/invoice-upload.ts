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
	notes: [],
	duplicateOf: null,
	several: false,
	selected: true
});

// What the property manager should know about the proposal, in the order the file raises it
function notesOn(proposal: Proposal) {
	return [
		proposal.invoiceCount > 1 && m.invoices_upload_several(),
		proposal.duplicateOf && m.invoices_upload_duplicate(),
		proposal.documentType === 'reminder' && m.invoices_upload_reminder(),
		proposal.documentType === 'credit_note' && m.invoices_upload_credit_note(),
		proposal.deductedAmount && m.invoices_upload_deducted({ amount: formatCurrency(Number(proposal.deductedAmount)) }),
		proposal.nonAllocableItems && m.invoices_upload_mixed()
	].filter((note) => !!note) as string[];
}

/** The row with what the KI read; a sure Kategorie (70 % and more) is taken, as on «Neue Rechnung» */
export function withProposal(row: UploadRow, proposal: Proposal): UploadRow {
	const { fields } = proposal;
	const suggested = proposal.categorization;
	const category = suggested && suggested.confidence >= 0.7 ? suggested.category : null;
	const several = proposal.invoiceCount > 1;
	return {
		...row,
		status: 'check',
		values: {
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
		},
		suggestion: proposal.categorization,
		unsure: proposal.unsure,
		notes: notesOn(proposal),
		duplicateOf: proposal.duplicateOf,
		several,
		// a file with several invoices or one already entered is not created unless the property manager chooses it
		selected: !several && !proposal.duplicateOf
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
