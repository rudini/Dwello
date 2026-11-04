import { question } from '../screenplay/actor';
import { Count, Text } from '../screenplay/questions';
import { inDays } from '../fixtures/dates';
import {
	accountingPeriodValue,
	addressLine,
	buildingMap,
	apartmentRow,
	fuelStockCategories,
	fuelStocksHeading,
	fuelStocksIntro,
	fuelStockDateHelp,
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
export const fuelStockDateExample = Text.of(fuelStockDateHelp);
// Fachreview 1103-1 V-1: whether the example's day is neither after today nor a year or more before it
export const fuelStockDateExampleRecent = question('whether the Stichtag example lies in the last year', async (actor) => {
	const found = (await actor.answer(fuelStockDateExample))?.match(/(\d{2})\.(\d{2})\.(\d{4})/);
	if (!found) return false;
	const [, day, month, year] = found;
	const today = inDays(0);
	return `${year}-${month}-${day}` <= today && `${Number(year) + 1}-${month}-${day}` > today;
});
// #1103: the day the field's example names, or null without one
export const fuelStockDateExampleDay = question('the day of the Stichtag example', async (actor) =>
	(await actor.answer(fuelStockDateExample))?.match(/\d{2}\.\d{2}\.\d{4}/)?.[0] ?? null
);
// #1103: whether the help names the day of the field's example
export const fuelStocksHelpNamesExample = question('whether the help names the Stichtag example', async (actor) => {
	const day = await actor.answer(fuelStockDateExampleDay);
	return !!day && !!(await actor.answer(fuelStocksHelp))?.includes(day);
});
