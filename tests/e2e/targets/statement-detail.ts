import { target } from '../screenplay/target';

export const statementStatus = target('Status der Abrechnung', (page) => page.getByTestId('statement-status'));
export const statementLineItem = (category: string) =>
	target(`Position «${category}» der Abrechnung`, (page) =>
		page.getByTestId('statement-line-item').filter({ hasText: category })
	);
// Columns of a position: Kategorie, Schlüssel, Kosten Gebäude, Anteil, Betrag
const lineItemCell = (category: string, column: number, name: string) =>
	target(`${name} der Position «${category}»`, (page) =>
		statementLineItem(category).locate(page).locator('td').nth(column)
	);
export const lineItemShare = (category: string) => lineItemCell(category, 3, 'Anteil');
export const lineItemAmount = (category: string) => lineItemCell(category, 4, 'Betrag');
export const statementHeatingProfile = target('Heizprofil der Abrechnung', (page) =>
	page.getByTestId('statement-heating-profile')
);
export const sendStatementButton = target('Abrechnung versenden', (page) => page.getByTestId('statement-send-button'));
export const markPaidButton = target('Als bezahlt markieren', (page) => page.getByTestId('statement-mark-paid-button'));
export const confirmMarkPaidButton = target('Bezahlt bestätigen', (page) => page.getByTestId('statement-mark-paid-confirm'));
export const deleteStatementButton = target('Abrechnung löschen', (page) => page.getByTestId('statement-delete-button'));
export const confirmDeleteStatementButton = target('Löschen bestätigen', (page) =>
	page.getByTestId('statement-delete-confirm')
);
export const statementEditButton = target('Abrechnung bearbeiten', (page) => page.getByTestId('statement-edit-button'));
export const statementTenantLink = target('Mieter der Abrechnung', (page) => page.getByTestId('statement-tenant-link'));
export const statementApartmentLink = target('Wohnung der Abrechnung', (page) =>
	page.getByTestId('statement-apartment-link')
);
export const generatePdfButton = target('PDF erstellen', (page) => page.getByTestId('statement-generate-pdf-button'));
export const downloadPdfLink = target('PDF herunterladen', (page) => page.getByTestId('statement-pdf-download'));
export const sendDialog = target('Bestätigung des Versands', (page) => page.getByRole('dialog'));
export const confirmSendButton = target('Versand bestätigen', (page) => page.getByTestId('statement-send-confirm'));
export const sendRecipient = target('Empfänger', (page) => page.getByTestId('send-recipient'));
export const sendPdfLink = target('PDF ansehen', (page) => page.getByTestId('send-pdf-view'));
export const paidDateInput = target('Bezahlt am', (page) => page.getByTestId('paid-date-input'));
export const statementHistory = target('Verlauf', (page) =>
	page.getByRole('heading', { name: 'Verlauf' }).locator('xpath=ancestor::*[.//dl][1]')
);
export const pdfRefusalBackLink = target('Zu den Nebenkostenabrechnungen', (page) => page.getByTestId('pdf-refusal-back'));
export const pdfRefusalMessage = target('Meldung statt des PDF', (page) => page.getByTestId('pdf-refusal-message'));
export const resetPaymentButton = target('Zahlung zurücksetzen', (page) => page.getByTestId('statement-reset-payment-button'));
export const confirmResetPaymentButton = target('Zurücksetzen bestätigen', (page) =>
	page.getByTestId('statement-reset-payment-confirm')
);
export const resetPaymentDialog = target('Bestätigung des Zurücksetzens', (page) => page.getByRole('dialog'));
