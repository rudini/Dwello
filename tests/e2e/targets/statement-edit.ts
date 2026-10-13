import { target } from '../screenplay/target';

export const paymentDeadlineInput = target('Zahlungsfrist', (page) => page.getByTestId('payment-deadline-input'));
export const notesInput = target('Bemerkung', (page) => page.getByTestId('statement-notes-input'));
export const saveStatementButton = target('Speichern', (page) => page.getByTestId('statement-save-button'));
export const recalculateHint = target('Hinweis Neuerstellen', (page) => page.getByTestId('statement-recalculate-hint'));
export const statementPaymentDeadline = target('Zahlbar bis', (page) => page.getByTestId('statement-payment-deadline'));
export const statementNotes = target('Bemerkung der Abrechnung', (page) => page.getByTestId('statement-notes'));
