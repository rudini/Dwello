import { inDays } from '../fixtures/dates';
import type { Activity } from '../screenplay/actor';
import { Browser, Check, Click, EnterDate, Navigate, Scroll } from '../screenplay/interactions';
import {
	confirmDeleteContractButton,
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
	deleteDialogStatementLink,
	deleteMistakeConfirmation,
	deleteDraftAndEndButton,
	endContractButton,
	missingStatementLink,
	nextStep,
	refusedStatementLink
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

export const openStatementFromDeleteDialog = (statementId: string) => Click.on(deleteDialogStatementLink(statementId));
