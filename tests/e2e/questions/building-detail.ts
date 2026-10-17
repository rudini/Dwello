import { Count, Text } from '../screenplay/questions';
import {
	addressLine,
	buildingMap,
	apartmentRow,
	fuelStockCategories,
	fuelStocksHeading,
	noTankValue,
	yearBuiltValue
} from '../targets/building-detail';

export const listedApartment = (number: string) => Text.of(apartmentRow(number));
export const yearBuilt = Text.of(yearBuiltValue);
export const buildingAddress = Text.of(addressLine);
export const shownMaps = Count.of(buildingMap);
export const tankOfBuilding = Text.of(noTankValue);
export const fuelStocksTitle = Text.of(fuelStocksHeading);
// the categories a Tankbestand can be recorded in (#100)
export const fuelStockCategoryNames = Text.ofAll(fuelStockCategories);
