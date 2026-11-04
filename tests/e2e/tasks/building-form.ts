import type { Activity } from '../screenplay/actor';
import { Check, Click, Enter, Navigate, Select } from '../screenplay/interactions';
import {
	accountingPeriodSelect,
	addressInput,
	cantonSelect,
	cityInput,
	nameInput,
	noTankCheckbox,
	postalCodeInput,
	submitButton,
	yearBuiltInput
} from '../targets/building-form';

export type BuildingData = {
	name: string;
	address: string;
	postalCode: string;
	city: string;
	canton: string;
	/** the label of the Abrechnungsperiode; the form's proposal when left out (#1088) */
	accountingPeriod?: string;
};

export const openNewBuilding = Navigate.to('/buildings/new');
// what «Zum Inhalt springen» leaves in the address
export const openNewBuildingAtContent = Navigate.to('/buildings/new#main-content');
export const openBuildingEdit = (buildingId: string) => Navigate.to(`/buildings/${buildingId}/edit`);

export const saveBuilding = Click.on(submitButton);

export const registerBuilding = (building: BuildingData): Activity => (actor) =>
	actor.attemptsTo(
		Enter.theValue(building.name).into(nameInput),
		Enter.theValue(building.address).into(addressInput),
		Enter.theValue(building.postalCode).into(postalCodeInput),
		Enter.theValue(building.city).into(cityInput),
		Select.option(building.canton).from(cantonSelect),
		...(building.accountingPeriod ? [Select.option({ label: building.accountingPeriod }).from(accountingPeriodSelect)] : []),
		saveBuilding
	);

export const changeYearBuilt = (year: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(year).into(yearBuiltInput), saveBuilding);

export const changePostalCode = (postalCode: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(postalCode).into(postalCodeInput), saveBuilding);

export const markNoTank: Activity = (actor) => actor.attemptsTo(Check.the(noTankCheckbox), saveBuilding);

export const changeAccountingPeriod = (label: string): Activity => (actor) =>
	actor.attemptsTo(Select.option({ label }).from(accountingPeriodSelect), saveBuilding);
