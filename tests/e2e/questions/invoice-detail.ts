import { Text } from '../screenplay/questions';
import {
	amount,
	category,
	distributionKey,
	legalNote,
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
