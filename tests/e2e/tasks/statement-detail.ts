import { CallTheApi, throughUiOrApi } from '../screenplay/abilities';
import type { Activity } from '../screenplay/actor';
import { Click, DownloadFrom, Enter, EnterDate, Navigate } from '../screenplay/interactions';
import {
	confirmCorrectButton,
	confirmEarlyPaidDateButton,
	correctPaidAmountInput,
	correctStatementButton,
	confirmRecalculateButton,
	recalculateButton,
	createCorrectionButton,
	replacedByLink,
	replacedContractLink,
	replacesLink,
	confirmDeleteStatementButton,
	confirmMarkPaidButton,
	confirmSendButton,
	deliverByLetterButton,
	deleteStatementButton,
	downloadPdfLink,
	pdfRefusalBackLink,
	generatePdfButton,
	lineItemInvoiceLink,
	markPaidButton,
	paidDateInput,
	confirmResetPaymentButton,
	resetPaymentButton,
	sendStatementButton,
	statementApartmentLink,
	statementEditButton,
	statementTenantLink,
	letterInsteadLink
} from '../targets/statement-detail';

/** The API path keeps the statement as the backend returns it for `heatingCostsOfTenant` */
export const STATEMENT = 'statement';

export const openStatementDetail = (statementPath: string) =>
	throughUiOrApi(Navigate.to(statementPath), async (actor) =>
		actor.remember(STATEMENT, await actor.abilityTo(CallTheApi).get(statementPath.slice(1)))
	);

export const openSendConfirmation = Click.on(sendStatementButton);

// The confirmation names the recipient and the PDF; the user confirms having delivered it
export const confirmSending = Click.on(confirmSendButton);

export const sendStatement: Activity = (actor) => actor.attemptsTo(openSendConfirmation, confirmSending);

// After a failed e-mail: the PDF goes by letter, confirmed as for a tenant who wants letters
export const deliverByLetter: Activity = (actor) =>
	actor.attemptsTo(Click.on(deliverByLetterButton), Click.on(confirmSendButton));

export const markStatementPaid: Activity = (actor) =>
	actor.attemptsTo(Click.on(markPaidButton), Click.on(confirmMarkPaidButton));

// The day the money came in, typed into the dialog's date field
export const markStatementPaidOn = (isoDate: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(markPaidButton), EnterDate.of(isoDate).into(paidDateInput), Click.on(confirmMarkPaidButton));

export const deleteStatement: Activity = (actor) =>
	actor.attemptsTo(Click.on(deleteStatementButton), Click.on(confirmDeleteStatementButton));

export const editStatementFromDetail = Click.on(statementEditButton);
export const openStatementTenant = Click.on(statementTenantLink);
export const openStatementApartment = Click.on(statementApartmentLink);

export const generateStatementPdf = Click.on(generatePdfButton);
export const downloadStatementPdf = DownloadFrom(downloadPdfLink);
/** Follows the PDF link in the tab, as a browser does when the answer is no PDF */
export const requestStatementPdf = Click.on(downloadPdfLink);
export const leavePdfRefusal = Click.on(pdfRefusalBackLink);

export const openInvoiceOfPosition = (category: string, description: string) => Click.on(lineItemInvoiceLink(category, description));
export const openResetPaymentConfirmation = Click.on(resetPaymentButton);

// The confirmation names the consequence; the user confirms it (#92)
export const resetPayment: Activity = (actor) =>
	actor.attemptsTo(Click.on(resetPaymentButton), Click.on(confirmResetPaymentButton));

// #338: a draft is calculated again from the invoices as they are now, after the confirmation names the consequence
export const recalculateDraft: Activity = (actor) =>
	actor.attemptsTo(Click.on(recalculateButton), Click.on(confirmRecalculateButton));

// #120: replacing names its consequence first; the berichtigte Abrechnung is created on the replaced one
export const openCorrectConfirmation = Click.on(correctStatementButton);
export const correctStatement: Activity = (actor) =>
	actor.attemptsTo(Click.on(correctStatementButton), Click.on(confirmCorrectButton));
export const createCorrection = Click.on(createCorrectionButton);
export const openReplacedStatement = Click.on(replacesLink);
export const openCorrection = Click.on(replacedByLink);
export const openReplacedContract = Click.on(replacedContractLink);

// #449: the letter instead of the e-mail, from the e-mail dialog; the tenant's channel stays
export const deliverByLetterInstead: Activity = (actor) =>
	actor.attemptsTo(openSendConfirmation, Click.on(letterInsteadLink), Click.on(confirmSendButton));

// #403
export const confirmEarlyPaidDate = Click.on(confirmEarlyPaidDateButton);
export const correctStatementPaid = (amount: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(correctStatementButton), Enter.theValue(amount).into(correctPaidAmountInput), Click.on(confirmCorrectButton));
