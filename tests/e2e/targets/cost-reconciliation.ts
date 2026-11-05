import { type Target, target } from '../screenplay/target';

// #1126: the Kostenabstimmung of one building in the preview, and the one on its «Berichte» page
export const previewReconciliation = (buildingName: string, buildingId: string) =>
	target(`Kostenabstimmung von «${buildingName}» in der Vorschau`, (page) =>
		page.getByTestId(`preview-reconciliation-${buildingId}`)
	);
export const reportReconciliation = target('Kostenabstimmung der Berichte', (page) =>
	page.getByTestId('report-reconciliation')
);

// the column headings and the cells of the positions and the total, row by row
export const reconciliationCells = (scope: Target) =>
	target(`Zellen der ${scope}`, (page) =>
		scope.locate(page).getByTestId(/^cost-reconciliation-(head|cell)$/)
	);
// a row by its label: a position, the total, or a row beside the comparison
export const reconciliationRowCells = (scope: Target, label: string) =>
	target(`Zeile «${label}» der ${scope}`, (page) =>
		scope
			.locate(page)
			.getByTestId(/^cost-reconciliation-(row|extra)$/)
			.filter({ hasText: label })
			.getByTestId(/^cost-reconciliation-(cell|amount)$/)
	);
export const reconciliationHelp = (scope: Target) =>
	target(`Hilfetext der ${scope}`, (page) => scope.locate(page).getByTestId('cost-reconciliation-help'));
export const reconciliationNotes = (scope: Target) =>
	target(`Hinweise der ${scope}`, (page) => scope.locate(page).getByTestId('cost-reconciliation-note'));
export const reconciliationInvoice = (scope: Target, description: string) =>
	target(`Rechnung «${description}» in der ${scope}`, (page) =>
		scope.locate(page).getByRole('link', { name: description })
	);

// a row of the list on «Berichte»: a building and one of its periods
export const reportPeriod = (buildingId: string, periodStart: string) =>
	target('Kostenabstimmung in den Berichten', (page) => page.getByTestId(`report-period-${buildingId}-${periodStart}`));
