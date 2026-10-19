import { Value } from '../screenplay/questions';
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
