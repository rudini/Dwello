import { Count, Text } from '../screenplay/questions';
import {
	invoiceNumber,
	amount,
	category,
	categoryReason,
	distributionKey,
	legalNote,
	missedWarning,
	overrideReason,
	recategorizeError,
	utilityCost
} from '../targets/invoice-detail';

export const amountOfInvoice = Text.of(amount);
export const categoryOfInvoice = Text.of(category);
export const distributionKeyOfInvoice = Text.of(distributionKey);
export const utilityCostOfInvoice = Text.of(utilityCost);
export const tenancyLawNote = Text.of(legalNote);
export const recategorizationFailure = Text.of(recategorizeError);
export const reasonForOverride = Text.of(overrideReason);
export const numberOfInvoice = Text.of(invoiceNumber);
export const missedWarningText = Text.of(missedWarning);
export const reasonOfCategory = Text.of(categoryReason);
export const reasonsOfCategory = Count.of(categoryReason);
export const tenancyLawNotes = Count.of(legalNote);
