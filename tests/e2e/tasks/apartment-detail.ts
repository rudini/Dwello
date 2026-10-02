import type { Actor } from '../fixtures/actor';
import { editButton, historyLink, tenantProfileButton } from '../interactions/apartment-detail';

export const editApartment = async (actor: Actor) => {
	await editButton(actor.page).click();
};

export const openTenantProfile = async (actor: Actor) => {
	await tenantProfileButton(actor.page).click();
};

export const openContractFromHistory = (tenantName: string) => async (actor: Actor) => {
	await historyLink(actor.page, tenantName).click();
};
