import { Checked, Count, Enabled, Text, Value, Visibility } from '../screenplay/questions';
import {
	advancePaymentInput,
	apartmentContractsUnknown,
	apartmentOption,
	apartmentSelect,
	baseRentInput,
	durationOption,
	fixedApartment,
	fixedTenant,
	partiesHelp,
	rentTakenOver,
	reviewContractsUnknown,
	reviewItem,
	runningContractHint,
	startContractsUnknown,
	tenantSelect,
	withdrawNoticeOption
} from '../targets/contract-form';
import { errorToast, successToast } from '../targets/form';
import { draftRestored } from '../targets/wizard';

export const apartmentSelectable = (apartmentId: string) => Enabled.of(apartmentOption(apartmentId));
export const chosenApartmentId = Value.of(apartmentSelect);
export const chosenTenantId = Value.of(tenantSelect);
export const chosenTenantName = Value.chosenIn(tenantSelect);
export const reviewed = (label: string) => Text.of(reviewItem(label));
export const draftRestoredShown = Visibility.of(draftRestored);
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
export const runningContractHintText = Text.of(runningContractHint);
export const enteredAdvancePayment = Value.of(advancePaymentInput);
export const rentTakenOverText = Text.of(rentTakenOver);
export const withdrawNoticeHelp = Text.of(withdrawNoticeOption);
