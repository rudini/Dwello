import { question } from '../screenplay/actor';
import { Accessible, Attribute, Checked, Count, FocusedLabel, OpenedPage, ShareInViewport, Text, Visibility, Width } from '../screenplay/questions';
import { pageTitle } from '../targets/app-frame';
import {
	contractEndInput,
	endKind,
	endKindNotice,
	endKindAgreement,
	moveOutHint,
	refusedStatementLink,
	endContractButton,
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
	missingStatementLink,
	missingStatementLinks,
	missingStatementInvoicesLink,
	missingStatementPeriod,
	fixedTermCheck,
	fixedTermError,
	contractFlatRate,
	deleteMistakeConfirmation,
	dialogErrors,
	missingStatementsTitle,
	contractEditButton,
	deleteContractButton
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
// #741: how many pixels each button of a missing statement falls short of the width of its row
export const missingStatementButtonsShortOfRow = (periodStart: string) =>
	question(`how far the buttons of the missing statement from ${periodStart} fall short of its row`, async (actor) => {
		const [row, ...buttons] = await Promise.all(
			[missingStatementPeriod, missingStatementLink, missingStatementInvoicesLink].map((part) => actor.answer(Width.of(part(periodStart))))
		);
		return buttons.map((width) => (row === null || width === null ? null : Math.round(row - width)));
	});
export const missingStatementLinkTexts = Text.ofAll(missingStatementLinks); // #741: in the order shown
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
// #663: the refused draft opens in a new tab
export const openedInNewTab = question('whether the draft opened in a new tab', async (actor) => (await actor.answer(OpenedPage)).newTab);
export const openedPath = question('the path of the opened draft', async (actor) => (await actor.answer(OpenedPage)).path);
export const noticeReceivedHelp = Accessible.descriptionOf(noticeReceivedInput);

/** The field of the dialog «Mietvertrag beenden» that has the focus, by its label (#653) */
export const focusedEndDialogField = FocusedLabel;
export const moveOutText = Text.of(moveOutHint);
export const refusedStatementName = Text.of(refusedStatementLink);
export const endActionLabel = Text.of(endContractButton);
export const moveOutShown = Visibility.of(moveOutHint);

export const missingStatementsTitleText = Text.of(missingStatementsTitle);

// #740: how many pixels each page action is narrower than the page title (0: as wide)
export const contractActionsNarrowerThanTitle = question('how much narrower the contract actions are than the page title', async (actor) => {
	const [title, ...actions] = await Promise.all(
		[pageTitle, contractEditButton, endContractButton, deleteContractButton].map(async (one) => Math.round((await actor.answer(Width.of(one))) ?? 0))
	);
	return actions.map((width) => title - width);
});
// #1148: the question of the end dialog, a notice or an Aufhebungsvereinbarung, with the help under each
export const endKindText = Text.of(endKind);
export const noticeReceivedShown = Visibility.of(noticeReceivedInput);
export const noticeChosen = Checked.of(endKindNotice);
export const agreementChosen = Checked.of(endKindAgreement);
export const noticeReceivedOnShown = Visibility.of(contractNoticeReceived);
