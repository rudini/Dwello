import { Accessible, Attribute, BrokenWords, Checked, Count, Enabled, OnTop, ShareInViewport, Text, Value, Visibility } from '../screenplay/questions';
import {
	billedUntilError,
	startDateNotice,
	billedUntilInput as billedUntilField,
	startDateInput as startDateField,
	advancePaymentInput,
	apartmentContractsUnknown,
	apartmentHintAnnouncement,
	overlapBox,
	apartmentOption,
	apartmentSelect,
	baseRentInput,
	durationOption,
	fixedApartment,
	fixedTenant,
	billedUntilHelp,
	feeHelp,
	partiesHelp,
	rentTakenOver,
	reviewContractsUnknown,
	reviewItem,
	runningContractHint,
	startContractsUnknown,
	tenantSelect,
	withdrawNoticeOption,
	noAgreedCostsNote,
	advancePaymentHelp,
	noAdvanceNotice,
	flatRateInput,
	flatRateWarning,
	runningContractEditHint,
	wizardText,
	noticeHint,
	announcedMonthlyTotal,
	leaveDialogTitle
} from '../targets/contract-form';
import { stepNames } from '../targets/wizard';
import { errorToast, successToast, warningToast } from '../targets/form';

export const apartmentSelectable = (apartmentId: string) => Enabled.of(apartmentOption(apartmentId));
export const chosenApartmentId = Value.of(apartmentSelect);
export const chosenTenantId = Value.of(tenantSelect);
export const chosenTenantName = Value.chosenIn(tenantSelect);
export const reviewed = (label: string) => Text.of(reviewItem(label));
export const confirmation = Text.of(successToast);
export const durationChosen = (label: string) => Checked.of(durationOption(label));
export const apartmentHint = Text.of(apartmentContractsUnknown);
export const startHint = Text.of(startContractsUnknown);
// #665: what a screen reader says with the field, so the hint is heard on the way through the form
export const apartmentSelectDescription = Accessible.descriptionOf(apartmentSelect);
export const startDateDescription = Accessible.descriptionOf(startDateField);
export const reviewHint = Text.of(reviewContractsUnknown);
export const enteredBaseRent = Value.of(baseRentInput);
export const apartmentChoiceLabel = (apartmentId: string) => Text.of(apartmentOption(apartmentId));
export const failure = Text.of(errorToast);
export const fixedTenantName = Text.of(fixedTenant);
export const fixedApartmentName = Text.of(fixedApartment);
export const tenantChoices = Count.of(tenantSelect);
export const apartmentChoices = Count.of(apartmentSelect);
export const partiesHelpText = Text.of(partiesHelp);
export const billedUntilHelpText = Text.of(billedUntilHelp);
export const feeHelpText = Text.of(feeHelp);
export const runningContractHintText = Text.of(runningContractHint);
export const enteredAdvancePayment = Value.of(advancePaymentInput);
export const rentTakenOverText = Text.of(rentTakenOver);
export const withdrawNoticeHelp = Text.of(withdrawNoticeOption);
export const noAgreedCostsWarning = Text.of(noAgreedCostsNote);
export const noAgreedCostsTone = Attribute.named('data-tone').of(noAgreedCostsNote); // «caution» warns (#429)
export const advancePaymentHelpText = Text.of(advancePaymentHelp);
export const noAdvanceNoticeText = Text.of(noAdvanceNotice);
export const enteredFlatRate = Value.of(flatRateInput);
export const flatRateWarningText = Text.of(flatRateWarning);
export const flatRateWarningShown = Visibility.of(flatRateWarning);
export const runningContractEditHintText = Text.of(runningContractEditHint);

// #453 (#328): the warning on a start in the past, and which date fields step «Mietdauer» asks for
export const startDateWarning = Text.of(startDateNotice);
export const startDateAsked = Visibility.of(startDateField);
export const billedUntilAsked = Visibility.of(billedUntilField);

// #499: what the field «Abgerechnet bis» says when it is refused
export const billedUntilErrorText = Text.of(billedUntilError);
export const timesInWizard = (text: string) => Count.of(wizardText(text));
export const brokenStepNames = BrokenWords.in(stepNames);
// #669: error messages left after a retry, what the hint's status region announces, and how much of the hint the window shows
export const failures = Count.of(errorToast);
export const failureOnTop = OnTop.of(errorToast);
export const confirmationShown = Visibility.of(successToast);
export const warning = Text.of(warningToast);
export const overlapBoxText = Text.of(overlapBox);
export const apartmentHintAnnounced = Text.of(apartmentHintAnnouncement);
export const apartmentHintInWindow = ShareInViewport.of(apartmentContractsUnknown);
export const noticeHintText = Text.of(noticeHint);
export const announcedTotal = Text.of(announcedMonthlyTotal);
export const leaveQuestion = Text.of(leaveDialogTitle);
