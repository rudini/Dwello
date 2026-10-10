import type { Actor } from '../fixtures/actor';
import { typeDate } from '../interactions/form';
import {
	addApartmentButton,
	apartmentRow,
	confirmDeleteButton,
	deleteButton,
	editButton,
	firstApartmentButton,
	fuelStockAmount,
	fuelStockDate,
	fuelStockRows,
	saveFuelStockButton
} from '../interactions/building-detail';
import { expect } from '@playwright/test';

export const startDeletingBuilding = async (actor: Actor) => {
	await deleteButton(actor.page).click();
};

export const deleteBuilding = async (actor: Actor) => {
	await startDeletingBuilding(actor);
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

// Value of the heating oil in the tank on a reading day; waits until the page lists it
export const recordFuelStock = (date: string, amount: string) => async (actor: Actor) => {
	const listed = await fuelStockRows(actor.page).count();
	await typeDate(fuelStockDate(actor.page), date);
	await fuelStockAmount(actor.page).fill(amount);
	await saveFuelStockButton(actor.page).click();
	await expect(fuelStockRows(actor.page)).toHaveCount(listed + 1);
};
