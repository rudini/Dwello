import { Count, Text } from '../screenplay/questions';
import {
	accountingPeriodValue,
	addressLine,
	buildingMap,
	apartmentRow,
	fuelStockCategories,
	fuelStocksHeading,
	fuelStocksIntro,
	noTankValue,
	yearBuiltValue
} from '../targets/building-detail';

export const listedApartment = (number: string) => Text.of(apartmentRow(number));
export const yearBuilt = Text.of(yearBuiltValue);
export const buildingAddress = Text.of(addressLine);
export const shownMaps = Count.of(buildingMap);
export const periodOfBuilding = Text.of(accountingPeriodValue);
export const tankOfBuilding = Text.of(noTankValue);
export const fuelStocksTitle = Text.of(fuelStocksHeading);
// the categories a Tankbestand can be recorded in (#100)
export const fuelStockCategoryNames = Text.ofAll(fuelStockCategories);
// #1098: the help names the last day of the building's own Abrechnungsperiode
export const fuelStocksHelp = Text.of(fuelStocksIntro);
