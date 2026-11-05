import { Count, Text, Value, Visibility } from '../screenplay/questions';
import { apartmentCards, apartmentEmptyNotice, apartmentMoveOut, apartmentSearchHelpText, apartmentSearchInput, apartmentStatus } from '../targets/apartments';

export const occupancyOf = (number: string) => Text.of(apartmentStatus(number));
export const apartmentCount = Count.of(apartmentCards);
export const apartmentEmptyHint = Text.of(apartmentEmptyNotice);
export const apartmentSearchTerm = Value.of(apartmentSearchInput);
export const apartmentSearchHelp = Text.of(apartmentSearchHelpText);
export const moveOutOf = (number: string) => Text.of(apartmentMoveOut(number));
export const moveOutShownOf = (number: string) => Visibility.of(apartmentMoveOut(number));
