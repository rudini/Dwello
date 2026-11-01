import { Accessible, Checked, Count, Enabled, HiddenText, Text, Visibility } from '../screenplay/questions';
import {
	allocabilityQuestion,
	allocabilityText,
	allowanceOption,
	allowedBadge,
	categoryRow,
	deleteButton,
	description,
	descriptionInput,
	contractNote,
	formReason,
	formReasonLabel,
	allowanceQuestion,
	heatingCheckbox,
	heatingHelp,
	kindBadge,
	predefinedHint,
	proposal,
	reason,
	usage
} from '../targets/categories';

export const categoryListed = (name: string) => Visibility.of(categoryRow(name));
export const listedCategoriesNamed = (name: string) => Count.of(categoryRow(name));
export const allowance = (name: string) => Text.of(allowedBadge(name));
export const invoicesOf = (name: string) => Text.of(usage(name));
export const categoryDeletable = (name: string) => Enabled.of(deleteButton(name));
export const descriptionOf = (name: string) => Text.of(description(name));
export const notAllowedChosen = Checked.of(allowanceOption('Nicht umlagefähig'));
export const allowedChosen = Checked.of(allowanceOption('Umlagefähig'));
export const proposalText = Text.of(proposal);
export const reasonOf = (name: string) => Text.of(reason(name));
export const reasonsOf = (name: string) => Count.of(reason(name));
export const contractHint = Text.of(contractNote);
export const formReasonText = Text.of(formReason);
export const formReasonLabelText = Text.of(formReasonLabel);
export const allowanceQuestionDescription = Accessible.descriptionOf(allowanceQuestion);
export const hiddenDescription = HiddenText.of(descriptionInput);
export const kindOf = (name: string) => Text.of(kindBadge(name));
export const whyNotDeletable = (name: string) => Accessible.descriptionOf(deleteButton(name));
export const predefinedHintText = Text.of(predefinedHint);
export const heatingChangeable = Enabled.of(heatingCheckbox);
export const heatingChecked = Checked.of(heatingCheckbox);
export const heatingHelpText = Text.of(heatingHelp);
export const allocabilityQuestionText = Text.of(allocabilityQuestion);
export const allocabilityConsequence = Text.of(allocabilityText);
