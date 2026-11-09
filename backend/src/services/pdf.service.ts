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
import { generateQRBillForStatement, formatIBANForDisplay, type QRBillConfig } from './qr-bill.service';
import { fill } from './pdf-format';
import { formatFloor, namedByFloor } from './pdf-floor';
import { segmentIntros } from './pdf-segments';
import { CodedError } from './coded-error';
import { countryLine } from './postal-address';
import { greetingWords } from './reminder-letter';
import { balanceBox, openOf, unpaid } from './pdf-balance';
import { costTable } from './pdf-cost-table';
import { heatingSection } from './pdf-heating';
import { paymentPart, type QRResult } from './pdf-payment-part';
import {
	COLORS,
	FONT,
	MM,
	PAGE,
	PAYMENT_PART,
	amountLine,
	embedFonts,
	formatCurrency,
	formatDate,
	heading,
	room,
	translations,
	type Page,
	type StatementPDFData
} from './pdf-layout';
import type { Language } from '../db/schema';

/**
 * Supported languages
 */
export type { Language } from '../db/schema';
export type { StatementPDFData } from './pdf-layout';

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

// Paragraphs over the width of the page, each kept on one page (#1284: the apartment no longer counting)
const paragraphs = ({ doc }: Page, texts: string[], y: number) =>
	texts.reduce((top, text) => doc.font(FONT.regular).fontSize(9).fillColor(COLORS.ink).text(text, PAGE.left, room(doc, top, 30), { width: PAGE.right - PAGE.left }).y + 8, y);

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
			y = costTable(page, paragraphs(page, segmentIntros(data.lineItems, t), y));
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