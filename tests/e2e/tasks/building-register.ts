import type { Activity } from '../screenplay/actor';
import { Click, Enter, FailRequests, Select, Uncheck, Wait } from '../screenplay/interactions';
import { indexOfApartment } from '../questions/building-register';
import {
	existingBuildingLink,
	firstRegisterResult,
	registerApartmentField,
	registerApartmentIncluded,
	registerSearchInput,
	registerSection
} from '../targets/building-register';

// The address search of «Neues Gebäude» against the Gebäuderegister (#479)
export const searchRegister = (text: string) => Enter.theValue(text).into(registerSearchInput);

/** Searches the address, takes the first hit and waits until the register's data are in the form */
export const chooseRegisterAddress = (text: string): Activity => (actor) =>
	actor.attemptsTo(searchRegister(text), Click.on(firstRegisterResult), Wait.until(registerSection));

export const registerUnreachable = FailRequests.to('/api/addresses', {});

export const leaveOutApartment = (number: string): Activity => async (actor) =>
	actor.attemptsTo(Uncheck.the(registerApartmentIncluded(await actor.answer(indexOfApartment(number)))));

export const completeApartment =
	(number: string, values: { area: string; floor: string; rooms: string }): Activity =>
	async (actor) => {
		const index = await actor.answer(indexOfApartment(number));
		await actor.attemptsTo(
			Enter.theValue(values.area).into(registerApartmentField('area', index)),
			Select.option({ label: values.floor }).from(registerApartmentField('floor', index)),
			Enter.theValue(values.rooms).into(registerApartmentField('rooms', index))
		);
};

export const openExistingBuilding = Click.on(existingBuildingLink);
