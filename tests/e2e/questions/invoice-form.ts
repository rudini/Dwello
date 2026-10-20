import { Checked, Count, Enabled, Text, Value, Visibility } from '../screenplay/questions';
import {
	billedWarning,
	categoryLabel,
	categoryWarning,
	invoiceDateInput,
	invoiceDateWords,
	periodWarning,
	servicePeriodHelp,
	utilityCostCheckbox,
	utilityCostHelp
} from '../targets/invoice-form';

export const markedAsUtilityCost = Checked.of(utilityCostCheckbox);
export const utilityCostMarkable = Enabled.of(utilityCostCheckbox);
export const nonAllocableCategoryWarning = Text.of(categoryWarning);
export const invoiceDate = Value.of(invoiceDateInput);
export const invoiceDateShown = Visibility.of(invoiceDateInput);
export const invoiceDateInWords = Text.of(invoiceDateWords);
export const billedWarningText = Text.of(billedWarning);
export const dateOutsidePeriodWarning = Text.of(periodWarning);
export const dateOutsidePeriodWarnings = Count.of(periodWarning);
export const utilityCostHelpText = Text.of(utilityCostHelp);
export const servicePeriodHelpText = Text.of(servicePeriodHelp);
export const categoryLabelText = Text.of(categoryLabel);
