import { Text } from '../screenplay/questions';
import { addressLine, apartmentRow, noTankValue, yearBuiltValue } from '../targets/building-detail';

export const listedApartment = (number: string) => Text.of(apartmentRow(number));
export const yearBuilt = Text.of(yearBuiltValue);
export const buildingAddress = Text.of(addressLine);
export const tankOfBuilding = Text.of(noTankValue);
