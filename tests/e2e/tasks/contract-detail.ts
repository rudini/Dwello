import type { Locator } from '@playwright/test';
import type { Actor } from '../fixtures/actor';
import { typeDate } from '../interactions/form';
import {
	confirmDeleteContractButton,
	confirmEndContractButton,
	contractApartmentLink,
	contractEndInput,
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

export const endContract = async (actor: Actor) => {
	await endContractButton(actor.page).click();
	await confirmEndContractButton(actor.page).click();
};

// The tenant gave notice for a later day: that day is typed in the dialog
export const endContractOn = (isoDate: string) => async (actor: Actor) => {
	await endContractButton(actor.page).click();
	await typeDate(contractEndInput(actor.page), isoDate);
	await confirmEndContractButton(actor.page).click();
};

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
