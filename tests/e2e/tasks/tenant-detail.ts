import type { Actor } from '../fixtures/actor';
import { historyLink } from '../interactions/apartment-detail';
import {
	confirmDeleteTenantButton,
	deleteTenantButton,
	editTenantButton,
	newContractButton,
	rentalApartmentLink
} from '../interactions/tenant-detail';

export const editTenant = async (actor: Actor) => {
	await editTenantButton(actor.page).click();
};

export const startContractForTenant = async (actor: Actor) => {
	await newContractButton(actor.page).click();
};

export const openTenantApartment = async (actor: Actor) => {
	await rentalApartmentLink(actor.page).click();
};

export const openContractOfApartment = (number: string) => async (actor: Actor) => {
	await historyLink(actor.page, `Wohnung ${number}`).click();
};

export const startDeletingTenant = async (actor: Actor) => {
	await deleteTenantButton(actor.page).click();
};

export const deleteTenant = async (actor: Actor) => {
	await deleteTenantButton(actor.page).click();
	await confirmDeleteTenantButton(actor.page).click();
};
