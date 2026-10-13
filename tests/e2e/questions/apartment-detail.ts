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

/** Whether the contract history lists exactly these contracts, in this order, each row naming its text */
export const contractHistoryLists = (...expected: string[]) =>
	question(`whether the contract history lists ${expected.join(', ')}`, async (actor) => {
		const rows = await actor.answer(Text.ofAll(historyRows));
		return rows.length === expected.length && rows.every((row, i) => new RegExp(expected[i]).test(row));
	});
