import { question } from '../screenplay/actor';
import { Count, Text, Value, Visibility } from '../screenplay/questions';
import { apartmentBuildingOptions, apartmentCards, apartmentEmptyNotice, apartmentResultsHeading, apartmentMoveOut, apartmentSearchHelpText, apartmentSearchInput, apartmentStatus } from '../targets/apartments';

export const occupancyOf = (number: string) => Text.of(apartmentStatus(number));
export const apartmentCount = Count.of(apartmentCards);
export const apartmentEmptyHint = Text.of(apartmentEmptyNotice);
export const apartmentSearchTerm = Value.of(apartmentSearchInput);
export const apartmentSearchHelp = Text.of(apartmentSearchHelpText);
export const moveOutOf = (number: string) => Text.of(apartmentMoveOut(number));
export const moveOutShownOf = (number: string) => Visibility.of(apartmentMoveOut(number));
export const apartmentResults = Text.of(apartmentResultsHeading);
const offeredBuildings = Text.ofAll(apartmentBuildingOptions);
// #670: the order of these buildings in the building filter (it lists the parallel scenarios' buildings too)
export const filterOrderOf = (buildings: string[]) =>
	question(`the order of ${buildings.join(', ')} in the building filter`, async (actor) =>
		(await offeredBuildings.answeredBy(actor)).filter((option) => buildings.includes(option))
	);
