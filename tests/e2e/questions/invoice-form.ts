import { Attribute, Checked, Count, Enabled, Text, Value, Visibility } from '../screenplay/questions';
import {
	billedWarning,
	categoryLabel,
	categoryWarning,
	invoiceDateInput,
	invoiceDateWords,
	invoiceNumberInput,
	keyHelp,
	keySelect,
	periodWarning,
	servicePeriodFirst,
	servicePeriodHelp,
	servicePeriodMore,
	supplierInput,
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
export const invoiceNumberValue = Value.of(invoiceNumberInput);
export const supplierValue = Value.of(supplierInput);
export const servicePeriodFirstText = Text.of(servicePeriodFirst);
export const servicePeriodMoreText = Text.of(servicePeriodMore);
// null while «Mehr dazu» is closed
export const servicePeriodMoreOpen = Attribute.named('open').of(servicePeriodMore);
export const categoryLabelText = Text.of(categoryLabel);
export const chosenKey = Value.chosenIn(keySelect);
export const keyHelpText = Text.of(keyHelp);
