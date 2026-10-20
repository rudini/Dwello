import { m } from '$lib/paraglide/messages';
import { plainAmount, servicePeriodOf, suggestionProvenance, validateInvoice, type Suggestion } from '$lib/invoice';
import { formatCurrency } from '$lib/utils/format';

/** What the backend proposes for an uploaded file (POST /invoices/extract, tests/contracts/invoice-extraction.json) */
export type Proposal = {
	invoiceCount: number;
	documentType: string; // invoice, advance_invoice, reminder or credit_note
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
	documentType: string; // invoice, advance_invoice, reminder or credit_note, as the KI read it
	deducted: string | null; // Akontorechnungen deducted on the Rechnung, with the total proposed (#455)
	byHand: boolean; // the KI read nothing: every field is filled in by hand
	notRead?: boolean; // the KI was not available for this file (#245: said until the required fields are filled)
	hints: { deductedAmount: string | null; nonAllocableItems: boolean }; // kept with the Beleg (persona Anna)
	proposedKey: string; // the Verteilschlüssel Dwello set: another one the property manager chose himself (#455)
	selected: boolean;
	createError?: string; // why the invoice was not created
};

// The kinds of file Dwello keeps, told by their first bytes, as the backend checks them
const STARTS: [string, number[]][] = [
	['application/pdf', [0x25, 0x50, 0x44, 0x46, 0x2d]],
	['image/jpeg', [0xff, 0xd8, 0xff]],
	['image/png', [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]]
];

/** The type of the file by its first bytes, never by its name: a file is shown only as what it is (C-7), or null */
export async function fileType(file: File): Promise<string | null> {
	const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
	return STARTS.find(([, start]) => start.every((byte, i) => head[i] === byte))?.[0] ?? null;
}

/** Why Dwello does not take the file, or null */
export async function fileRefusal(file: File): Promise<string | null> {
	if (file.size > MAX_MEGABYTES * 1024 * 1024) return m.backend_document_too_large({ megabytes: MAX_MEGABYTES });
	return (await fileType(file)) ? null : m.backend_document_type_not_allowed();
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
	documentType: 'invoice',
	deducted: null,
	byHand: false,
	hints: { deductedAmount: null, nonAllocableItems: false },
	proposedKey: defaults.distributionKeyId,
	selected: true
});

/**
 * The row with the Verteilschlüssel of the building's invoices of its Kategorie (#455, #268), unless there is none or
 * the property manager chose another key himself
 */
export function proposeKey(row: UploadRow, key: string | null): UploadRow {
	if (!key || key === row.values.distributionKeyId || row.values.distributionKeyId !== row.proposedKey) return row;
	return { ...row, values: { ...row.values, distributionKeyId: key }, proposedKey: key };
}

// The fields the property manager checks, with their labels, in the order of the form (#245, persona Helga of #233)
const FIELD_LABELS: [string, () => string][] = [
	['invoiceNumber', m.invoices_invoice_number],
	['invoiceDate', m.invoices_date],
	['servicePeriodStart', m.invoices_service_period],
	['amount', m.invoices_amount],
	['billingEntityName', m.invoices_billing_entity],
	['description', m.invoices_description],
	['dueDate', m.invoices_due_date]
];
// without these an invoice is not created (validateInvoice)
const REQUIRED = ['billingEntityName', 'invoiceDate', 'amount', 'description'];

const named = (fields: string[]) =>
	FIELD_LABELS.filter(([field]) => fields.includes(field))
		.map(([, label]) => label())
		.join(', ');

/**
 * What is left to do before creating, from the values as they are now (C-1): costs not allocable to take out, the
 * Kategorie, required fields not found, unsure fields, then optional fields not found (personas Anna, Helga; domain
 * review V-5, V-8); nothing on a file no invoice is created from
 */
export function toDoOf(row: UploadRow): string[] {
	// nothing to fill in on a file no invoice is created from: several invoices, a Gutschrift, a Mahnung (persona Dr. Weber),
	// an Akontorechnung the property manager did not choose to record (#455)
	// or a duplicate he did not tick again (#245)
	const recorded =
		(row.documentType === 'invoice' && !(row.duplicateOf && !row.selected)) ||
		(row.documentType === 'advance_invoice' && row.selected);
	// a file whose reading failed is filled in by hand too (#245, code review 233-4 C-25)
	const byHand = row.byHand || row.status === 'failed';
	if ((row.status !== 'check' && row.status !== 'failed') || row.several || !recorded) return [];
	const mixed = mixedCosts(row);
	// without the KI the required fields are named at once, not only after creating (persona Helga); a required one
	// counts as done as the create button counts it, an optional one once anything is in it
	const formField = (field: string) => FORM_FIELD[field as keyof Proposal['fields']];
	const wrong = validateInvoice({ buildingId: 'chosen in the dialog', ...row.values });
	const required = REQUIRED.filter((field) => (byHand || row.missing.includes(field)) && wrong[formField(field)]);
	const optional = row.missing.filter((field) => !REQUIRED.includes(field) && !row.values[formField(field)]);
	return [
		row.notRead && required.length > 0 && m.invoices_upload_not_read(),
		mixed && m.invoices_upload_mixed(),
		!row.values.categoryId && m.invoices_upload_category_missing(),
		required.length > 0 && m.invoices_upload_fill_in({ fields: named(required) }),
		row.unsure.length > 0 && m.invoices_upload_check_these({ fields: named(row.unsure) }),
		optional.length > 0 && m.invoices_upload_add_if_shown({ fields: named(optional) })
	].filter((note) => !!note) as string[];
}

// What the property manager should know about the file, in the order it raises it
function notesOn(proposal: Proposal, morePages: boolean) {
	return [
		morePages && m.invoices_upload_more_pages({ pages: MAX_PAGES }),
		proposal.invoiceCount > 1 && m.invoices_upload_several(),
		proposal.duplicateOf && m.invoices_upload_duplicate(),
		proposal.documentType === 'reminder' && m.invoices_upload_reminder(),
		proposal.documentType === 'credit_note' && creditNote(proposal),
		proposal.documentType === 'advance_invoice' && m.invoices_upload_advance_invoice()
	];
}

// A Gutschrift with its amount (#245, persona Marco of #233); not the total of a file that deducts amounts, which
// would be a Schlussrechnung's total, not a credit (domain review 245 V-6)
const creditNote = (proposal: Proposal) =>
	proposal.fields.amount && !proposal.deductedAmount
		? m.invoices_upload_credit_note_amount({ amount: formatCurrency(Number(proposal.fields.amount)) })
		: m.invoices_upload_credit_note();

// costs that are not allocable only on an invoice that is: a Kategorie that is not keeps them out already, also one the
// property manager chooses later (domain review V-1, V-8)
const mixedCosts = (row: UploadRow) => row.hints.nonAllocableItems && row.values.isValidUtilityCost;

/** Why a file Dwello read is not ticked for creating, said at its checkbox until it is (#245, product owner) */
export function selectionHelp(row: UploadRow) {
	if (row.selected || row.status !== 'check') return undefined;
	if (row.documentType === 'credit_note') return m.invoices_upload_unticked_credit();
	// only a single invoice not entered yet waits for its amount to be split (code review 245 C-1)
	if (mixedCosts(row) && row.documentType === 'invoice' && !row.several && !row.duplicateOf)
		return m.invoices_upload_unticked_mixed();
}

// Akontorechnungen the Rechnungssteller deducted, with the total the KI proposes as the Betrag (#455)
function deductedOn(proposal: Proposal) {
	if (!proposal.deductedAmount) return null;
	const amount = formatCurrency(Number(proposal.deductedAmount));
	const total = proposal.fields.amount;
	return total
		? m.invoices_upload_deducted({ amount, total: formatCurrency(Number(total)) })
		: m.invoices_upload_deducted_no_total({ amount });
}

// The fields of the form each value of the KI's answer goes to
const FORM_FIELD: Record<keyof Proposal['fields'], keyof UploadValues> = {
	billingEntityName: 'billingEntity',
	invoiceNumber: 'invoiceNumber',
	invoiceDate: 'invoiceDate',
	amount: 'amount',
	servicePeriodStart: 'servicePeriodStart',
	servicePeriodEnd: 'servicePeriodEnd',
	dueDate: 'dueDate',
	description: 'description'
};

// The values the KI read, under what the property manager typed before (a file read again after a failure); a
// Kategorie they chose keeps whether its costs are allocable with it (domain review V-15)
function valuesOf(row: UploadRow, fields: Proposal['fields'], category: Suggestion['category']): UploadValues {
	const read = Object.fromEntries(
		Object.entries(FORM_FIELD).map(([field, formField]) => [formField, fields[field as keyof Proposal['fields']] ?? ''])
	);
	const chosen = { categoryId: category?.id ?? '', isValidUtilityCost: category?.isAllowedUtilityCost ?? true };
	const typed = Object.fromEntries(Object.entries(row.values).filter(([, value]) => value !== '' && value !== true));
	if (row.values.categoryId) typed.isValidUtilityCost = row.values.isValidUtilityCost;
	return { ...row.values, ...read, ...chosen, ...typed, distributionKeyId: row.values.distributionKeyId };
}

// What the KI did not find, or read without being sure, and the property manager did not fill in before (C-42)
function readIn(row: UploadRow, proposal: Proposal) {
	const filledIn = (field: string) => !!row.values[FORM_FIELD[field as keyof Proposal['fields']]];
	const missing = Object.entries(proposal.fields)
		.filter(([field, value]) => value === null && field !== 'servicePeriodEnd' && !filledIn(field))
		.map(([field]) => field);
	return { missing, unsure: proposal.unsure.filter((field) => !filledIn(field)) };
}

// Only an invoice that can be created as it is: not a file with several invoices, one already entered, a Gutschrift,
// a Mahnung (domain review V-9, V-10), an Akontorechnung (#455) or one mixing in costs that are not allocable, whose amount must be split first
const preselected = (proposal: Proposal) =>
	proposal.invoiceCount === 1 &&
	!proposal.duplicateOf &&
	proposal.documentType === 'invoice' &&
	!proposal.nonAllocableItems;

/** The row with what the KI read; a sure Kategorie (70 % and more) is taken, as on «Neue Rechnung» */
export function withProposal(row: UploadRow, proposal: Proposal): UploadRow {
	const suggested = proposal.categorization;
	const category = suggested && suggested.confidence >= 0.7 ? suggested.category : null;
	const values = valuesOf(row, proposal.fields, category);
	const read = readIn(row, proposal);
	const several = proposal.invoiceCount > 1;
	const notes = notesOn(proposal, row.morePages);
	return {
		...row,
		status: 'check',
		values,
		suggestion: suggested,
		...read,
		notes: notes.filter((note) => !!note) as string[],
		duplicateOf: proposal.duplicateOf,
		several,
		documentType: proposal.documentType,
		deducted: deductedOn(proposal),
		byHand: false,
		notRead: false,
		hints: { deductedAmount: proposal.deductedAmount, nonAllocableItems: proposal.nonAllocableItems },
		selected: preselected(proposal)
	};
}

/** The row to fill in by hand: the KI is not available, or the file cannot be opened to show it to the KI */
export const withoutKi = (row: UploadRow, reason: 'unavailable' | 'unreadable'): UploadRow => ({
	...row,
	status: 'check',
	// without the KI the to-dos say it while fields are missing (#245, persona Helga of #233)
	notes: reason === 'unavailable' ? [] : [m.invoices_upload_unreadable()],
	notRead: reason === 'unavailable',
	byHand: true
});

/** Why a file is still open after creating: the first thing that keeps its invoice from being created (#245) */
export const openReason = (row: UploadRow) => Object.values(checkRow(row))[0] ?? row.createError ?? '';

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
		...suggestionProvenance(row.suggestion),
		beleg: row.hints
	};
}

/** The caution at a field the KI filled without being sure, or left empty because it did not find the value */
export function fieldNote(read: { unsure: string[]; missing: string[] }, field: string) {
	if (read.unsure.includes(field)) return { text: m.invoices_upload_unsure(), testid: `invoice-upload-unsure-${field}` };
	if (read.missing.includes(field))
		return { text: m.invoices_upload_missing(), testid: `invoice-upload-missing-${field}`, quiet: true };
}
