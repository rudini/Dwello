import { Text } from '../screenplay/questions';
import { rentalApartment, rentalRent, rentalStart } from '../targets/tenant-detail';

export const rentedApartment = Text.of(rentalApartment);
export const monthlyRent = Text.of(rentalRent);
export const rentalStartDate = Text.of(rentalStart);
