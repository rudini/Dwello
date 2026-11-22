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

// #1464: the Rechnungen under a position (or under the row of the non-allocable ones), found by the control that names
// the position; the copy for the other screen width is hidden and has no role
const invoicesOf = (scope: Target, position: string) =>
	target(`Rechnungen von «${position}» der ${scope}`, (page) =>
		scope
			.locate(page)
			.getByTestId('cost-reconciliation-invoices')
			.filter({ has: page.getByRole('button', { name: position }) })
	);
export const invoicesToggle = (scope: Target, position: string) =>
	target(`Schaltfläche der Rechnungen von «${position}» der ${scope}`, (page) =>
		invoicesOf(scope, position).locate(page).getByRole('button')
	);
export const invoicesToggleLabel = (scope: Target, position: string) =>
	target(`Beschriftung der Rechnungen von «${position}» der ${scope}`, (page) =>
		invoicesOf(scope, position).locate(page).getByTestId('cost-reconciliation-toggle-label')
	);
export const invoiceCells = (scope: Target, position: string) =>
	target(`Zeilen der Rechnungen von «${position}» der ${scope}`, (page) =>
		invoicesOf(scope, position).locate(page).getByTestId('cost-reconciliation-invoice-cell')
	);
export const noInvoiceNote = (scope: Target, position: string) =>
	target(`Hinweis ohne Rechnung bei «${position}» der ${scope}`, (page) =>
		invoicesOf(scope, position).locate(page).getByTestId('cost-reconciliation-no-invoice')
	);
export const invoiceLink = (scope: Target, date: string) =>
	target(`Rechnung vom ${date} in der ${scope}`, (page) => scope.locate(page).getByRole('link', { name: date }));
// the first position's control at the width shown (axe and language looks of the expanded state)
export const firstInvoicesToggle = target('Schaltfläche der Rechnungen der ersten Position', (page) =>
	page.getByTestId('cost-reconciliation-invoices').getByRole('button').first()
);
