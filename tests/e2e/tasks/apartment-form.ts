import type { Activity } from '../screenplay/actor';
import { Click, Enter, Navigate, Select } from '../screenplay/interactions';
import {
	areaInput,
	buildingSelect,
	floorSelect,
	numberInput,
	roomsSelect,
	statusSelect,
	submitButton
} from '../targets/apartment-form';

export type ApartmentData = { number: string; floor: string; area: string; rooms: string };

export const openNewApartment = Navigate.to('/apartments/new');
export const openNewApartmentInBuilding = (buildingId: string) => Navigate.to(`/apartments/new?building=${buildingId}`);
export const openApartmentEdit = (apartmentId: string) => Navigate.to(`/apartments/${apartmentId}/edit`);

export const chooseBuilding = (buildingId: string) => Select.option(buildingId).from(buildingSelect);

export const saveApartment = Click.on(submitButton);

export const registerApartment = (apartment: ApartmentData): Activity => (actor) =>
	actor.attemptsTo(
		Enter.theValue(apartment.number).into(numberInput),
		Select.option(apartment.floor).from(floorSelect),
		Enter.theValue(apartment.area).into(areaInput),
		Select.option(apartment.rooms).from(roomsSelect),
		saveApartment
	);

export const enterNumber = (number: string) => Enter.theValue(number).into(numberInput);

export const changeNumber = (number: string): Activity => (actor) => actor.attemptsTo(enterNumber(number), saveApartment);

export const changeArea = (area: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(area).into(areaInput), saveApartment);

export const blockApartment: Activity = (actor) =>
	actor.attemptsTo(Select.option('reserved').from(statusSelect), saveApartment);
