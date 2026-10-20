import { Attribute, Checked, Count, Enabled, Text, Value, Visibility } from '../screenplay/questions';
import {
	startDateNotice,
	billedUntilInput as billedUntilField,
	startDateInput as startDateField,
	advancePaymentInput,
	apartmentContractsUnknown,
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
	runningContractEditHint
} from '../targets/contract-form';
import { errorToast, successToast } from '../targets/form';

export const apartmentSelectable = (apartmentId: string) => Enabled.of(apartmentOption(apartmentId));
export const chosenApartmentId = Value.of(apartmentSelect);
export const chosenTenantId = Value.of(tenantSelect);
export const chosenTenantName = Value.chosenIn(tenantSelect);
export const reviewed = (label: string) => Text.of(reviewItem(label));
export const confirmation = Text.of(successToast);
export const durationChosen = (label: string) => Checked.of(durationOption(label));
export const apartmentHint = Text.of(apartmentContractsUnknown);
export const startHint = Text.of(startContractsUnknown);
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
