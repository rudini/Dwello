import { once } from 'events';
import PDFDocument from 'pdfkit';
import type { reminderLetter } from './reminder-letter';

type Letter = ReturnType<typeof reminderLetter>;

export interface PostalAddress {
	name: string;
	address?: string | null;
	postalCode?: string | null;
	city?: string | null;
}

const lines = (a: PostalAddress) =>
	[a.name, a.address, [a.postalCode, a.city].filter(Boolean).join(' ')].filter(Boolean).join('\n');

/** A4 letter with the recipient in the window position of a Swiss C5 envelope (right) */
export async function renderReminderPdf(
	letter: Letter,
	sender: PostalAddress,
	recipient: PostalAddress,
	date: string
) {
	const doc = new PDFDocument({
		size: 'A4',
		margins: { top: 50, bottom: 50, left: 70, right: 60 }
	});
	const finished = once(doc, 'end');
	const pages: Buffer[] = [];
	doc.on('data', (page: Buffer) => pages.push(page));

	doc.font('Helvetica').fontSize(9).fillColor('#616f89').text(lines(sender), 70, 50);
	doc.fontSize(11).fillColor('#111318').text(lines(recipient), 330, 140, { width: 200 });
	doc.text(`${sender.city ?? ''}, ${date}`.replace(/^, /, ''), 70, 250);
	doc.font('Helvetica-Bold').fontSize(14).text(letter.subject, 70, 290);
	doc.font('Helvetica').fontSize(11).moveDown(1.5).text(`${letter.salutation},`);
	for (const paragraph of letter.paragraphs) doc.moveDown().text(paragraph, { width: 455 });
	doc.moveDown(2).text(letter.closing);
	doc.end();

	await finished;
	return Buffer.concat(pages);
}
