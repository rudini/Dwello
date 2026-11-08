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
		scope.locate(page).getByRole('columnheader').or(scope.locate(page).getByTestId('cost-reconciliation-cell'))
	);
// a row by its label: a position, the total, or a row beside the comparison
export const reconciliationRowCells = (scope: Target, label: string) =>
	target(`Zeile «${label}» der ${scope}`, (page) =>
		scope
			.locate(page)
			.getByTestId(/^cost-reconciliation-(row|extra)$/)
			.filter({ hasText: label })
			.getByTestId(/^cost-reconciliation-(cell|label|amount)$/)
	);
export const reconciliationHelp = (scope: Target) =>
	target(`Hilfetext der ${scope}`, (page) => scope.locate(page).getByTestId('cost-reconciliation-help'));
// #1138: the sentences under the table on the Tankbestand and the Leerstand of the period
export const reconciliationSentence = (scope: Target, topic: 'fuel-stock' | 'vacancy') =>
	target(`Satz zum ${topic === 'fuel-stock' ? 'Tankbestand' : 'Leerstand'} der ${scope}`, (page) =>
		scope.locate(page).getByTestId(`cost-reconciliation-${topic}`)
	);
export const reconciliationNotes = (scope: Target) =>
	target(`Hinweise der ${scope}`, (page) => scope.locate(page).getByTestId('cost-reconciliation-note'));
export const reconciliationStatement = (scope: Target, tenantName: string) =>
	target(`Abrechnung von «${tenantName}» in der ${scope}`, (page) =>
		scope.locate(page).getByTestId('cost-reconciliation-note').getByRole('link', { name: tenantName }).first()
	);

// a row of the list on «Berichte»: a building and one of its periods
export const reportPeriod = (buildingId: string, periodStart: string) =>
	target('Kostenabstimmung in den Berichten', (page) => page.getByTestId(`report-period-${buildingId}-${periodStart}`));
// #1126 (PO on persona Sven 1126 P-2): the tenants the note on drafts names
export const draftsNoteLinks = (scope: Target) =>
	target(`Abrechnungen im Hinweis zu den Entwürfen der ${scope}`, (page) =>
		scope.locate(page).getByTestId('cost-reconciliation-drafts').getByRole('link')
	);
