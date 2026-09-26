import type { Locator } from '@playwright/test';
import type { Actor } from '../fixtures/actor';
import {
	confirmDeleteContractButton,
	confirmEndContractButton,
	contractApartmentLink,
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
