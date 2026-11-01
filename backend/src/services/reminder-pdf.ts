import { once } from 'events';
import PDFDocument from 'pdfkit';
import { addPaymentPart, embedFonts, FONT, type Language } from './pdf.service';
import type { QRBillConfig } from './qr-bill.service';
import { countryLine } from './postal-address';
import type { reminderLetter } from './reminder-letter';

// #521: the letter for the tenants' consent ends with its own part for their signatures
type Letter = Omit<ReturnType<typeof reminderLetter>, 'text' | 'title'> & { agreement?: { heading: string; paragraphs: string[] } };

export interface PostalAddress {
	name: string;
	address?: string | null;
	postalCode?: string | null;
	city?: string | null;
	country?: string | null;
}

const lines = (a: PostalAddress) =>
	[a.name, a.address, [a.postalCode, a.city].filter(Boolean).join(' '), countryLine(a.country)].filter(Boolean).join('\n');

/**
 * A4 letter with the recipient in the window position of a Swiss C5 envelope (right), and the QR-bill of the open
 * Saldo when there is one to pay (#108)
 */
export async function renderReminderPdf(
	letter: Letter,
	sender: PostalAddress,
	recipient: PostalAddress,
	date: string,
	payment?: {
		statement: Parameters<typeof addPaymentPart>[1];
		config: QRBillConfig;
		language: Language;
	}
) {
	const doc = embedFonts(new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 70, right: 60 } }));
	const finished = once(doc, 'end');
	const pages: Buffer[] = [];
	doc.on('data', (page: Buffer) => pages.push(page));

	doc.font(FONT.regular).fontSize(9).fillColor('#616f89').text(lines(sender), 70, 50);
	doc.fontSize(11).fillColor('#111318').text(lines(recipient), 330, 140, { width: 200 });
	doc.text(`${sender.city ?? ''}, ${date}`.replace(/^, /, ''), 70, 215);
	doc.font(FONT.bold).fontSize(14).text(letter.subject, 70, 245);
	doc.font(FONT.regular).fontSize(11).moveDown().text(`${letter.salutation},`);
	for (const paragraph of letter.paragraphs) doc.moveDown().text(paragraph, { width: 455 });
	doc.moveDown(1.5).text(letter.closing);
	if (letter.agreement) {
		// the text the tenant agrees to and its signatures stay on one page (persona Helga P-3)
		const { heading, paragraphs } = letter.agreement;
		const height =
			(2 + paragraphs.length) * doc.currentLineHeight(true) +
			doc.heightOfString(heading) +
			paragraphs.reduce((sum, paragraph) => sum + doc.heightOfString(paragraph, { width: 455 }), 0);
		if (doc.y + height > doc.page.height - doc.page.margins.bottom) doc.addPage();
		else doc.moveDown(2);
		doc.font(FONT.bold).text(heading).font(FONT.regular);
		for (const paragraph of paragraphs) doc.moveDown().text(paragraph, { width: 455 });
	}
	if (payment) await addPaymentPart(doc, payment.statement, payment.config, payment.language);
	doc.end();

	await finished;
	return Buffer.concat(pages);
}
