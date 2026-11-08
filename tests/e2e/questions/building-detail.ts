import { question, type Question } from '../screenplay/actor';
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
export const listedApartmentCount = (number: string) => Count.of(apartmentRow(number));
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
// #1103: the day the field's example names, and the Stichtag the help names («Der Wert vom …»); null without one
export const fuelStockDateExampleDay = question('the day of the Stichtag example', async (actor) =>
	(await actor.answer(fuelStockDateExample))?.match(/\d{2}\.\d{2}\.\d{4}/)?.[0] ?? null
);
export const fuelStocksHelpDay = question('the Stichtag the Tankbestand help names', async (actor) =>
	(await actor.answer(fuelStocksHelp))?.match(/Der Wert vom (\d{2}\.\d{2}\.\d{4})/)?.[1] ?? null
);
// Fachreview 1103-1 V-1, code review 1103-1 C-1: how many days before today a named day lies, and how many days after
// today it lies one year later (a last ended end: the first at least 0, the second more than 0)
const daysFromToday = (day: string | null, years: number) => {
	const [d, m, y] = day!.split('.').map(Number);
	const today = new Date(`${inDays(0)}T00:00:00Z`).getTime();
	return Math.round((Date.UTC(y + years, m - 1, d) - today) / 86_400_000);
};
export const daysBeforeToday = (named: Question<string | null>) =>
	question(`how many days before today ${named} lies`, async (actor) => -daysFromToday(await actor.answer(named), 0));
export const daysAfterTodayAYearLater = (named: Question<string | null>) =>
	question(`how many days after today ${named} lies one year later`, async (actor) => daysFromToday(await actor.answer(named), 1));
