import type { Actor } from '../fixtures/actor';
import {
	addressInput,
	cancelButton,
	cantonSelect,
	cityInput,
	nameInput,
	postalCodeInput,
	submitButton,
	yearBuiltInput
} from '../interactions/building-form';

export type BuildingData = { name: string; address: string; postalCode: string; city: string; canton: string };

export const registerBuilding = (building: BuildingData) => async (actor: Actor) => {
	await nameInput(actor.page).fill(building.name);
	await addressInput(actor.page).fill(building.address);
	await postalCodeInput(actor.page).fill(building.postalCode);
	await cityInput(actor.page).fill(building.city);
	await cantonSelect(actor.page).selectOption(building.canton);
	await submitButton(actor.page).click();
};

export const saveBuilding = async (actor: Actor) => {
	await submitButton(actor.page).click();
};

export const cancelEditing = async (actor: Actor) => {
	await cancelButton(actor.page).click();
};

export const changeYearBuilt = (year: string) => async (actor: Actor) => {
	await yearBuiltInput(actor.page).fill(year);
	await submitButton(actor.page).click();
};

export const changePostalCode = (postalCode: string) => async (actor: Actor) => {
	await postalCodeInput(actor.page).fill(postalCode);
	await submitButton(actor.page).click();
};
