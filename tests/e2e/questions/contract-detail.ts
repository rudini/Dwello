import { question } from '../screenplay/actor';
import { Accessible, Attribute, Checked, Count, ShareInViewport, Text, Visibility } from '../screenplay/questions';
import {
	contractEndInput,
	noticeReceivedInput,
	advancePeriod,
	nextSteps,
	endDialogDeathHint,
	endDialog,
	noticePeriodHint,
	contractNoticeReceived,
	confirmEndContractButton,
	contractApartment,
	contractEndDate,
	contractEndError,
	contractBilledUntil,
	contractManagementFee,
	contractAgreedCosts,
	contractStatus,
	contractTotalRent,
	deleteDialog,
	deleteDialogStatementLink,
	missingStatements,
	shortPeriodHelp,
	shortPeriodHelpAt,
	consentLetterLink,
	missingStatementLink,
	missingStatementInvoicesLink,
	fixedTermCheck,
	fixedTermError,
	contractFlatRate,
	deleteMistakeConfirmation,
	dialogErrors
} from '../targets/contract-detail';

export const apartmentOfContract = Text.of(contractApartment);
export const totalRent = Text.of(contractTotalRent);
export const flatRateUtilityCharge = Text.of(contractFlatRate);
export const statusOfContract = Text.of(contractStatus);
export const endOfContract = Text.of(contractEndDate);
export const deleteDialogText = Text.of(deleteDialog);
export const statementLinkedInDeleteDialog = (statementId: string) =>
	Attribute.named('href').of(deleteDialogStatementLink(statementId));
export const endDateProblemShown = (message: string) => Visibility.of(contractEndError(message));
// entirely inside the window, as toBeInViewport({ ratio: 1 }) judges it
export const endConfirmationInWindow = question(
	'whether the end confirmation is entirely inside the window',
	async (actor) => ((await actor.answer(ShareInViewport.of(confirmEndContractButton))) ?? 0) > 1 - 1e-9
);

// The periods the contract page names as missing a statement (A-10, #142)
export const missingStatementsText = Text.of(missingStatements);
export const missingStatementsShown = Visibility.of(missingStatements);
export const missingStatementInvoicesLabel = (periodStart: string) => Text.of(missingStatementInvoicesLink(periodStart));
export const shortPeriodHelpText = Text.of(shortPeriodHelp);
export const shortPeriodHelpShownAt = (periodStart: string) => Visibility.of(shortPeriodHelpAt(periodStart));
export const consentLetterShown = Visibility.of(consentLetterLink); // #521
// the way into the wizard for the missing days from that day on
export const missingStatementOffer = (periodStart: string) => Text.of(missingStatementLink(periodStart));
export const managementFeeOfContract = Text.of(contractManagementFee);
export const billedUntilOfContract = Text.of(contractBilledUntil); // #133
export const endDialogDeathText = Text.of(endDialogDeathHint);
export const noticePeriodHintText = Text.of(noticePeriodHint);
export const noticePeriodHintShown = Visibility.of(noticePeriodHint);
export const endDialogText = Text.of(endDialog);
export const noticeReceivedOn = Text.of(contractNoticeReceived);
export const nextStepsText = Text.of(nextSteps);
export const fixedTermCheckShown = Visibility.of(fixedTermCheck);
export const fixedTermCheckText = Text.of(fixedTermCheck);
export const fixedTermErrorText = Text.of(fixedTermError);

export const agreedCostsOfContract = Text.of(contractAgreedCosts);
// #464: the row of one Akonto amount with the time it applies
export const advancePeriodOf = (amount: string) => Text.of(advancePeriod(amount));
export const mistakeConfirmed = Checked.of(deleteMistakeConfirmation);
export const dialogErrorCount = Count.of(dialogErrors);
// #511: the help each field of «Mietvertrag beenden» gives, as its accessible description
export const endDateHelp = Accessible.descriptionOf(contractEndInput);
export const noticeReceivedHelp = Accessible.descriptionOf(noticeReceivedInput);
