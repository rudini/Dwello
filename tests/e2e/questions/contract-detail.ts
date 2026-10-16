import { question } from '../screenplay/actor';
import { ShareInViewport, Text, Visibility } from '../screenplay/questions';
import {
	nextSteps,
	endDialogDeathHint,
	endDialog,
	noticePeriodHint,
	contractNoticeReceived,
	confirmEndContractButton,
	contractApartment,
	contractEndDate,
	contractEndError,
	contractManagementFee,
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
export const managementFeeOfContract = Text.of(contractManagementFee);
export const endDialogDeathText = Text.of(endDialogDeathHint);
export const noticePeriodHintText = Text.of(noticePeriodHint);
export const noticePeriodHintShown = Visibility.of(noticePeriodHint);
export const endDialogText = Text.of(endDialog);
export const noticeReceivedOn = Text.of(contractNoticeReceived);
export const nextStepsText = Text.of(nextSteps);
