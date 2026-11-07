import { Accessible, Attribute, Count, ShareInViewport, Text, Tones } from '../screenplay/questions';
import {
	invoiceNumber,
	amount,
	billedIn,
	deleteDialog,
	deleteDialogTitle,
	deleteDialogWarning,
	deductedHint,
	deductedRule,
	category,
	categoryReason,
	distributionKeyRow,
	distributionKey,
	legalNote,
	missedWarning,
	overrideReason,
	recategorizeError,
	utilityCost,
	utilityCostBadge
} from '../targets/invoice-detail';

export const amountOfInvoice = Text.of(amount);
export const categoryOfInvoice = Text.of(category);
export const distributionKeyOfInvoice = Text.of(distributionKey);
export const utilityCostOfInvoice = Text.of(utilityCost);
export const tenancyLawNote = Text.of(legalNote);
// #687: «Nicht umlagefähig» is a correct state, not a warning
export const toneOfUtilityCost = Attribute.named('data-tone').of(utilityCostBadge);
export const tonesInTenancyLawNote = Tones.in(legalNote);
export const recategorizationFailure = Text.of(recategorizeError);
export const reasonForOverride = Text.of(overrideReason);
export const numberOfInvoice = Text.of(invoiceNumber);
export const missedWarningText = Text.of(missedWarning);
export const reasonOfCategory = Text.of(categoryReason);
export const reasonsOfCategory = Count.of(categoryReason);
export const tenancyLawNotes = Count.of(legalNote);
export const distributionKeyRows = Count.of(distributionKeyRow);
export const deductedHintAtAmount = Text.of(deductedHint);
export const deductedRuleAtAmount = Text.of(deductedRule);
export const statementsOfInvoice = Text.of(billedIn);
export const billedWarningOnDelete = Text.of(deleteDialogWarning);
export const deleteDialogTitleText = Text.of(deleteDialogTitle);
export const deleteDialogDescription = Accessible.descriptionOf(deleteDialog);
export const deleteDialogTitleShare = ShareInViewport.of(deleteDialogTitle);
