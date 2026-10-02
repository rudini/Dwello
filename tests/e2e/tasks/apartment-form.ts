import type { Actor } from '../fixtures/actor';
import {
	areaInput,
	buildingSelect,
	floorSelect,
	numberInput,
	roomsSelect,
	statusSelect,
	submitButton
} from '../interactions/apartment-form';

export type ApartmentData = { number: string; floor: string; area: string; rooms: string };

export const chooseBuilding = (buildingId: string) => async (actor: Actor) => {
	await buildingSelect(actor.page).selectOption(buildingId);
};

export const registerApartment = (apartment: ApartmentData) => async (actor: Actor) => {
	await numberInput(actor.page).fill(apartment.number);
	await floorSelect(actor.page).selectOption(apartment.floor);
	await areaInput(actor.page).fill(apartment.area);
	await roomsSelect(actor.page).selectOption(apartment.rooms);
	await submitButton(actor.page).click();
};

export const saveApartment = async (actor: Actor) => {
	await submitButton(actor.page).click();
};

export const enterNumber = (number: string) => async (actor: Actor) => {
	await numberInput(actor.page).fill(number);
};

export const changeNumber = (number: string) => async (actor: Actor) => {
	await numberInput(actor.page).fill(number);
	await submitButton(actor.page).click();
};

export const changeArea = (area: string) => async (actor: Actor) => {
	await areaInput(actor.page).fill(area);
	await submitButton(actor.page).click();
};

export const blockApartment = async (actor: Actor) => {
	await statusSelect(actor.page).selectOption('reserved');
	await submitButton(actor.page).click();
};
