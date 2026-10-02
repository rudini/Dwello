import type { Actor } from '../fixtures/actor';
import {
	apartmentBuildingFilter,
	apartmentCard,
	apartmentSearchButton,
	apartmentStatusFilter,
	filteredBy,
	newApartmentButton
} from '../interactions/apartments';

export const showApartmentsOfBuilding =
	(buildingId: string, status = '') =>
	async (actor: Actor) => {
		await apartmentBuildingFilter(actor.page).selectOption(buildingId);
		await apartmentStatusFilter(actor.page).selectOption(status);
		await apartmentSearchButton(actor.page).click();
		await filteredBy(actor.page, buildingId);
	};

export const startNewApartment = async (actor: Actor) => {
	await newApartmentButton(actor.page).click();
};

export const openApartment = (number: string) => async (actor: Actor) => {
	await apartmentCard(actor.page, number).click();
};
