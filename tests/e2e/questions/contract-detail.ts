import { question } from '../screenplay/actor';
import { ShareInViewport, Text, Visibility } from '../screenplay/questions';
import {
	endDialogDeathHint,
	confirmEndContractButton,
	contractApartment,
	contractEndDate,
	contractEndError,
	contractStatus,
	contractTotalRent,
	deleteDialog,
	missingStatements
} from '../targets/contract-detail';

export const apartmentOfContract = Text.of(contractApartment);
export const totalRent = Text.of(contractTotalRent);
export const statusOfContract = Text.of(contractStatus);
export const endOfContract = Text.of(contractEndDate);
export const deleteDialogText = Text.of(deleteDialog);
export const endDateProblemShown = (message: string) => Visibility.of(contractEndError(message));
// entirely inside the window, as toBeInViewport({ ratio: 1 }) judges it
export const endConfirmationInWindow = question(
	'whether the end confirmation is entirely inside the window',
	async (actor) => ((await actor.answer(ShareInViewport.of(confirmEndContractButton))) ?? 0) > 1 - 1e-9
);

// The periods the contract page names as missing a statement (A-10, #142)
export const missingStatementsText = Text.of(missingStatements);
export const endDialogDeathText = Text.of(endDialogDeathHint);
