import { Text, Visibility } from '../screenplay/questions';
import { successToast } from '../targets/form';
import {
	anonymiseConsequence,
	anonymiseFrom,
	anonymiseTenantButton,
	rentalApartment,
	rentalRent,
	rentalStart,
	tenantAddress
} from '../targets/tenant-detail';

export const rentedApartment = Text.of(rentalApartment);
export const monthlyRent = Text.of(rentalRent);
export const rentalStartDate = Text.of(rentalStart);
export const correspondenceAddress = Text.of(tenantAddress);

export const anonymiseConsequenceText = Text.of(anonymiseConsequence);
export const anonymiseFromText = Text.of(anonymiseFrom);
export const anonymiseOffered = Visibility.of(anonymiseTenantButton);
export const anonymisedToast = Text.of(successToast);
