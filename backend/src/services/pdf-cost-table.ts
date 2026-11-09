/**
 * The statement PDF's cost table: one line per category, the invoices under a position, the totals to the Saldo and how
 * the shares are reached
 */

import { fill, formatCHF } from './pdf-format';
import { segmentLine } from './pdf-segments';
import { carryLine, labelOf, offsetLine, priorLine, priorRow, rounding, signed, totalRows, unrounded } from './pdf-balance';
import { COLORS, COLUMNS, FONT, PAGE, formatDate, heading, room, row, rowHeight, rule, total, type Doc, type LineItem, type Page, type Part, type StatementPDFData } from './pdf-layout';
import type { AdvanceLine, InvoicePart, MonthShare } from '../db/schema';

/** 0.6694 → 66.94 % (always two places) */
const formatShare = (share: number) => `${(Math.round(share * 10000) / 100).toFixed(2)} %`;

// The base of the management fee: the subtotal, the tenant's own costs
const feeBasis = (data: StatementPDFData, t: Record<string, string>) =>
	fill(t.feeOwn, { percent: data.managementFeePercent, base: formatCHF(data.subtotal) });

// The time share as the tenant can check it: his days in the days billed (#208); without stored days (a statement
// created before, or a position over different days) the days rented / days of the period where the share is exactly
// that (a contract over the whole period bears every day), else the percentage; the heating profile's share as one
function timeShare(item: LineItem, data: StatementPDFData, t: Record<string, string>) {
	if (item.periodShare == null) return '–';
	if (item.segments) return formatShare(item.periodShare); // the parts below show their days (#1284)
	if (!item.byProfile && item.shareDays) return fill(t.days, item.shareDays);
	// the invoices under it give the share (#226, C-5); summing to zero they have none (#237)
	if (item.invoiceParts) return item.totalAmount === 0 ? '–' : formatShare(item.periodShare);
	const byDays = !item.byProfile && Math.abs(item.periodShare - data.rentalDays / data.periodDays) < 0.00005;
	return byDays ? fill(t.days, { days: data.rentalDays, total: data.periodDays }) : formatShare(item.periodShare);
}

function tableHeader({ doc, t }: Page, y: number) {
	doc.font(FONT.bold).fontSize(7.5).fillColor(COLORS.muted);
	const labels = [t.category, t.keyColumn, t.totalAmount, t.apartmentShareColumn, t.timeShareColumn, t.yourShare];
	labels.forEach((label, i) => doc.text(label, COLUMNS[i].x, y, { width: COLUMNS[i].width, align: COLUMNS[i].align }));
	const bottom = y + Math.max(...labels.map((label, i) => doc.heightOfString(label, { width: COLUMNS[i].width }))) + 4;
	rule(doc, bottom);
	return bottom + 6;
}

// One line per category: how the building's costs come to the tenant
export function costTable(page: Page, y: number) {
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
		const key = [item.key ?? '–', item.segments ? t.keyShareSegments : item.keyShare].filter(Boolean).join('\n');
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
	if (item.segments) return item.segments.map((segment) => segmentLine(segment, t));
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
export const monthList = (shares: MonthShare[], t: Record<string, string>) =>
	shares
		.map((m) => {
			const month = t.months.split(',')[m.month - 1];
			if (m.full == null) return `${month}\u00a0${m.percentage.toFixed(2)}\u00a0%`;
			return fill(t.monthSplit, { month, percent: m.percentage.toFixed(2), full: m.full.toFixed(2), days: m.days!, total: m.total! });
		})
		.join(', ');
export const monthSum = (shares: { month: number; percentage: number }[]) =>
	(shares.reduce((total, m) => total + Math.round(m.percentage * 100), 0) / 100).toFixed(2);
// a heating position with invoices by their own days (the Heizprofil's months in them, or days): the run's share is not theirs (#71)
export const ownProfileDays = (data: StatementPDFData) => data.lineItems.some((item) => item.byProfile && item.invoiceParts);
// every heating position by the profile has its invoices with their own Leistungszeitraum: the run's share bills none (#509)
export const noRunShare = (data: StatementPDFData) =>
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
