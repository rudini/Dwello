/**
 * The Swiss QR-bill (SIX) at the foot of a page: receipt and payment part, for a statement and a reminder (#108)
 */

import { formatCHF } from './pdf-format';
import { generateQRBillForStatement, formatIBANForDisplay, formatQRReferenceForDisplay, type QRBillConfig, type StatementForQRBill } from './qr-bill.service';
import { qrTown } from './postal-address';
import { COLORS, FONT, MM, PAGE, PAYMENT_PART, translations, type Doc, type Page } from './pdf-layout';
import type { Language } from '../db/schema';

/** 1234.5 → 1 234.50: the amount in the payment part (SIX: space between thousands) */
const qrAmount = (amount: number) => formatCHF(amount).replace(/'/g, ' ');

export type QRResult = Awaited<ReturnType<typeof generateQRBillForStatement>>;

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
export function paymentPart(
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
