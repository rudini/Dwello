/**
 * PDF Generation Service
 * Generates professional utility statement PDFs with Swiss QR-bills
 *
 * Features:
 * - Multi-language support (DE, FR, IT, EN)
 * - Swiss QR-bill integration
 * - Professional formatting
 * - Cost breakdown by category
 */

import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import {
	generateQRBillForStatement,
	formatIBANForDisplay,
	formatQRReferenceForDisplay,
	type QRBillConfig,
	type StatementForQRBill
} from './qr-bill.service';
import { formatCHF, formatSwissDate, roundToRappen } from './pdf-format';
import { CodedError } from './coded-error';
import { countryLine, qrTown } from './postal-address';
import { greetingWords } from './reminder-letter';
import { de } from './pdf-texts/de';
import { en } from './pdf-texts/en';
import { fr } from './pdf-texts/fr';
import { it } from './pdf-texts/it';
import type { AdvanceLine, InvoicePart, Language, MonthShare } from '../db/schema';

/**
 * Supported languages
 */
export type { Language } from '../db/schema';


/**
 * Translation strings for each language (the languages SIX provides for the payment part)
 */
const translations: Record<Language, Record<string, string>> = { de, fr, it, en };

// the invoice's Rechnungsdatum and Rechnungsnummer that name a line (#451), not on statements before
type Part = InvoicePart & { invoiceDate?: string; invoiceNumber?: string };

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
const formatCurrency = (amount: number) => `CHF ${formatCHF(Math.abs(amount))}`;

const formatDate = formatSwissDate;

/** 1234.5 → 1 234.50: the amount in the payment part (SIX: space between thousands) */
const qrAmount = (amount: number) => formatCHF(amount).replace(/'/g, ' ');

/** 0.6694 → 66.94 % (always two places) */
const formatShare = (share: number) => `${(Math.round(share * 10000) / 100).toFixed(2)} %`;

// The floor as tenants write it: ground floor, above, below
// English counts floors with ordinals: 1st, 2nd, 3rd, 4th (461-native-en, EN-32)
const ORDINAL: Record<string, string> = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
const englishFloor = (word: string) => (n: number) =>
	`${n}${ORDINAL[new Intl.PluralRules('en', { type: 'ordinal' }).select(n)]} ${word}`; // below ground too (#449)
// the first floor below ground has no number, from the second on it is counted, as on the screens (#597)
const FLOORS: Record<Language, [string, (n: number) => string, string, (n: number) => string]> = {
	de: ['EG', (n) => `${n}. OG`, 'UG', (n) => `${n}. UG`],
	fr: ['rez-de-chaussée', (n) => (n === 1 ? '1er étage' : `${n}e étage`), 'sous-sol', (n) => (n === 1 ? '1er sous-sol' : `${n}e sous-sol`)],
	it: ['pianterreno', (n) => `${n}° piano`, 'piano interrato', (n) => `${n}° piano interrato`],
	en: ['ground floor', englishFloor('floor'), 'basement', englishFloor('basement')]
};

function formatFloor(floor: number, lang: Language): string {
	const [ground, above, basement, below] = FLOORS[lang];
	return floor === 0 ? ground : floor > 0 ? above(floor) : floor === -1 ? basement : below(-floor);
}

// «EG», «eg» or «EG Links» on the ground floor already name the floor: the PDF does not print it twice (#500);
// spaces and case do not count («1.OG»), a longer word does («EGG»)
const startsWithFloor = (number: string, name: string) =>
	new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s*')}(?=$|[\\s,-])`, 'i').test(number.trim());
// the name of the floor as many levels below ground can start with it («1° piano interrato» on floor 1): a contradiction stays;
// the first floor below ground typed with its count («1. UG») names it too (Fachreview 597-1 V-2)
const counted = (floor: number, lang: Language) => FLOORS[lang][3](Math.abs(floor));
const namedByFloor = (number: string, floor: number, lang: Language) =>
	(startsWithFloor(number, formatFloor(floor, lang)) || (floor === -1 && startsWithFloor(number, counted(floor, lang)))) &&
	!(floor > 0 && startsWithFloor(number, counted(floor, lang)));

const fill = (text: string, values: Record<string, string | number>) =>
	Object.entries(values).reduce((result, [key, value]) => result.split(`{${key}}`).join(String(value)), text);

// The base of the management fee: the subtotal, the tenant's own costs
const feeBasis = (data: StatementPDFData, t: Record<string, string>) =>
	fill(t.feeOwn, { percent: data.managementFeePercent, base: formatCHF(data.subtotal) });

// The time share as the tenant can check it: his days in the days billed (#208); without stored days (a statement
// created before, or a position over different days) the days rented / days of the period where the share is exactly
// that (a contract over the whole period bears every day), else the percentage; the heating profile's share as one
function timeShare(item: LineItem, data: StatementPDFData, t: Record<string, string>) {
	if (item.periodShare == null) return '–';
	if (!item.byProfile && item.shareDays) return fill(t.days, item.shareDays);
	// the invoices under it give the share (#226, C-5); summing to zero they have none (#237)
	if (item.invoiceParts) return item.totalAmount === 0 ? '–' : formatShare(item.periodShare);
	const byDays = !item.byProfile && Math.abs(item.periodShare - data.rentalDays / data.periodDays) < 0.00005;
	return byDays ? fill(t.days, { days: data.rentalDays, total: data.periodDays }) : formatShare(item.periodShare);
}

// A4 in points; 20 mm margins left and right, the payment part takes the bottom 105 mm (SIX)
const PAGE = { width: 595.28, height: 841.89, left: 56.69, right: 538.59, top: 96, bottom: 790 };
const MM = 72 / 25.4;
const PAYMENT_PART = 105 * MM;
const COLORS = { ink: '#111318', muted: '#4b5563', line: '#9ca3af' };

type Doc = InstanceType<typeof PDFDocument>;

// #465 (CD-8): Liberation Sans (SIL OFL 1.1, assets/fonts/LICENSE.txt), with the metrics of Helvetica, embedded as
// the subset a PDF uses, so every character prints as entered
export const FONT = { regular: 'LiberationSans', bold: 'LiberationSans-Bold' };
const fontFile = (file: string) => fileURLToPath(new URL(`../../assets/fonts/${file}`, import.meta.url));
export function embedFonts(doc: Doc) {
	doc.registerFont(FONT.regular, fontFile('LiberationSans-Regular.ttf'));
	doc.registerFont(FONT.bold, fontFile('LiberationSans-Bold.ttf'));
	return doc.font(FONT.regular);
}
type Page = { doc: Doc; t: Record<string, string>; data: StatementPDFData; config: QRBillConfig; language: Language };

// Moves to a new page when the next block of this height does not fit; returns where it starts (after a repeated
// table header, if any)
function room(doc: Doc, y: number, height: number, header?: (y: number) => number) {
	if (y + height <= PAGE.bottom) return y;
	doc.addPage();
	return header ? header(PAGE.top) : PAGE.top;
}

function heading(doc: Doc, text: string, y: number, keep = 40) {
	const top = room(doc, y, keep);
	doc.font(FONT.bold).fontSize(11).fillColor(COLORS.ink).text(text, PAGE.left, top);
	return doc.y + 6;
}

// Recipient in the address field (right window, 45 mm from the top), the property and the apartment on the left
function addresses({ doc, t, data, language }: Page) {
	const top = 45 * MM;
	const tenant = [
		`${data.tenant.firstName} ${data.tenant.lastName}`.trim(),
		data.tenant.address,
		[data.tenant.postalCode, data.tenant.city].filter(Boolean).join(' '),
		countryLine(data.tenant.country)
	].filter(Boolean) as string[];
	doc.font(FONT.regular).fontSize(10).fillColor(COLORS.ink).text(tenant.join('\n'), 118 * MM, top, { width: 82 * MM });
	const floor = formatFloor(data.apartment.floor, language);
	const apartment = [`${t.apartment} ${data.apartment.number}`, !namedByFloor(data.apartment.number, data.apartment.floor, language) && floor, `${data.apartment.area} ${t.sqm}`]
		.filter(Boolean)
		.join(', ');
	doc
		.fontSize(9)
		.font(FONT.bold)
		.text(t.building, PAGE.left, top)
		.font(FONT.regular)
		.text([data.building.name, data.building.address, data.building.place, apartment].filter(Boolean).join('\n'), { width: 82 * MM });
	return Math.max(doc.y, top + 60) + 24;
}

// Title with the period, number and date, the tenant's days in the period
function title({ doc, t, data, config, language }: Page, y: number) {
	// #465 (DIV-14): a letter: place and date, then the title as its subject
	doc.font(FONT.regular).fontSize(10).fillColor(COLORS.ink).text([config.city, formatDate(data.statementDate)].filter(Boolean).join(', '), PAGE.left, y);
	doc
		.moveDown(1.2)
		.font(FONT.bold)
		.fontSize(16)
		.fillColor(COLORS.ink)
		.text(`${t.title} ${formatDate(data.periodStart)} – ${formatDate(data.periodEnd)}`, PAGE.left, doc.y, { width: PAGE.right - PAGE.left });
	doc
		.font(FONT.regular)
		.fontSize(9)
		.fillColor(COLORS.muted)
		.text(`${t.statementNumber} ${data.statementNumber} · ${t.statementDate} ${formatDate(data.statementDate)}`)
		.fillColor(COLORS.ink)
		.moveDown(0.8)
		.fontSize(10)
		.text(`${greetingWords(language).salutation} ${data.tenant.firstName} ${data.tenant.lastName},`.replace(/ +,/, ','))
		.moveDown(0.4)
		.text(fill(t.letterIntro, { start: formatDate(data.periodStart), end: formatDate(data.periodEnd) }))
		.fontSize(9)
		.moveDown(0.4) // its own paragraph, not a continuation of the number (data check 453-1 D-2)
		.text(
			fill(data.billed ? t.tenancyBilledLine : t.tenancyLine, {
				start: formatDate(data.rentalStart),
				end: formatDate(data.rentalEnd),
				days: data.rentalDays,
				total: data.periodDays,
				...(data.billed && { billedUntil: formatDate(data.billed.until), tenancyStart: formatDate(data.billed.tenancyStart) })
			})
		);
	// the tenant still has the replaced statement and its payment part: it no longer applies (Fachreview W2e V-2)
	if (data.replaces) {
		const note = fill(t.replacesNote, { number: data.replaces.statementNumber, date: formatDate(data.replaces.statementDate) });
		const pay = data.balance > 0 && !data.paidDate;
		doc.font(FONT.bold).text(pay ? note + (data.paidSoFar ? t.replacesPayOpen : t.replacesPay) : note).font(FONT.regular);
	}
	return doc.y + 14;
}

// Settled when sent: a Saldo of 0, or one below CHF 5 carried over to the next statement (#448), or sent under #94
// neither claimed nor paid out
function settledText(t: Record<string, string>, data: StatementPDFData) {
	if (data.balance === 0) return rounding(data) ? t.balancedRounded : t.balancedNote;
	// Fachreview 448-1 V-6: the reviewer's wording, without «Der Betrag» twice (product owner 2026-10-19)
	if (data.carried) return data.balance < 0 ? t.carriedRefund : t.carriedDue;
	return data.balance < 0 ? t.waivedRefund : t.waivedDue;
}
const unpaid = (data: StatementPDFData) => data.balance === 0 || data.carried || data.waived;
// what the tenant still pays or gets back: the Saldo less the part payments (#1003), not rounded again to 5 Rappen
const openOf = (data: StatementPDFData) => roundToRappen(data.balance - (data.paidSoFar ?? 0));

// #1003: after a part payment, the rest to pay or to get back; the tenant gave the IBAN for the first part already
function openText(t: Record<string, string>, balance: number, date: string | undefined) {
	if (balance < 0) return date ? fill(t.refundOpenBy, { date }) : t.refundOpenNoDate;
	return date ? fill(t.payOpenBy, { date }) : t.payOpenNoDate;
}

// What the balance asks the tenant to do: pay with the payment part, wait for the refund, or nothing (also the e-mail, #86)
export function balanceText(data: StatementPDFData, language: Language) {
	const t = translations[language];
	const date = data.paymentDeadline && formatDate(data.paymentDeadline);
	if (unpaid(data)) return settledText(t, data);
	if (data.paidDate) return fill(data.balance < 0 ? t.refundPaidOn : t.paidOn, { date: formatDate(data.paidDate) });
	if (data.paidSoFar) return openText(t, data.balance, date);
	if (data.balance < 0) return `${date ? fill(t.refundBy, { date }) : t.refundNoDate} ${t.refundAccount}`;
	return date ? fill(t.payBy, { date }) : t.payNoDate;
}

// The Saldo is rounded to 5 Rappen. Read top to bottom: the amount before rounding, its rounding as «+ 0.02» or
// «– 0.02» (seen from the amount shown, so a refund that grows gets +), the Saldo; only a real rounding is shown
const priorOf = (data: StatementPDFData) => data.replaces?.priorPayments ?? 0;
const carryOf = (data: StatementPDFData) => data.carryOver?.amount ?? 0;
const unrounded = (data: StatementPDFData) => roundToRappen(data.totalCosts - data.totalAdvancePayments - priorOf(data) + carryOf(data));
// Rows from the subtotal to the Saldo, kept on one page
const totalRows = (data: StatementPDFData, t: Record<string, string>) =>
	(rounding(data) ? 6 : 4) + (priorLine(data, t) ? 1 : 0) + (offsetLine(data, t) ? 1 : 0) + (data.carryOver ? 1 : 0) + (data.advanceLines?.length ?? 0);
// «Bereits verrechnet mit NK-…»: the replaced Saldo the next statement counts as its Übertrag (#448)
function offsetLine(data: StatementPDFData, t: Record<string, string>) {
	const offset = offsetOf(data);
	if (!offset) return null;
	const numbers = data.replaces!.offsetWith!.map((o) => o.statementNumber).join(', ');
	return {
		label: fill(t.offsetWith, { numbers }),
		short: `${offset > 0 ? '–' : '+'} ${t.offsetShort} ${formatCurrency(offset)}`,
		amount: `${offset > 0 ? '–' : '+'} ${formatCHF(Math.abs(offset))}`
	};
}
// «Übertrag aus Abrechnung NK-…: CHF 3.00»: a Nachzahlung carried over adds, a refund subtracts (#448)
function carryLine(data: StatementPDFData, t: Record<string, string>) {
	if (!data.carryOver) return null;
	const { statementNumber, amount } = data.carryOver;
	const sign = amount > 0 ? '+' : '–';
	return {
		label: fill(t.carryOver, { number: statementNumber, amount: formatCHF(Math.abs(amount)) }),
		short: `${sign} ${t.carryOverShort} ${formatCurrency(amount)}`,
		amount: `${sign} ${formatCHF(Math.abs(amount))}`
	};
}
const priorRow = (doc: Doc, prior: ReturnType<typeof priorLine>, top: number) => (prior ? row(doc, total(prior.label, prior.amount), top) : top);
// «Bereits bezahlt auf NK-… und NK-…», or what the landlord already refunded
const offsetOf = (data: StatementPDFData) => roundToRappen((data.replaces?.offsetWith ?? []).reduce((sum, o) => sum + o.amount, 0));
function priorLine(data: StatementPDFData, t: Record<string, string>) {
	const prior = roundToRappen(priorOf(data) - offsetOf(data));
	if (!prior) return null;
	const paidOn = data.replaces!.paidOn;
	const numbers = paidOn.length > 1 ? `${paidOn.slice(0, -1).join(', ')} ${t.and} ${paidOn.at(-1)}` : paidOn.join('');
	return {
		label: fill(prior > 0 ? t.priorPaid : t.priorRefunded, { numbers }),
		short: `${prior > 0 ? '–' : '+'} ${prior > 0 ? t.priorPaidShort : t.priorRefundedShort} ${formatCurrency(prior)}`,
		amount: `${prior > 0 ? '–' : '+'} ${formatCHF(Math.abs(prior))}`
	};
}
function rounding(data: StatementPDFData) {
	const difference = roundToRappen(Math.abs(data.balance) - Math.abs(unrounded(data)));
	return Math.abs(data.balance - unrounded(data)) < 0.05 ? difference : 0;
}
const labelOf = (balance: number, t: Record<string, string>) => (balance === 0 ? t.balanced : balance < 0 ? t.refund : t.amountDue);
const signed = (amount: number) => `${amount > 0 ? '+' : '–'} ${formatCHF(Math.abs(amount))}`;

const balanceLabel = ({ t, data }: Page) =>
	data.paidSoFar ? (data.balance < 0 ? t.openRefund : t.openAmount) : labelOf(data.balance, t);
// #1003: «Betrag der Abrechnung … – Bereits bezahlt …»; on a corrected statement its own part (Fachreview 1003-1 V-9)
function paidSoFarText({ t, data }: Page) {
	if (!data.paidSoFar) return '';
	const line = data.balance < 0 ? t.refundedSoFarLine : data.replaces ? t.paidSoFarOwnLine : t.paidSoFarLine;
	return fill(line, { amount: formatCurrency(Math.abs(data.balance)), paid: formatCurrency(Math.abs(data.paidSoFar)) });
}

// The result first: what the tenant pays or gets back, and how it comes about
function balanceBox(page: Page, y: number) {
	const { doc, t, data } = page;
	const width = PAGE.right - PAGE.left;
	const what = [balanceText(page.data, page.language), paidSoFarText(page)].filter(Boolean).join('\n');
	const rounded = rounding(data) ? `, ${t.roundedNote}` : '';
	const prior = priorLine(data, t);
	const offset = offsetLine(data, t);
	const carry = carryLine(data, t);
	const parts = [prior, offset, carry].map((line) => (line ? ` ${line.short}` : '')).join('');
	const how = `${t.yourCosts} ${formatCurrency(data.totalCosts)} – ${t.advancePayments} ${formatCurrency(data.totalAdvancePayments)}${parts}${rounded}`;
	doc.font(FONT.regular).fontSize(9);
	const height = 46 + doc.heightOfString(what, { width: width - 24 }) + doc.heightOfString(how, { width: width - 24 });
	doc.lineWidth(1.5).strokeColor(COLORS.ink).rect(PAGE.left, y, width, height).stroke();
	doc
		.font(FONT.bold)
		.fontSize(13)
		.text(balanceLabel(page), PAGE.left + 12, y + 12)
		.text(formatCurrency(data.paidSoFar ? Math.abs(openOf(data)) : data.balance), PAGE.left + 12, y + 12, { width: width - 24, align: 'right' });
	doc
		.font(FONT.regular)
		.fontSize(9)
		.text(what, PAGE.left + 12, y + 34, { width: width - 24 })
		.fillColor(COLORS.muted)
		.text(how, { width: width - 24 })
		.fillColor(COLORS.ink);
	return y + height + 20;
}

// Category | key | building's costs | apartment's share | time share | tenant's share
const COLUMNS = [
	{ x: PAGE.left, width: 112 },
	{ x: PAGE.left + 116, width: 104 },
	{ x: PAGE.left + 224, width: 62, align: 'right' as const },
	{ x: PAGE.left + 290, width: 62, align: 'right' as const },
	{ x: PAGE.left + 356, width: 60, align: 'right' as const },
	{ x: PAGE.left + 420, width: 61.9, align: 'right' as const }
];

function rule(doc: Doc, y: number, width = 0.5) {
	doc.lineWidth(width).strokeColor(COLORS.line).moveTo(PAGE.left, y).lineTo(PAGE.right, y).stroke();
}

const rowHeight = (doc: Doc, cells: string[]) => Math.max(...cells.map((cell, i) => doc.heightOfString(cell, { width: COLUMNS[i].width })));

function row(doc: Doc, cells: string[], y: number, options: { bold?: boolean; header?: (y: number) => number; above?: number } = {}) {
	doc.font(options.bold ? FONT.bold : FONT.regular).fontSize(8.5).fillColor(COLORS.ink);
	const height = rowHeight(doc, cells);
	const top = room(doc, y, height + 6, options.header);
	if (options.above) rule(doc, top - 2, options.above); // the line above a total stays with it
	doc.font(options.bold ? FONT.bold : FONT.regular).fontSize(8.5).fillColor(COLORS.ink);
	cells.forEach((cell, i) => doc.text(cell, COLUMNS[i].x, top, { width: COLUMNS[i].width, align: COLUMNS[i].align }));
	return top + height + 6;
}

function tableHeader({ doc, t }: Page, y: number) {
	doc.font(FONT.bold).fontSize(7.5).fillColor(COLORS.muted);
	const labels = [t.category, t.keyColumn, t.totalAmount, t.apartmentShareColumn, t.timeShareColumn, t.yourShare];
	labels.forEach((label, i) => doc.text(label, COLUMNS[i].x, y, { width: COLUMNS[i].width, align: COLUMNS[i].align }));
	const bottom = y + Math.max(...labels.map((label, i) => doc.heightOfString(label, { width: COLUMNS[i].width }))) + 4;
	rule(doc, bottom);
	return bottom + 6;
}

const total = (label: string, amount: string) => [label, '', '', '', '', amount];

// One line per category: how the building's costs come to the tenant
function costTable(page: Page, y: number) {
	const { doc, t, data } = page;
	const header = (at: number) => tableHeader(page, at);
	// Subtotal to balance and the explanation stay on one page: the balance alone on the next page lost its derivation
	const width = COLUMNS[4].x + COLUMNS[4].width - PAGE.left;
	const fee = `${t.managementFee}${t.colon}${feeBasis(data, t)}`;
	doc.font(FONT.bold).fontSize(8.5);
	const feeHeight = data.managementFee > 0 ? doc.heightOfString(fee, { width }) + 6 : 0;
	const totals = totalRows(data, t) * (doc.heightOfString(t.subtotal) + 8) + feeHeight;
	const note = sharesNote(data, t);
	const closing = totals + 4 + doc.font(FONT.regular).fontSize(7.5).heightOfString(note, { width: PAGE.right - PAGE.left });
	const rows = data.lineItems.map((item) => {
		const key = [item.key ?? '–', item.keyShare].filter(Boolean).join('\n');
		const share = item.apartmentShare == null ? '–' : formatCHF(item.apartmentShare);
		return { cells: [item.category, key, formatCHF(item.totalAmount), share, timeShare(item, data, t), formatCHF(item.tenantShare)], parts: partLines(item, t) };
	});
	// a single position is also the last: the heading and the table header go with it and the totals (#685, C-1)
	const alone = rows.length === 1 ? positionHeight(doc, rows[0].cells, rows[0].parts) + closing : 0;
	let top = header(room(doc, heading(doc, `${t.costBreakdown} (CHF)`, y, 90 + alone), 60));
	rows.forEach(({ cells, parts }, i) => {
		// the invoices stay on the page of their position (#226); the last position goes with the totals (#685)
		const last = i === rows.length - 1;
		if (parts.length || last) top = room(doc, top, positionHeight(doc, cells, parts) + (last ? closing : 0), header);
		top = row(doc, cells, top, { header });
		top = partsBelow(doc, parts, top);
	});
	top = row(doc, total(t.subtotal, formatCHF(data.subtotal)), room(doc, top, closing) + 2, { bold: true, above: 0.5 });
	if (feeHeight) {
		doc.font(FONT.regular).fontSize(8.5);
		doc.text(fee, PAGE.left, top, { width });
		doc.text(formatCHF(data.managementFee), COLUMNS[5].x, top, { width: COLUMNS[5].width, align: 'right' });
		top += feeHeight;
	}
	top = row(doc, total(t.yourCosts, formatCHF(data.totalCosts)), top + 2, { bold: true, above: 1 });
	top = row(doc, total(t.advancePayments, `– ${formatCHF(data.totalAdvancePayments)}`), top);
	top = advanceRows(doc, data.advanceLines ?? [], t, top);
	top = priorRow(doc, priorLine(data, t), top);
	top = priorRow(doc, offsetLine(data, t), top);
	top = priorRow(doc, carryLine(data, t), top);
	if (rounding(data)) {
		const before = `${labelOf(unrounded(data), t)} ${t.beforeRounding}`;
		top = row(doc, total(before, formatCHF(Math.abs(unrounded(data)))), top + 2, { above: 1 });
		top = row(doc, total(t.rounding, signed(rounding(data))), top);
	}
	top = row(doc, total(labelOf(data.balance, page.t), formatCHF(Math.abs(data.balance))), top + 2, { bold: true, above: 1 }); // the Saldo, also after a part payment (#1003)
	doc.font(FONT.regular).fontSize(7.5).fillColor(COLORS.muted).text(note, PAGE.left, top + 4, { width: PAGE.right - PAGE.left });
	return doc.y + 18;
}

// The invoices of a position over different days and the sum that weighs them by amount (#226): the tenant recomputes
// the Zeitanteil, and «Ihr Anteil» as Wohnungsanteil × that sum; invoices summing to zero by the apartment's share by
// the key (#237). A negative amount stands with a minus, not «+ -300.00» (#257)
function partLines(item: LineItem, t: Record<string, string>) {
	const parts = item.invoiceParts;
	if (!parts || item.apartmentShare == null) return [];
	// a line without a Leistungszeitraum begins with its invoice; one the same as another's gets it in front (V-8)
	const texts = parts.map((part) => partLine(part, t, t.partNameNone));
	const lines = texts.map((line, i) => {
		const name = nameOf(parts[i], texts.filter((text) => text === line).length, t);
		if (parts[i].noPeriod) return name ? partLine(parts[i], t, name) : line;
		const lead = t.partNamedLower ? line[0].toLowerCase() + line.slice(1) : line;
		return name ? fill(t.partNamed, { line: lead, name }) : line;
	});
	const factor = (part: InvoicePart) => (part.profile ? `${part.profile.percent.toFixed(2)}\u00a0%` : `${part.days}/${part.total}`);
	const term = (part: InvoicePart) => `${formatCHF(Math.abs(part.amount))} × ${factor(part)}`;
	const sum = parts.map((part, i) => (i === 0 ? (part.amount < 0 ? '– ' : '') : part.amount < 0 ? ' – ' : ' + ') + term(part)).join('');
	const share = { apartment: formatCHF(item.apartmentShare), sum, costs: formatCHF(item.totalAmount), share: formatCHF(item.tenantShare), colon: t.colon };
	if (item.totalAmount !== 0) return [...lines, fill(t.partShare, share)];
	return [...lines, fill(t.partShareZero, { ...share, keyShare: keyFactor(item, parts) })];
}

// The apartment's part by the key as printed with the key (a mixed key in brackets), else as a percentage of the sum
function keyFactor(item: LineItem, parts: InvoicePart[]) {
	if (item.keyShare) return item.keyShare.includes('+') ? `(${item.keyShare.replace(/\n/g, ' ')})` : item.keyShare;
	const rented = parts.reduce((sum, part) => sum + part.amount * (part.profile ? part.profile.percent / 100 : part.days / part.total), 0);
	return formatShare(rented ? item.tenantShare / rented : 0);
}

// A heating invoice by the Heizprofil (#71): its dates and amount as any invoice line, then instead of the days the
// months in its days and the tenant's months, with the division; without a Leistungszeitraum the run's share
function partLine(part: InvoicePart, t: Record<string, string>, name: string) {
	const text = t[partText(part)];
	if (!part.profile) return fill(text, { ...partValues(part, t.colon), name });
	const { percent, months, periodMonths } = part.profile;
	const head = text.slice(0, text.indexOf('{amount}') + '{amount}'.length);
	return fill(head + (part.noPeriod ? t.partProfileRun : t.partProfile), {
		...partValues(part, t.colon),
		name,
		percent: percent.toFixed(2),
		months: months.length ? monthList(months, t) : t.partProfileNone,
		tenant: monthSum(months),
		periodMonths: monthList(periodMonths, t),
		period: monthSum(periodMonths)
	});
}

// no line break inside one month («Jun 3.70 %»); the sum of the printed months (#229)
// a month split by a move-in or move-out with its fraction, «Jan 15.68 % (18.00 % × 27/31 Tage)» (#451, point 3)
const monthList = (shares: MonthShare[], t: Record<string, string>) =>
	shares
		.map((m) => {
			const month = t.months.split(',')[m.month - 1];
			if (m.full == null) return `${month}\u00a0${m.percentage.toFixed(2)}\u00a0%`;
			return fill(t.monthSplit, { month, percent: m.percentage.toFixed(2), full: m.full.toFixed(2), days: m.days!, total: m.total! });
		})
		.join(', ');
const monthSum = (shares: { month: number; percentage: number }[]) =>
	(shares.reduce((total, m) => total + Math.round(m.percentage * 100), 0) / 100).toFixed(2);
// a heating position with invoices by their own days (the Heizprofil's months in them, or days): the run's share is not theirs (#71)
const ownProfileDays = (data: StatementPDFData) => data.lineItems.some((item) => item.byProfile && item.invoiceParts);
// every heating position by the profile has its invoices with their own Leistungszeitraum: the run's share bills none (#509)
const noRunShare = (data: StatementPDFData) =>
	data.lineItems.filter((item) => item.byProfile).every((item) => item.invoiceParts && !item.invoiceParts.some((part) => part.noPeriod));

// An invoice line says what its dates are: the Leistungszeitraum, the part of one beyond the period, or none (#241);
// the change of the Tankbestand is no invoice and says so (#239)
const partText = (part: InvoicePart) =>
	part.fuelStock ? 'partStock' : part.noPeriod ? 'partNoPeriod' : part.whole ? 'partBeyond' : 'partLine';
// A line names its invoice where dates and amount match no single receipt: without a Leistungszeitraum (its dates are
// the period's) or the same as another line's (#236), by Rechnungsdatum and Rechnungsnummer as on the receipt (#451);
// the Tankbestand, once per position, never is
const nameOf = (part: Part, same: number, t: Record<string, string>) => {
	if (!part.invoiceDate || !(part.noPeriod || same > 1)) return undefined;
	const date = formatDate(part.invoiceDate);
	return part.invoiceNumber ? fill(t.partNameNumber, { date, number: part.invoiceNumber }) : fill(t.partName, { date });
};
const dayCount = (start: string, end: string) => Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000) + 1;
const partValues = ({ start, end, amount, days, total, whole }: InvoicePart, colon: string) => ({
	start: formatDate(start),
	end: formatDate(end),
	amount: formatCHF(amount),
	days,
	total,
	colon,
	...(whole && { wholeStart: formatDate(whole.start), wholeEnd: formatDate(whole.end), wholeAmount: formatCHF(whole.amount), wholeDays: dayCount(whole.start, whole.end) })
});

const PARTS_WIDTH = COLUMNS[4].x + COLUMNS[4].width - COLUMNS[0].x - 8;

function positionHeight(doc: Doc, cells: string[], lines: string[]) {
	doc.font(FONT.regular).fontSize(8.5);
	const height = rowHeight(doc, cells) + 6;
	return lines.length ? height + doc.fontSize(7.5).heightOfString(lines.join('\n'), { width: PARTS_WIDTH }) + 3 : height;
}

// #464: one indented line per Akonto amount and split month, its amount in the column «Ihr Anteil»; they add up to the
// total above
function advanceRows(doc: Doc, lines: AdvanceLine[], t: Record<string, string>, y: number) {
	let top = y - 3;
	for (const line of lines) {
		const values = { amount: formatCHF(line.amount), from: formatDate(line.from), to: formatDate(line.to) };
		const text =
			'days' in line
				? fill(t.advanceDays, { ...values, days: String(line.days), daysInMonth: String(line.daysInMonth) })
				: fill(line.months === 1 ? t.advanceMonth : t.advanceMonths, { ...values, n: String(line.months) });
		doc.font(FONT.regular).fontSize(7.5).fillColor(COLORS.muted);
		doc.text(text, COLUMNS[0].x + 8, top, { width: PARTS_WIDTH });
		doc.text(formatCHF(line.total), COLUMNS[5].x, top, { width: COLUMNS[5].width, align: 'right' });
		top += doc.heightOfString(text, { width: PARTS_WIDTH }) + 3;
	}
	return lines.length ? top + 6 : y;
}

function partsBelow(doc: Doc, lines: string[], y: number) {
	if (!lines.length) return y;
	doc.font(FONT.regular).fontSize(7.5).fillColor(COLORS.muted);
	const text = lines.join('\n');
	doc.text(text, COLUMNS[0].x + 8, y - 3, { width: PARTS_WIDTH });
	return y - 3 + doc.heightOfString(text, { width: PARTS_WIDTH }) + 6;
}

// How the shares are reached; the heating clause only where a line is shared by the profile, not by days (#137)
function sharesNote(data: StatementPDFData, t: Record<string, string>) {
	// a fraction over other days than the period's: the days a Leistungszeitraum bills in it (#208), also in the lines
	// of invoices over different days, weighted by amount (#226)
	const parts = data.lineItems.some((item) => item.invoiceParts);
	const otherDays = parts || data.lineItems.some((item) => !item.byProfile && item.shareDays && item.shareDays.total !== data.periodDays);
	const byProfile = data.lineItems.some((item) => item.byProfile);
	const shares = fill(t.sharesNote, {
		days: otherDays ? t.sharesNoteDays : '',
		parts: parts ? t.sharesNoteParts : '',
		rounded: roundedNote(data, t, parts, byProfile),
		heating: byProfile ? (ownProfileDays(data) ? t.sharesNoteHeatingParts : t.sharesNoteHeating) : ''
	});
	// «Vereinbart ab» (#368, Fachreview 368-B M-1): those days are not the Mietstage of the header
	const from = data.agreedCosts?.some((cost) => cost.from) ? t.sharesNoteAgreedFrom : '';
	return data.fuel ? `${shares}${from} ${t.sharesNoteFuel}` : shares + from;
}

// The rounded percentage, also of a share by the Heizprofil (#256); a credit over other days than an invoice of its
// position gives a Zeitanteil above 100 % or below 0 % (#237)
function roundedNote(data: StatementPDFData, t: Record<string, string>, parts: boolean, byProfile: boolean) {
	const shares = data.lineItems.filter((item) => item.invoiceParts && item.totalAmount !== 0).map((item) => item.periodShare ?? 0);
	const rounded = parts ? t.sharesNoteRounded : byProfile ? t.sharesNoteRoundedHeating : '';
	return rounded + (shares.some((share) => share > 1) ? t.sharesNoteAbove : '') + (shares.some((share) => share < 0) ? t.sharesNoteBelow : '');
}

// A long label wraps and pushes the next line down
function amountLine(doc: Doc, label: string, amount: string, y: number, bold = false) {
	doc.font(bold ? FONT.bold : FONT.regular).fontSize(9).fillColor(COLORS.ink);
	doc.text(label, PAGE.left, y, { width: 340 }).text(amount, PAGE.right - 120, y, { width: 120, align: 'right' });
	return y + Math.max(15, doc.heightOfString(label, { width: 340 }) + 4);
}

// the run's share; only for invoices without a Leistungszeitraum where a position has invoices with their own (#71),
// none where every position counts its invoices' own months (#509)
const heatingNoteKey = (data: StatementPDFData) =>
	!ownProfileDays(data) ? 'heatingNote' : noRunShare(data) ? 'heatingNoteOwn' : 'heatingNoteParts';

// The heating profile's share, with the months of a tenancy over part of the period
function heatingLines({ t, data }: Page) {
	if (!data.heating) return [];
	const key = heatingNoteKey(data);
	const { profile, percent, months } = data.heating;
	const shown = (Math.round(percent * 100) / 100).toFixed(2);
	const note = fill(t[key], { profile, percent: shown });
	const source = data.heating.source !== undefined ? [fill(t.heatingSource, { source: data.heating.source ?? t.heatingSourceOwn })] : [];
	if (key === 'heatingNoteOwn' || !months?.length || percent >= 100) return [note, ...source];
	return [note, fill(t.heatingMonths, { months: monthList(months, t) }) + periodSums(data.heating, shown, t), ...source];
}

// a period whose months do not carry 100 % (under a year): both sums, from the printed months (#229); since #232 the
// period's months and the division the share comes from
function periodSums({ months, periodPercent, periodMonths }: NonNullable<StatementPDFData['heating']>, shown: string, t: Record<string, string>) {
	if (periodPercent == null || periodPercent === 100) return '';
	const [tenant, period] = [monthSum(months!), periodPercent.toFixed(2)];
	return periodMonths
		? fill(t.heatingPeriodMonths, { tenant, months: monthList(periodMonths, t), period, percent: shown })
		: fill(t.heatingPeriodSums, { tenant, period });
}

// Heating profile, and for a tank the consumption: opening stock + invoices – closing stock (Art. 5 VMWG); kept on
// one page
function heatingSection(page: Page, y: number) {
	const { doc, t, data } = page;
	if (!data.heating && !data.fuel) return y;
	const lines = heatingLines(page);
	const fuel = data.fuel;
	const amounts: [string, number][] = fuel
		? [
				[fill(t.fuelOpening, { date: formatDate(fuel.openingDate) }), fuel.opening],
				[fill(t.fuelInvoices, { category: fuel.category }), fuel.invoices],
				[fill(t.fuelClosing, { date: formatDate(fuel.closingDate) }), fuel.closing],
				[t.fuelTotal, fuel.total]
			]
		: [];
	const width = PAGE.right - PAGE.left;
	doc.font(FONT.regular).fontSize(9);
	const height =
		[...lines, fuel ? t.fuelIntro : ''].reduce((sum, line) => sum + doc.heightOfString(line, { width }) + 8, 0) +
		amounts.reduce((sum, [label]) => sum + Math.max(15, doc.heightOfString(label, { width: 340 }) + 4), 0);
	let top = heading(doc, t.heatingSection, y, height + 30);
	for (const line of lines) {
		doc.font(FONT.regular).fontSize(9).fillColor(COLORS.ink).text(line, PAGE.left, top, { width });
		top = doc.y + 8;
	}
	if (!fuel) return top + 10;
	doc.text(t.fuelIntro, PAGE.left, top, { width });
	top = doc.y + 6;
	amounts.forEach(([label, amount], i) => (top = amountLine(doc, label, formatCurrency(amount), top, i === amounts.length - 1)));
	return top + 12;
}

// The landlord as entered: the address (street) is optional (Fachreview #450 V-2), «PLZ Ort» only whole (Dr. Weber P-1)
const senderParts = (config: QRBillConfig) =>
	[config.companyName, config.address, config.postalCode && config.city && `${config.postalCode} ${config.city}`].filter(Boolean);

// The letterhead: the landlord, then phone and e-mail where entered (#465, DMR-09)
const letterhead = (config: QRBillConfig, t: Record<string, string>) =>
	[...senderParts(config), config.phone && fill(t.letterPhone, { phone: config.phone }), config.email].filter(Boolean) as string[];

// What the tenant may ask for: the receipts (Art. 257b Abs. 2 OR), the detailed heating statement and the stock
// (Art. 8 VMWG); kept on one page
function notes({ doc, t, data, config, language }: Page, y: number) {
	const contact = senderParts(config).join(', ');
	const names = data.agreedCosts?.map(({ name, from }) => (from ? fill(t.agreedFromItem, { category: name, date: formatDate(from) }) : name));
	const agreed = names?.length ? [fill(t.agreedCosts, { categories: names.join(', ') })] : [];
	// #511 (Persona Dr. Weber 461 P-2, Fachreview 511-1 V-1): a fee billed is agreed, as the line on page 1 shows it
	if (data.managementFee > 0) agreed.push(t.managementFeeAgreed);
	const advance = data.totalAdvancePayments > 0 ? [t.noteAdvance] : [];
	const lines = [...(data.notes ? [data.notes] : []), ...agreed, ...advance, fill(t.noteReceipts, { contact }), ...(data.fuel || data.lineItems.some((item) => item.heating) ? [t.noteHeating] : []), ...(data.fuel ? [t.noteStock] : [])];
	const width = PAGE.right - PAGE.left;
	doc.font(FONT.regular).fontSize(9);
	const closing = [greetingWords(language).closing, config.companyName].filter(Boolean).join('\n');
	const height = [...lines, closing].reduce((sum, line) => sum + doc.heightOfString(line, { width }) + 6, 0) + 10;
	let top = heading(doc, t.notes, y, height + 30);
	for (const line of lines) {
		doc.font(FONT.regular).fontSize(9).fillColor(COLORS.ink).text(line, PAGE.left, top, { width });
		top = doc.y + 6;
	}
	// #465 (DIV-14): the greeting after the notes, so they belong to the letter; the payment part stays last
	doc.fontSize(10).text(closing, PAGE.left, top + 10, { width });
	return doc.y + 6;
}

type QRResult = Awaited<ReturnType<typeof generateQRBillForStatement>>;

// The blocks of the payment part, each heading with its lines; a long line wraps and pushes the next down
// (sizes: receipt 6/8 pt, payment part 8/10 pt)
function qrBlocks(doc: Doc, blocks: [string, (string | null | undefined)[]][], x: number, y: number, sizes: [number, number], width: number) {
	let top = y;
	for (const [label, lines] of blocks) {
		const printed = lines.filter(Boolean) as string[];
		if (printed.length === 0) continue;
		doc.font(FONT.bold).fontSize(sizes[0]).text(label, x, top, { width });
		top = doc.y + 1;
		doc.font(FONT.regular).fontSize(sizes[1]);
		for (const line of printed) {
			doc.text(line, x, top, { width });
			top = doc.y + 0.5;
		}
		top += sizes[1] * 0.6;
	}
	return top;
}

// SIX: without a debtor in the QR code, «Zahlbar durch (Name/Adresse)» over a blank field with corner marks
// (3 mm, 0.75 pt) for the payer to write in; it ends above `limit` when long details above it leave less room
function blankField(doc: Doc, label: string, x: number, y: number, size: number, [width, height]: [number, number], limit = Infinity) {
	doc.font(FONT.bold).fontSize(size).text(label, x, y, { width });
	const [top, right, mark] = [doc.y + 1, x + width, 3 * MM];
	const bottom = Math.min(top + height, limit);
	doc.lineWidth(0.75).strokeColor(COLORS.ink)
		.moveTo(x, top + mark).lineTo(x, top).lineTo(x + mark, top)
		.moveTo(right - mark, top).lineTo(right, top).lineTo(right, top + mark)
		.moveTo(right, bottom - mark).lineTo(right, bottom).lineTo(right - mark, bottom)
		.moveTo(x + mark, bottom).lineTo(x, bottom).lineTo(x, bottom - mark)
		.stroke();
}

function swissCross(doc: Doc, x: number, y: number) {
	const size = 7 * MM;
	const bar = size * 0.6;
	const thick = size * 0.19;
	doc.rect(x, y, size, size).fillColor('white').fill();
	doc.rect(x + size * 0.05, y + size * 0.05, size * 0.9, size * 0.9).fillColor('black').fill();
	doc.rect(x + (size - bar) / 2, y + (size - thick) / 2, bar, thick).fillColor('white').fill();
	doc.rect(x + (size - thick) / 2, y + (size - bar) / 2, thick, bar).fillColor('white').fill();
	doc.fillColor(COLORS.ink);
}

// Swiss QR-bill (SIX): receipt 62 mm and payment part 148 mm across the bottom 105 mm of the page; the printed
// details are those in the QR code
function paymentPart(
	{ doc, t, config }: Pick<Page, 'doc' | 't' | 'config'>,
	qr: QRResult,
	balance: number
) {
	const top = PAGE.height - PAYMENT_PART;
	const receiptWidth = 62 * MM;
	doc.page.margins.bottom = 0; // printing down to the edge, or pdfkit breaks each line onto a new page
	doc.font(FONT.regular).fontSize(7).fillColor(COLORS.ink).text(t.separate, 0, top - 12, { width: PAGE.width, align: 'center' });
	doc.lineWidth(0.5).strokeColor(COLORS.ink).dash(3, { space: 2 });
	doc.moveTo(0, top).lineTo(PAGE.width, top).stroke();
	doc.moveTo(receiptWidth, top).lineTo(receiptWidth, PAGE.height).stroke().undash();

	const { qrData } = qr;
	const creditor = [formatIBANForDisplay(config.iban), qrData.creditorName, qrData.creditorStreet, `${qrData.creditorPostalCode} ${qrData.creditorCity}`];
	// the QR code names the debtor only with name, postal code and town
	const debtor = qrData.debtorPostalCode && qrData.debtorCity ? [qrData.debtorName, qrData.debtorStreet, qrTown(qrData.debtorPostalCode, qrData.debtorCity, qrData.debtorCountry)] : [];
	const reference = qr.reference ? [formatQRReferenceForDisplay(qr.reference)] : [];
	const amount = qrAmount(balance);

	// Receipt
	const left = 5 * MM;
	doc.font(FONT.bold).fontSize(11).fillColor(COLORS.ink).text(t.receiptSection, left, top + 5 * MM, { lineBreak: false });
	const receiptEnd = qrBlocks(doc, [[`${t.account} / ${t.payableTo}`, creditor], [t.reference, reference], [t.payableBy, debtor]], left, top + 12 * MM, [6, 8], 52 * MM);
	if (debtor.length === 0) blankField(doc, t.payableByName, left, receiptEnd, 6, [52 * MM, 20 * MM], top + 66 * MM);
	doc.font(FONT.bold).fontSize(6).text(t.currency, left, top + 68 * MM).text(t.amount, left + 12 * MM, top + 68 * MM);
	doc.font(FONT.regular).fontSize(8).text('CHF', left, top + 71 * MM).text(amount, left + 12 * MM, top + 71 * MM, { lineBreak: false });
	doc.font(FONT.bold).fontSize(6).text(t.acceptancePoint, left, top + 82 * MM, { width: 52 * MM, align: 'right' });

	// Payment part: title, QR code with the Swiss cross, amount; the details on the right
	const x = receiptWidth + 5 * MM;
	doc.font(FONT.bold).fontSize(11).text(t.qrBillSection, x, top + 5 * MM, { lineBreak: false });
	doc.image(qr.qrCodeImage, x, top + 17 * MM, { width: 46 * MM, height: 46 * MM });
	swissCross(doc, x + 19.5 * MM, top + 36.5 * MM);
	doc.font(FONT.bold).fontSize(8).text(t.currency, x, top + 68 * MM).text(t.amount, x + 14 * MM, top + 68 * MM);
	doc.font(FONT.regular).fontSize(10).text('CHF', x, top + 72 * MM).text(amount, x + 14 * MM, top + 72 * MM, { lineBreak: false });
	const details: [string, (string | null | undefined)[]][] = [
		[`${t.account} / ${t.payableTo}`, creditor],
		[t.reference, reference],
		[t.additionalInfo, [qrData.unstructuredMessage]],
		[t.payableBy, debtor]
	];
	const detailsEnd = qrBlocks(doc, details, receiptWidth + 56 * MM, top + 5 * MM, [8, 10], 87 * MM);
	if (debtor.length === 0) blankField(doc, t.payableByName, receiptWidth + 56 * MM, detailsEnd, 8, [65 * MM, 25 * MM]);
}

/**
 * The QR-bill of a statement's open Saldo at the foot of the letter's page, e.g. a reminder (#108): the statement's
 * reference and message, labels in the tenant's language; a new page when the letter reaches into it
 */
export async function addPaymentPart(
	doc: Doc,
	statement: Omit<StatementForQRBill, 'title'>,
	config: QRBillConfig,
	language: Language
) {
	const t = { ...translations.de, ...translations[language] };
	const qr = await generateQRBillForStatement({ ...statement, title: t.title }, config);
	if (doc.y > PAGE.height - PAYMENT_PART - 16) doc.addPage(); // above the line and «Vor der Einzahlung abzutrennen»
	paymentPart({ doc, t, config }, qr, Number(statement.balance));
}

// Without a QR code (it could not be made): the account to pay to
function paymentInfo({ doc, t, data, config }: Page, y: number) {
	let top = heading(doc, t.paymentInfo, y);
	top = amountLine(doc, t.account, formatIBANForDisplay(config.iban), top);
	return amountLine(doc, t.amount, formatCurrency(openOf(data)), top);
}

// Sender and page on every page; the property and period at the foot of pages without the payment part
function frame({ doc, t, data, config }: Page, qrPage: number | null) {
	const { start, count } = doc.bufferedPageRange();
	for (let i = start; i < start + count; i++) {
		doc.switchToPage(i);
		doc.page.margins.bottom = 0;
		doc.font(FONT.regular).fontSize(8).fillColor(COLORS.muted);
		// #465 (Fachreview 465-1 V-2): page 1 a letterhead, a line each, with phone and e-mail; later pages one line
		const head = i === start ? letterhead(config, t).join('\n') : senderParts(config).join(' · ');
		doc.text(head, PAGE.left, 40, { width: 290, ...(i !== start && { height: 10, ellipsis: true, lineBreak: false }) });
		const rule = Math.max(54, doc.y + 4);
		doc.text(`${data.statementNumber} · ${fill(t.pageOf, { page: i + 1, pages: count })}`, PAGE.right - 180, 40, { width: 180, align: 'right' });
		doc.lineWidth(0.5).strokeColor(COLORS.line).moveTo(PAGE.left, rule).lineTo(PAGE.right, rule).stroke();
		if (i === qrPage) continue;
		doc.text(`${data.building.name} · ${t.period} ${formatDate(data.periodStart)} – ${formatDate(data.periodEnd)}`, PAGE.left, PAGE.height - 40, {
			width: PAGE.right - PAGE.left,
			lineBreak: false
		});
	}
}

// Only an amount still due gets a payment part: not a refund, not a Saldo carried over (#448) or waived (#94), not a
// statement already paid
const owed = (data: StatementPDFData) => data.balance > 0 && !unpaid(data) && !data.paidDate;
async function qrCodeFor(data: StatementPDFData, config: QRBillConfig, t: Record<string, string>): Promise<QRResult | null> {
	if (!owed(data)) return null;
	try {
		return await generateQRBillForStatement(
			{ id: data.id, statementNumber: data.statementNumber, balance: openOf(data).toString(), tenant: data.tenant, title: t.title },
			config
		);
	} catch (qrError) {
		if (qrError instanceof CodedError) throw qrError; // an invalid IBAN: no PDF without its payment part
		console.error('Failed to generate QR code:', qrError);
		return null;
	}
}

// #453 (#325): with «Abgerechnet bis» in the period the Akonto and the tenant's months are those from the day after
const billedTexts = (t: Record<string, string>, data: StatementPDFData) =>
	data.billed
		? {
				...t,
				advancePayments: fill(t.advancePaymentsFrom, { date: formatDate(data.rentalStart) }),
				heatingMonths: t.heatingMonthsBilled,
				partProfile: t.partProfileBilled
			}
		: t;

/**
 * Generate utility statement PDF: A4, header and footer on every page, the balance first, then how each cost is
 * shared, the heating costs and the tenant's rights; the QR-bill at the bottom of the last page for an amount due
 */
async function generateStatementPDF(data: StatementPDFData, config: QRBillConfig, language: Language = 'de'): Promise<Buffer> {
	const t = billedTexts({ ...translations.de, ...translations[language] }, data);
	const qr = await qrCodeFor(data, config, t);

	return new Promise((resolve, reject) => {
		try {
			const doc = embedFonts(
				new PDFDocument({
					size: 'A4',
					bufferPages: true,
					margins: { top: PAGE.top, bottom: PAGE.height - PAGE.bottom, left: PAGE.left, right: PAGE.width - PAGE.right },
					info: { Title: `${t.title} ${data.statementNumber}` }
				})
			);
			const chunks: Buffer[] = [];
			doc.on('data', (chunk: Buffer) => chunks.push(chunk));
			doc.on('end', () => resolve(Buffer.concat(chunks)));
			doc.on('error', reject);

			const page: Page = { doc, t, data, config, language };
			let y = title(page, addresses(page));
			y = balanceBox(page, y);
			y = costTable(page, y);
			y = heatingSection(page, y);
			y = notes(page, y);
			let qrPage: number | null = null;
			if (qr) {
				if (y > PAGE.height - PAYMENT_PART - 24) doc.addPage();
				qrPage = doc.bufferedPageRange().count - 1;
				paymentPart(page, qr, openOf(data));
			} else if (owed(data)) {
				paymentInfo(page, y);
			}
			frame(page, qrPage);
			doc.end();
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Generate PDF and return as Base64 string
 */
export async function generateStatementPDFBase64(
	data: StatementPDFData,
	config: QRBillConfig,
	language: Language = 'de'
): Promise<string> {
	const pdfBuffer = await generateStatementPDF(data, config, language);
	return pdfBuffer.toString('base64');
}
