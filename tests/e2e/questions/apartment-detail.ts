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

/** The rows of the contract history, in order: a row naming the expected contract answers that name, any other row its
 * text, so a failing check shows what the history says */
export const contractHistoryNaming = (...expected: string[]) =>
	question(`the contract history, expecting ${expected.join(', ')}`, async (actor) =>
		(await actor.answer(Text.ofAll(historyRows))).map((row, i) => (expected[i] && row.includes(expected[i]) ? expected[i] : row))
	);
