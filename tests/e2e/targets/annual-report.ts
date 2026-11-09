import { type Target, target } from '../screenplay/target';

// #1409: the Jahresbericht on «Auswertungen»: the choice of building and year, its two tables and their help texts
export const annualReportBuilding = target('Gebäude des Jahresberichts', (page) => page.getByTestId('annual-report-building'));
export const annualReportYear = target('Jahr des Jahresberichts', (page) => page.getByTestId('annual-report-year'));
export const showAnnualReport = target('Bericht anzeigen', (page) => page.getByTestId('annual-report-show'));
export const annualReportPart = (part: 'income' | 'costs') =>
	target(`${part === 'income' ? 'Mietertrag' : 'Kosten'} des Jahresberichts`, (page) => page.getByTestId(`annual-report-${part}`));
// the column headings and the cells, row by row
export const annualReportCells = (scope: Target) =>
	target(`Zellen der ${scope}`, (page) => scope.locate(page).getByRole('columnheader').or(scope.locate(page).getByRole('rowheader')).or(scope.locate(page).getByRole('cell')));
export const annualReportHelp = (scope: Target) => target(`Hilfetext der ${scope}`, (page) => scope.locate(page).getByTestId('annual-report-help'));
export const annualReportDownload = (kind: 'csv' | 'pdf') =>
	target(`Jahresbericht als ${kind.toUpperCase()}`, (page) => page.getByTestId(`annual-report-${kind}`));
export const runningYearNote = target('Hinweis zum laufenden Jahr', (page) => page.getByTestId('annual-report-current-year'));
// #1409: the notes on the landlord's share of the Nebenkosten: its Abrechnungsperiode, missing statements, notes
export const annualReportNotes = target('Hinweise des Jahresberichts', (page) => page.getByTestId('annual-report-note'));
