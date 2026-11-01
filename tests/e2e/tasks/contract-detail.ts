import { inDays } from '../fixtures/dates';
import type { Activity } from '../screenplay/actor';
import { Browser, Check, Click, DownloadFrom, EnterDate, Navigate, Scroll } from '../screenplay/interactions';
import {
	confirmDeleteContractButton,
	consentLetterLink,
	confirmEndContractButton,
	contractApartmentLink,
	contractEditButton,
	contractEndInput,
	contractEndPastConfirm,
	noticeReceivedInput,
	contractInvoicesLink,
	contractStatementsLink,
	contractTenantLink,
	deleteContractButton,
	advanceDeleteButton,
	confirmAdvanceDeleteButton,
	deleteDialogStatementLink,
	deleteMistakeConfirmation,
	deleteDraftAndEndButton,
	endContractButton,
	missingStatementInvoicesLink,
	missingStatementLink,
	nextStep,
	refusedStatementLink,
	continueOpenEndedButton,
	movedOutButton,
	confirmMovedOutButton,
	deleteDraftAndContinueButton
} from '../targets/contract-detail';

export const openContract = (contractId: string) => Navigate.to(`/contracts/${contractId}`);

// The tenant gave notice for a day: that day is typed in the dialog; a past day is confirmed with its consequence
export const endContractOn = (isoDate: string, { confirmPast = false } = {}): Activity => async (actor) => {
	await actor.attemptsTo(Click.on(endContractButton), EnterDate.of(isoDate).into(contractEndInput));
	if (confirmPast) await actor.attemptsTo(Check.the(contractEndPastConfirm));
	await actor.attemptsTo(Click.on(confirmEndContractButton));
};

// Today as the last day: no day is proposed, it is typed like any other
export const endContract: Activity = (actor) => actor.attemptsTo(endContractOn(inDays(0)));

// the dialog filled, not confirmed yet: the day of the end and the day the notice arrived (A-3, #112)
export const fillEndWithNotice = (endDate: string, receivedOn: string): Activity => (actor) =>
	actor.attemptsTo(
		Click.on(endContractButton),
		EnterDate.of(endDate).into(contractEndInput),
		EnterDate.of(receivedOn).into(noticeReceivedInput)
	);
export const confirmEnd = Click.on(confirmEndContractButton);

export const startEndingContract = Click.on(endContractButton);
export const startDeletingContract = Click.on(deleteContractButton);
export const deleteContract: Activity = (actor) =>
	actor.attemptsTo(Click.on(deleteContractButton), Click.on(confirmDeleteContractButton));

export const confirmMistake: Activity = Check.the(deleteMistakeConfirmation);

// a started contract: the mistake confirmed in the dialog first (A-7, #116)
export const deleteContractEnteredByMistake: Activity = (actor) =>
	actor.attemptsTo(
		Click.on(deleteContractButton),
		Check.the(deleteMistakeConfirmation),
		Click.on(confirmDeleteContractButton)
	);

export const editContractFromDetail = Click.on(contractEditButton);
export const openContractTenant = Click.on(contractTenantLink);
export const openContractApartment = Click.on(contractApartmentLink);
export const showContractStatements = Click.on(contractStatementsLink);
export const showBuildingInvoices = Click.on(contractInvoicesLink);
export const chooseNextStep = (label: string) => Click.on(nextStep(label));
export const openRefusedStatement = Click.on(refusedStatementLink);
export const deleteDraftAndEndContract = Click.on(deleteDraftAndEndButton);
export const createMissingStatement = (periodStart: string) => Click.on(missingStatementLink(periodStart));

export const useWindowOf = (width: number, height: number) => Browser.resizeTo({ width, height });
// the confirm button scrolled into view inside the dialog
export const scrollToEndConfirmation = Scroll.to(confirmEndContractButton);
export const showMissingStatementInvoices = (periodStart: string) => Click.on(missingStatementInvoicesLink(periodStart));

export const openStatementFromDeleteDialog = (statementId: string) => Click.on(deleteDialogStatementLink(statementId));
// A-6 (#115): after an expired fixed-term contract the tenant either still lives there or has moved out
export const continueOpenEnded = Click.on(continueOpenEndedButton);
// the move-out is confirmed with its consequence in a dialog (personas a6 P-1)
export const confirmMovedOut: Activity = (actor) =>
	actor.attemptsTo(Click.on(movedOutButton), Click.on(confirmMovedOutButton));
export const deleteDraftAndContinue = Click.on(deleteDraftAndContinueButton);

// #464: a later Akonto is deleted; the one before applies again from then on
export const deleteAdvance = (amount: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(advanceDeleteButton(amount)), Click.on(confirmAdvanceDeleteButton));

/** #521: downloads the letter for the tenants' consent to a new Abrechnungsperiode */
export const downloadConsentLetter = DownloadFrom(consentLetterLink);
export const requestConsentLetter = Click.on(consentLetterLink);
// #521 (C-1): the letter's address typed in or kept from a stale page
export const openConsentLetter = (contractId: string) => Navigate.to(`/contracts/${contractId}/consent-letter`);
