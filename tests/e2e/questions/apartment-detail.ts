import { question } from '../screenplay/actor';
import { Text, Visibility } from '../screenplay/questions';
import {
	type ApartmentInfo,
	currentTenantName,
	historyRows,
	infoCard,
	monthlyTotal,
	nextTenantNote,
	vacancyNote
} from '../targets/apartment-detail';
import { breadcrumbLink } from '../targets/navigation';

export const apartmentInfo = (info: ApartmentInfo) => Text.of(infoCard(info));
export const currentTenant = Text.of(currentTenantName);
export const grossMonthlyRent = Text.of(monthlyTotal);
export const vacancyShown = Visibility.of(vacancyNote);
export const nextTenant = Text.of(nextTenantNote);
export const buildingOfApartmentShown = (buildingName: string) => Visibility.of(breadcrumbLink(buildingName));

/** The contract history in its order: per row the first of these texts it names, or the row's own text */
export const contractHistoryNaming = (...names: string[]) =>
	question(`the contract history, by ${names.join(', ')}`, async (actor) =>
		(await actor.answer(Text.ofAll(historyRows))).map((row) => names.find((name) => row.includes(name)) ?? row)
	);
