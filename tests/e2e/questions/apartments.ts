import { Count, Text } from '../screenplay/questions';
import { apartmentCards, apartmentEmptyNotice, apartmentStatus } from '../targets/apartments';

export const occupancyOf = (number: string) => Text.of(apartmentStatus(number));
export const apartmentCount = Count.of(apartmentCards);
export const apartmentEmptyHint = Text.of(apartmentEmptyNotice);
