import type { Actor } from '../fixtures/actor';
import {
	addApartmentButton,
	apartmentRow,
	confirmDeleteButton,
	deleteButton,
	editButton,
	firstApartmentButton
} from '../interactions/building-detail';

export const deleteBuilding = async (actor: Actor) => {
	await deleteButton(actor.page).click();
	await confirmDeleteButton(actor.page).click();
};

export const startEditing = async (actor: Actor) => {
	await editButton(actor.page).click();
};

export const startNewApartment = async (actor: Actor) => {
	await addApartmentButton(actor.page).click();
};

export const startFirstApartment = async (actor: Actor) => {
	await firstApartmentButton(actor.page).click();
};

export const openApartment = (number: string) => async (actor: Actor) => {
	await apartmentRow(actor.page, number).click();
};
