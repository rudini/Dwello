import type { Activity } from '../screenplay/actor';
import { Click, Enter, EnterDate, Navigate, Wait } from '../screenplay/interactions';
import { Count } from '../screenplay/questions';
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
	invoicesButton,
	saveFuelStockButton
} from '../targets/building-detail';

export const openBuildingDetail = (buildingId: string) => Navigate.to(`/buildings/${buildingId}`);

export const startDeletingBuilding = Click.on(deleteButton);

export const deleteBuilding: Activity = (actor) => actor.attemptsTo(startDeletingBuilding, Click.on(confirmDeleteButton));

export const startEditing = Click.on(editButton);

export const startNewApartment = Click.on(addApartmentButton);

export const openBuildingInvoices = Click.on(invoicesButton);

export const startFirstApartment = Click.on(firstApartmentButton);

export const openApartment = (number: string) => Click.on(apartmentRow(number));

// Value of the heating oil in the tank on a reading day; waits until the page lists it
export const recordFuelStock = (date: string, amount: string): Activity => async (actor) => {
	const listed = await actor.answer(Count.of(fuelStockRows));
	await actor.attemptsTo(
		EnterDate.of(date).into(fuelStockDate),
		Enter.theValue(amount).into(fuelStockAmount),
		Click.on(saveFuelStockButton),
		Wait.forCount(fuelStockRows, listed + 1)
	);
};

// Types a reading day and empties it again, then saves: the page names the missing day (#566)
export const saveFuelStockWithoutDate = (typedDate: string, amount: string): Activity => (actor) =>
	actor.attemptsTo(
		EnterDate.of(typedDate).into(fuelStockDate),
		EnterDate.of('').into(fuelStockDate),
		Enter.theValue(amount).into(fuelStockAmount),
		Click.on(saveFuelStockButton)
	);
