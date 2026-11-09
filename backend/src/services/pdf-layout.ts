/**
 * The statement PDF's data and its page: A4 geometry, fonts, the table's columns and rows, shared by its parts
 */

import type PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import type { QRBillConfig } from './qr-bill.service';
import { formatCHF, formatSwissDate } from './pdf-format';
import type { Segment } from './pdf-segments';
import { de } from './pdf-texts/de';
import { en } from './pdf-texts/en';
import { fr } from './pdf-texts/fr';
import { it } from './pdf-texts/it';
import type { AdvanceLine, InvoicePart, Language, MonthShare } from '../db/schema';

/**
 * Translation strings for each language (the languages SIX provides for the payment part)
 */
export const translations: Record<Language, Record<string, string>> = { de, fr, it, en };

// the invoice's Rechnungsdatum and Rechnungsnummer that name a line (#451), not on statements before
export type Part = InvoicePart & { invoiceDate?: string; invoiceNumber?: string };

/**
 * Statement line item
 */
export interface LineItem {
	category: string;
	key?: string; // the distribution key, in the PDF's language
	keyShare?: string; // the apartment's part by the key: "75.50 / 492.50 m²", or a percentage for a mixed key
	totalAmount: number;
	apartmentShare?: number | null; // the apartment's part of the total by the key; none on older statements
	periodShare?: number | null; // 0-1: days rented, or the heating profile's share
	shareDays?: { days: number; total: number }; // the period share as days, when the statement stored them (#208)
	invoiceParts?: Part[] | null; // the invoices of a position over different days, with their days (#226)
	byProfile?: boolean; // shared by the heating profile, not by days
	heating?: boolean; // a heating cost: the tenant may ask for the detailed heating statement (Art. 8 Abs. 1 VMWG)
	segments?: Segment[] | null; // #1284: its parts before and from the day an apartment no longer exists
	tenantShare: number;
}

/**
 * Full statement data for PDF generation
 */
export interface StatementPDFData {
	id: string;
	statementNumber: string;
	statementDate: string;
	periodStart: string;
	periodEnd: string;
	rentalDays: number;

	// Tenant info
	tenant: {
		firstName: string;
		lastName: string;
		address?: string | null;
		postalCode?: string | null;
		city?: string | null;
		country?: string | null;
	};

	// Apartment info
	apartment: {
		number: string;
		floor: number;
		area: string;
	};

	// Building info
	building: {
		name: string;
		address: string;
		place: string;
	};

	// Cost breakdown
	lineItems: LineItem[];

	// The tenant's part of the period and what the generation run used
	rentalStart: string;
	rentalEnd: string;
	// #133: billed outside Dwello up to this day; the tenancy in the period starts earlier, on `tenancyStart`
	billed?: { until: string; tenancyStart: string };
	periodDays: number; // days of the Abrechnungsperiode, the base of the Mietstage
	// the heating profile and its share; the months of a tenancy over part of the period with their shares
	heating?: {
		profile: string;
		percent: number;
		months?: MonthShare[];
		periodPercent?: number;
		periodMonths?: MonthShare[];
		source?: string | null; // where the monthly shares come from (#465, DMR-10), in the tenant's language; null an own profile
	};
	// A tank: the heating costs of its category are opening stock + invoices – closing stock
	fuel?: { category: string; openingDate: string; opening: number; invoices: number; closingDate: string; closing: number; total: number };

	// Totals
	subtotal: number;
	managementFee: number;
	managementFeePercent: number;
	totalCosts: number;
	totalAdvancePayments: number;
	advanceLines?: AdvanceLine[] | null; // as calculated (#464); absent on a statement created before: the total only
	balance: number; // Positive = tenant owes, negative = refund
	// a berichtigte Abrechnung: the statement it replaces and what was paid on the replaced ones, a refund negative (#120)
	// (#448, Fachreview 448-1 V-2) `offsetWith`: a replaced Saldo the next statement counted as its Übertrag, part of the
	// prior payments
	replaces?: {
		statementNumber: string;
		statementDate: string;
		paidOn: string[];
		priorPayments: number;
		offsetWith?: { statementNumber: string; amount: number }[];
	};
	// #448: the Übertrag counted in from the previous statement of the Mietvertrag (a refund negative); this statement's
	// own Saldo below CHF 5 carried over to the next one; or, sent under #94, neither claimed nor paid out
	carryOver?: { statementNumber: string; amount: number };
	carried?: boolean;
	waived?: boolean;
	notes?: string; // the landlord's remark, printed for the tenant (#448)

	// Payment info
	paymentDeadline?: string;
	paidDate?: string; // paid: no payment part, or the tenant pays twice
	paidSoFar?: number; // #1003: part payments (refunds negative) on a statement still open
	agreedCosts?: { name: string; from?: string }[]; // the agreed categories it bills (#91), «Vereinbart ab» (#368); absent before
}

/** CHF 1'234.56 */
export const formatCurrency = (amount: number) => `CHF ${formatCHF(Math.abs(amount))}`;

export const formatDate = formatSwissDate;

// A4 in points; 20 mm margins left and right, the payment part takes the bottom 105 mm (SIX)
export const PAGE = { width: 595.28, height: 841.89, left: 56.69, right: 538.59, top: 96, bottom: 790 };
export const MM = 72 / 25.4;
export const PAYMENT_PART = 105 * MM;
export const COLORS = { ink: '#111318', muted: '#4b5563', line: '#9ca3af' };

export type Doc = InstanceType<typeof PDFDocument>;

// #465 (CD-8): Liberation Sans (SIL OFL 1.1, assets/fonts/LICENSE.txt), with the metrics of Helvetica, embedded as
// the subset a PDF uses, so every character prints as entered
export const FONT = { regular: 'LiberationSans', bold: 'LiberationSans-Bold' };
const fontFile = (file: string) => fileURLToPath(new URL(`../../assets/fonts/${file}`, import.meta.url));
export function embedFonts(doc: Doc) {
	doc.registerFont(FONT.regular, fontFile('LiberationSans-Regular.ttf'));
	doc.registerFont(FONT.bold, fontFile('LiberationSans-Bold.ttf'));
	return doc.font(FONT.regular);
}
export type Page = { doc: Doc; t: Record<string, string>; data: StatementPDFData; config: QRBillConfig; language: Language };

// Moves to a new page when the next block of this height does not fit; returns where it starts (after a repeated
// table header, if any)
export function room(doc: Doc, y: number, height: number, header?: (y: number) => number) {
	if (y + height <= PAGE.bottom) return y;
	doc.addPage();
	return header ? header(PAGE.top) : PAGE.top;
}

export function heading(doc: Doc, text: string, y: number, keep = 40) {
	const top = room(doc, y, keep);
	doc.font(FONT.bold).fontSize(11).fillColor(COLORS.ink).text(text, PAGE.left, top);
	return doc.y + 6;
}

// Category | key | building's costs | apartment's share | time share | tenant's share
export const COLUMNS = [
	{ x: PAGE.left, width: 112 },
	{ x: PAGE.left + 116, width: 104 },
	{ x: PAGE.left + 224, width: 62, align: 'right' as const },
	{ x: PAGE.left + 290, width: 62, align: 'right' as const },
	{ x: PAGE.left + 356, width: 60, align: 'right' as const },
	{ x: PAGE.left + 420, width: 61.9, align: 'right' as const }
];

export function rule(doc: Doc, y: number, width = 0.5) {
	doc.lineWidth(width).strokeColor(COLORS.line).moveTo(PAGE.left, y).lineTo(PAGE.right, y).stroke();
}

export const rowHeight = (doc: Doc, cells: string[]) => Math.max(...cells.map((cell, i) => doc.heightOfString(cell, { width: COLUMNS[i].width })));

export function row(doc: Doc, cells: string[], y: number, options: { bold?: boolean; header?: (y: number) => number; above?: number } = {}) {
	doc.font(options.bold ? FONT.bold : FONT.regular).fontSize(8.5).fillColor(COLORS.ink);
	const height = rowHeight(doc, cells);
	const top = room(doc, y, height + 6, options.header);
	if (options.above) rule(doc, top - 2, options.above); // the line above a total stays with it
	doc.font(options.bold ? FONT.bold : FONT.regular).fontSize(8.5).fillColor(COLORS.ink);
	cells.forEach((cell, i) => doc.text(cell, COLUMNS[i].x, top, { width: COLUMNS[i].width, align: COLUMNS[i].align }));
	return top + height + 6;
}

export const total = (label: string, amount: string) => [label, '', '', '', '', amount];

// A long label wraps and pushes the next line down
export function amountLine(doc: Doc, label: string, amount: string, y: number, bold = false) {
	doc.font(bold ? FONT.bold : FONT.regular).fontSize(9).fillColor(COLORS.ink);
	doc.text(label, PAGE.left, y, { width: 340 }).text(amount, PAGE.right - 120, y, { width: 120, align: 'right' });
	return y + Math.max(15, doc.heightOfString(label, { width: 340 }) + 4);
}
