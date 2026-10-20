import { question } from '../screenplay/actor';
import { FocusedElement, Value } from '../screenplay/questions';
import {
	addressInput,
	buildingTypeSelect,
	cantonSelect,
	cityInput,
	nameInput,
	postalCodeInput,
	yearBuiltInput
} from '../targets/building-form';

const fields = {
	name: nameInput,
	address: addressInput,
	postalCode: postalCodeInput,
	city: cityInput,
	canton: cantonSelect,
	yearBuilt: yearBuiltInput
};

/** What a field of the building form holds (the canton as its code) */
export const buildingFormValue = (field: keyof typeof fields) => Value.of(fields[field]);
export const chosenBuildingType = Value.chosenIn(buildingTypeSelect);

const fieldNames: Record<string, string> = { 'building-name-input': 'Gebäudename', 'building-address-input': 'Adresse' };
/** The building form's field that has the focus, by its label */
export const focusedField = question('the focused field of the building form', async (actor) => {
	const testid = await actor.answer(FocusedElement);
	return testid ? (fieldNames[testid] ?? testid) : null;
});
