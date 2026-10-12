import type { Locator } from '@playwright/test';
import type { Actor } from '../fixtures/actor';
import { inDays } from '../fixtures/dates';
import { typeDate } from '../interactions/form';
import {
	confirmDeleteContractButton,
	confirmEndContractButton,
	contractApartmentLink,
	contractEndInput,
	contractEndPastConfirm,
	contractEditButton,
	contractInvoicesLink,
	contractStatementsLink,
	contractTenantLink,
	deleteContractButton,
	endContractButton
} from '../interactions/contract-detail';

const click = (target: (page: Actor['page']) => Locator) => async (actor: Actor) => {
	await target(actor.page).click();
};

// The tenant gave notice for a day: that day is typed in the dialog; a past day is confirmed with its consequence
export const endContractOn = (isoDate: string, { confirmPast = false } = {}) => async (actor: Actor) => {
	await endContractButton(actor.page).click();
	await typeDate(contractEndInput(actor.page), isoDate);
	if (confirmPast) await contractEndPastConfirm(actor.page).check();
	await confirmEndContractButton(actor.page).click();
};

// Today as the last day: no day is proposed, it is typed like any other
export const endContract = (actor: Actor) => endContractOn(inDays(0))(actor);

export const startDeletingContract = click(deleteContractButton);

export const deleteContract = async (actor: Actor) => {
	await deleteContractButton(actor.page).click();
	await confirmDeleteContractButton(actor.page).click();
};

export const editContractFromDetail = click(contractEditButton);
export const openContractTenant = click(contractTenantLink);
export const openContractApartment = click(contractApartmentLink);
export const showContractStatements = click(contractStatementsLink);
export const showBuildingInvoices = click(contractInvoicesLink);
