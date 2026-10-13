import { ShareInViewport, Text, Visibility } from '../screenplay/questions';
import {
	confirmEndContractButton,
	contractApartment,
	contractEndDate,
	contractEndError,
	contractStatus,
	contractTotalRent
} from '../targets/contract-detail';

export const apartmentOfContract = Text.of(contractApartment);
export const totalRent = Text.of(contractTotalRent);
export const statusOfContract = Text.of(contractStatus);
export const endOfContract = Text.of(contractEndDate);
export const endDateProblemShown = (message: string) => Visibility.of(contractEndError(message));
// the share of the end confirmation inside the window, 1 when entirely inside (toBeInViewport({ ratio: 1 }))
export const endConfirmationShareInWindow = ShareInViewport.of(confirmEndContractButton);
