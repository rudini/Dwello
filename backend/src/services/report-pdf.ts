/**
 * #1409: a report as PDF, A4: its title, lines under it and sections, each a help text and a table of labels and
 * amounts. The BFF gives the texts in the landlord's language and the amounts as the page shows them, so the PDF
 * shows the same rows and numbers as the page and the CSV
 */

import { a4Pdf, FONT, type Doc } from './pdf-layout';

export type ReportDocument = {
	title: string;
	lines: string[];
	sections: {
		heading: string;
		help: string;
		rows: { label: string; amount: string; total?: boolean }[];
	}[];
};

const [LEFT, WIDTH, AMOUNT] = [56, 483, 120];
const INK = '#111318';

export const renderReportPdf = (report: ReportDocument) =>
	a4Pdf(
		{ margins: { top: 56, bottom: 56, left: LEFT, right: LEFT }, info: { Title: report.title } },
		(doc) => {
			doc.font(FONT.bold).fontSize(16).fillColor(INK).text(report.title);
			doc.font(FONT.regular).fontSize(10);
			for (const line of report.lines) doc.text(line, { width: WIDTH });
			for (const section of report.sections) {
				doc.moveDown(1.5).font(FONT.bold).fontSize(12).text(section.heading);
				doc.moveDown(0.3).font(FONT.regular).fontSize(9).text(section.help, { width: WIDTH });
				doc.moveDown(0.5).fontSize(10);
				for (const row of section.rows) tableRow(doc, row);
			}
		}
	);

// label and amount on one line, so its text reads «Total Kosten CHF 18’840.00»; a total underlined
function tableRow(doc: Doc, row: ReportDocument['sections'][number]['rows'][number]) {
	if (doc.y > doc.page.height - 80) doc.addPage();
	const y = doc.y;
	doc.font(row.total ? FONT.bold : FONT.regular);
	doc.text(row.label, LEFT, y, { width: WIDTH - AMOUNT });
	const below = doc.y;
	doc.text(row.amount, LEFT + WIDTH - AMOUNT, y, { width: AMOUNT, align: 'right' });
	doc.x = LEFT;
	doc.y = Math.max(below, doc.y) + 3;
	if (row.total)
		doc
			.moveTo(LEFT, doc.y - 1)
			.lineTo(LEFT + WIDTH, doc.y - 1)
			.lineWidth(0.5)
			.stroke(INK);
}
