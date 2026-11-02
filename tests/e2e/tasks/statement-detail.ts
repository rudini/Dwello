import { CallTheApi, throughUiOrApi } from '../screenplay/abilities';
import type { Activity } from '../screenplay/actor';
import { successToast } from '../targets/form';
import { Click, DownloadFrom, Enter, EnterDate, Navigate, Wait } from '../screenplay/interactions';
import {
	carrySettleButton,
	confirmCarrySettleButton,
	confirmCorrectButton,
	confirmEarlyPaidDateButton,
	correctPaidAmountInput,
	correctStatementButton,
	laterCorrectButton,
	confirmRecalculateButton,
	confirmDeclineCorrectionButton,
	declineCorrectionButton,
	recalculateButton,
	redeliverButton,
	confirmRedeliverButton,
	newPdfSentButton,
	confirmNewPdfSentButton,
	splitKeysInvoiceLink,
	sendRecalculateButton,
	createCorrectionButton,
	replacedByLink,
	replacedContractLink,
	correctionAnswer,
	replacesLink,
	confirmDeleteStatementButton,
	confirmMarkPaidButton,
	confirmSendButton,
	deliverByLetterButton,
	deleteStatementButton,
	downloadPdfLink,
	sentPdfLink,
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
	letterInsteadLink,
	pdfBeforeChangeLink,
	paidAmountInput
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

export const startMarkingPaid = Click.on(markPaidButton);
// #959: a part of the Saldo, the statement stays open; done once it is saved (code review 959b-1 C-8)
export const recordPayment = (amount: string): Activity => (actor) =>
	actor.attemptsTo(
		Click.on(markPaidButton),
		Enter.theValue(amount).into(paidAmountInput),
		Click.on(confirmMarkPaidButton),
		Wait.until(successToast)
	);

// The day the money came in, typed into the dialog's date field
export const markStatementPaidOn = (isoDate: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(markPaidButton), EnterDate.of(isoDate).into(paidDateInput), Click.on(confirmMarkPaidButton));

export const deleteStatement: Activity = (actor) =>
	actor.attemptsTo(Click.on(deleteStatementButton), Click.on(confirmDeleteStatementButton));

export const editStatementFromDetail = Click.on(statementEditButton);
export const openStatementTenant = Click.on(statementTenantLink);
export const openStatementApartment = Click.on(statementApartmentLink);

// done once the PDF is made: the Verlauf may already name a new PDF (#968), and the page renders it again when made
export const generateStatementPdf: Activity = (actor) =>
	actor.attemptsTo(Click.on(generatePdfButton), Wait.until(successToast));
export const downloadStatementPdf = DownloadFrom(downloadPdfLink);
export const downloadSentPdf = DownloadFrom(sentPdfLink);
export const downloadPdfBeforeChange = DownloadFrom(pdfBeforeChangeLink);
/** Follows the PDF link in the tab, as a browser does when the answer is no PDF */
export const requestStatementPdf = Click.on(downloadPdfLink);
export const leavePdfRefusal = Click.on(pdfRefusalBackLink);

export const openInvoiceOfPosition = (category: string, description: string) => Click.on(lineItemInvoiceLink(category, description));
export const openResetPaymentConfirmation = Click.on(resetPaymentButton);

// The confirmation names the consequence; the user confirms it (#92)
export const confirmResetPayment = Click.on(confirmResetPaymentButton);
export const resetPayment: Activity = (actor) => actor.attemptsTo(Click.on(resetPaymentButton), confirmResetPayment);

// #454 (Fachreview 454-1 E-6): a sent statement left as it is, after the confirmation
export const startDecliningCorrection = Click.on(declineCorrectionButton);
export const declineCorrection: Activity = (actor) =>
	actor.attemptsTo(Click.on(declineCorrectionButton), Click.on(confirmDeclineCorrectionButton));

// #338: a draft is calculated again from the invoices as they are now, after the confirmation names the consequence
export const askToRecalculate = Click.on(recalculateButton);
export const askToRedeliver = Click.on(redeliverButton);
// done once its success is said, before the next step leaves the page
export const redeliverByLetter: Activity = (actor) =>
	actor.attemptsTo(Click.on(redeliverButton), Click.on(confirmRedeliverButton), Wait.until(successToast));
export const markNewPdfSent: Activity = (actor) =>
	actor.attemptsTo(Click.on(newPdfSentButton), Click.on(confirmNewPdfSentButton));
export const openSplitKeysInvoice = (description: string) => Click.on(splitKeysInvoiceLink(description));
export const recalculateDraft: Activity = (actor) =>
	actor.attemptsTo(Click.on(recalculateButton), Click.on(confirmRecalculateButton));
// #547: from the send dialog of a draft that is not current
export const recalculateFromSending: Activity = (actor) =>
	actor.attemptsTo(Click.on(sendRecalculateButton), Click.on(confirmRecalculateButton));

// #120: replacing names its consequence first; the berichtigte Abrechnung is created on the replaced one
export const openCorrectConfirmation = Click.on(correctStatementButton);
export const openCorrectionFromHint = Click.on(laterCorrectButton);
export const correctStatement: Activity = (actor) =>
	actor.attemptsTo(Click.on(correctStatementButton), Click.on(confirmCorrectButton));
// #932: done once the berichtigte Abrechnung or the refusal shows, so no later step or the clean-up runs while it is saved
export const createCorrection: Activity = (actor) => actor.attemptsTo(Click.on(createCorrectionButton), Wait.until(correctionAnswer));
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

// #506 B: the landlord paid out or claimed the Übertrag himself
export const settleCarryOver: Activity = (actor) => actor.attemptsTo(Click.on(carrySettleButton), Click.on(confirmCarrySettleButton));
