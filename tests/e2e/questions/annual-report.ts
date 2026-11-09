import { question } from '../screenplay/actor';
import { Count, DownloadedFile, Text } from '../screenplay/questions';
import { annualReportCells, annualReportDownloads, annualReportHeading, annualReportHelp, annualReportNotes, annualReportPart } from '../targets/annual-report';

// #1409: what the Jahresbericht shows, and what its CSV says
export const annualReportCellsOf = (part: 'income' | 'costs') => Text.ofAll(annualReportCells(annualReportPart(part)));
export const annualReportTitle = Text.of(annualReportHeading);
export const annualReportDownloadCount = Count.of(annualReportDownloads);
export const annualReportNotesText = Text.ofAll(annualReportNotes);
export const annualReportHelpOf = (part: 'income' | 'costs') => Text.of(annualReportHelp(annualReportPart(part)));

/** The amounts of the named positions in the downloaded CSV, «Position Betrag»; the cells split at «;», the
 * position in the second last column, the amount in the last */
export const csvAmountsOf = (positions: string[]) =>
	question('the amounts in the downloaded CSV', async (actor) => {
		const rows = (await actor.answer(DownloadedFile)).content
			.toString('utf8')
			.replace(/^\ufeff/, '')
			.split(/\r?\n/)
			.filter(Boolean)
			.map((line) => line.split(';'));
		return positions.map((position) => `${position} ${rows.find((row) => row.at(-2) === position)?.at(-1) ?? '(missing)'}`);
	});
